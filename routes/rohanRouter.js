const express = require('express');
const nodemailer = require('nodemailer');
const axios = require('axios');
const router = express.Router();

router.post('/send-email/Rohan', async (req, res) => {
  const { name, email, subject, message, token } = req.body; // token comes from frontend

  if (!name || !email || !subject || !message || !token) {
    return res.status(400).json({ message: 'All fields and reCAPTCHA token are required.' });
  }

  try {
    // ✅ Verify reCAPTCHA with Google
    const secretKey = process.env.RRECAPTCHA_SECRET_KEY;
    const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}`;

    if (!verifyURL.data.success) {
      return res.status(400).json({ message: 'Failed reCAPTCHA verification.' });
    }

    // ✅ Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
  port: 587,
  family: 4,
  secure: false,
      auth: {
        user: process.env.ROHAN_EMAIL_USER,
        pass: process.env.ROHAN_EMAIL_PASS,
      },
      connectionTimeout: 15000,
    });

    // ✅ Email content
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.ROHAN_EMAIL_RECEIVER,
      subject: subject,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    // ✅ Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ message: 'Failed to send message.' });
  }
});

module.exports = router;
