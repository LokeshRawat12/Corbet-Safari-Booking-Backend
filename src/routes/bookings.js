import { Router } from 'express'
import Booking from '../models/Booking.js'
import nodemailer from 'nodemailer'
import crypto from 'crypto'
import axios from 'axios'
import Razorpay from 'razorpay'

const router = Router()

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_YourKeyHere',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'YourSecretHere',
});

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

function maskIdentityProof(booking) {
  const data = booking.toObject ? booking.toObject() : booking;
  if (data.identityProofNumber) {
    data.identityProofNumber = `****${data.identityProofNumber.slice(-4)}`;
  }
  return data;
}

// Get all bookings
router.get('/bookings', async (req, res, next) => {
  try {
    const bookings = await Booking.find().sort({ submittedAt: -1 })
    res.json(bookings.map(maskIdentityProof))
  } catch (error) {
    next(error)
  }
})

// Get single booking
router.get('/bookings/:id', async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' })
    }
    res.json(maskIdentityProof(booking))
  } catch (error) {
    next(error)
  }
})

// Create new booking
router.post('/bookings', async (req, res, next) => {
  try {
    const payload = req.body
    const booking = new Booking(payload)
    await booking.save()

    // Send email notification to admin in background
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      subject: `[PAYMENT PENDING] New Safari Booking: ${payload.packageTitle || 'General Request'}`,
      text: `
        ⚠️ NEW BOOKING INITIATED (Payment Pending)
        ----------------------------
        Customer: ${payload.name}
        Email: ${payload.email}
        Phone: ${payload.phone}
        Date: ${payload.date}
        Package: ${payload.packageTitle}
        Guests: ${payload.adults} Adults, ${payload.children} Children
        Payment Type: ${payload.paymentType === 'half' ? 'Half Payment (50%)' : 'Full Payment'}
        Amount Paid: ${payload.amountPaid}
        Amount Remaining: ${payload.amountRemaining}
        Hotel Required: ${payload.hotelRequired ? 'Yes' : 'No'}
        Hotel Name: ${payload.hotelName || 'N/A'}
        Notes: ${payload.notes || 'None'}
        ----------------------------
        MDB ID: ${booking._id}
      `,
    }

    transporter.sendMail(mailOptions)
      .then(() => console.log('Booking email sent to admin.'))
      .catch(err => console.error('Failed to send booking email notification:', err));


    // 💳 PAYMENT INITIALIZATION (Razorpay)
    let paymentData = null;
    let paymentError = null;

    if (booking.amountPaid > 0) {
      console.log(`\n--- Initiating Razorpay for Booking: ${booking._id} ---`);
      
      try {
        const options = {
          amount: Math.round(booking.amountPaid * 100), // Amount in paise
          currency: "INR",
          receipt: booking._id.toString(),
          notes: {
            bookingId: booking._id.toString(),
            customerName: booking.name,
            package: booking.packageTitle
          }
        };

        const order = await razorpay.orders.create(options);
        
        if (order) {
          paymentData = {
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.RAZORPAY_KEY_ID
          };
          console.log('✅ Razorpay Order Generated:', order.id);
        }
      } catch (err) {
        paymentError = err.message;
        console.error('❌ Razorpay order creation failed:', err.message);
      }
    }

    if (paymentData) {
      res.status(201).json({ ...booking.toObject(), razorpayOrder: paymentData });
    } else if (booking.amountPaid > 0) {
      res.status(500).json({ 
        error: 'Payment Gateway Error', 
        details: paymentError || 'Unknown gateway error.',
        bookingId: booking._id 
      });
    } else {
      res.status(201).json(booking);
    }
  } catch (error) {
    next(error)
  }
})

// Verify Razorpay payment
router.post('/bookings/:id/verify-razorpay', async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const bookingId = req.params.id;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    // Verify signature
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'YourSecretHere');
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature) {
      booking.status = 'paid';
      booking.transactionId = razorpay_payment_id;
      await booking.save();

      // Notify admin in background
      const confirmMailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_TO || process.env.EMAIL_USER,
        subject: `✅ PAYMENT CONFIRMED: Booking #${booking._id.toString().slice(-6)}`,
        text: `
          Payment Received Successfully (Razorpay)!
          ----------------------------
          Booking ID: ${booking._id}
          Customer: ${booking.name}
          Paid Amount: INR ${booking.amountPaid}
          Payment ID: ${razorpay_payment_id}
          Order ID: ${razorpay_order_id}
          ----------------------------
        `,
      };

      transporter.sendMail(confirmMailOptions)
        .then(() => console.log('Payment confirmation email sent.'))
        .catch(err => console.error('Email error:', err));

      return res.json({ success: true, booking });
    } else {
      return res.status(400).json({ success: false, error: 'Invalid signature' });
    }
  } catch (error) {
    next(error);
  }
});
// Update booking status
router.patch('/bookings/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { returnDocument: 'after' }
    );
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    next(error);
  }
});

// Delete booking
router.delete('/bookings/:id', async (req, res, next) => {
  try {
    await Booking.findByIdAndDelete(req.params.id)
    res.json({ message: 'Booking deleted' })
  } catch (error) {
    next(error)
  }
})

export default router
