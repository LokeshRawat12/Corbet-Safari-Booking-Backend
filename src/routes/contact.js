import { Router } from 'express'
import nodemailer from 'nodemailer'
import Contact from '../models/Contact.js'

const router = Router()

// Create transporter once for better performance
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

// Verify transporter configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('📧 Nodemailer verification failed:', error.message)
  } else {
    // eslint-disable-next-line no-console
    console.log('📧 Nodemailer is ready to send messages')
  }
})

router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body

    // Simple validation
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: 'All fields are required.' })
    }

    // Save to database
    try {
      const newContact = new Contact({ name, email, phone, message });
      await newContact.save();
      console.log('✅ Contact saved to database');
    } catch (dbErr) {
      console.error('❌ Failed to save contact to database:', dbErr.message);
      // We continue even if DB save fails, as email is primary
    }

    // eslint-disable-next-line no-console
    console.log(`📩 New message from ${name} (${email})`)

    const mailOptions = {
      from: `"${name}" <${process.env.EMAIL_USER}>`, // Sent through your account but shows their name
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      replyTo: email, // So you can reply directly to the sender
      subject: `New Contact Form: ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Message: ${message}
      `,
    }

    // Send email in the background - DO NOT await if we want speed
    transporter.sendMail(mailOptions)
      .then(() => console.log('✅ Email sent successfully!'))
      .catch(err => console.error('❌ Email failed to send in background:', err.message));

    // Return success immediately after saving to DB
    res.status(200).json({ message: 'Message sent successfully!' })
  } catch (error) {
    // This catch now only handles validation or DB save errors (if they were awaited)
    console.error('❌ Contact submission error:', error.message)
    res.status(500).json({ error: 'Failed to process request.' })
  }
})

// Get all contact messages (Admin)
router.get('/contact', async (req, res, next) => {
  try {
    const messages = await Contact.find().sort({ submittedAt: -1 })
    res.json(messages)
  } catch (error) {
    next(error)
  }
})

// Delete contact message
router.delete('/contact/:id', async (req, res, next) => {
  try {
    await Contact.findByIdAndDelete(req.params.id)
    res.json({ message: 'Message deleted' })
  } catch (error) {
    next(error)
  }
})

export default router
