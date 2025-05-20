const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

router.post('/send-email/Shravan', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // You can change this (like Mailtrap, Outlook, etc.)
      auth: {
        user: process.env.SHRAVAN_EMAIL_USER,
        pass: process.env.SHRAVAN_EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.SHRAVAN_EMAIL_RECEIVER,
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

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ message: 'Failed to send message.' });
  }
});

module.exports = router;
