const express = require('express');
const nodemailer = require('nodemailer');
const axios = require('axios'); // ✅ Needed for reCAPTCHA verification
const router = express.Router();

router.post('/send-email/Shravan', async (req, res) => {
  const { name, email, subject, message, captcha } = req.body;

  if (!name || !email || !subject || !message || !captcha) {
    return res.status(400).json({ message: 'All fields and captcha are required.' });
  }

  try {
    // ✅ Verify reCAPTCHA with Google
    const secretKey = process.env.SRECAPTCHA_SECRET_KEY;
    const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}`;

    const captchaRes = await axios.post(verifyURL);
    if (!captchaRes.data.success) {
      return res.status(400).json({ message: 'Captcha verification failed.' });
    }

    // ✅ Create transporter
    const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.SHRAVAN_EMAIL_USER,
    pass: process.env.SHRAVAN_EMAIL_PASS,
  },
  connectionTimeout: 15000,
});


    // ✅ Email content
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
