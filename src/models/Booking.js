import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  country: { type: String, default: 'India' },
  identityProofType: String,
  identityProofNumber: String,
  date: { type: String, required: true },
  adults: { type: Number, default: 1 },
  children: { type: Number, default: 0 },
  packageTitle: String,
  packageSlug: String,
  packagePrice: Number,
  packageCurrency: { type: String, default: '₹' },
  paymentType: { type: String, enum: ['full', 'half'], default: 'full' },
  amountPaid: { type: Number, default: 0 },
  amountRemaining: { type: Number, default: 0 },
  transactionId: String,
  hotelRequired: { type: Boolean, default: false },
  hotelName: String,
  tourismZone: String,
  notes: String,
  status: { type: String, default: 'pending' },
  submittedAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
