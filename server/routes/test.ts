import express from 'express';
import { sendEmail } from '../services/resend';

const router = express.Router();

router.post('/test-email', async (req, res) => {
  try {
    const sent = await sendEmail({
      to: process.env.ADMIN_EMAIL || '',
      from: process.env.FROM_EMAIL || '',
      subject: 'Test Email from ASNS',
      text: 'This is a test email to verify the email service is working correctly.',
      html: `
        <h1>Test Email</h1>
        <p>This is a test email to verify the email service is working correctly.</p>
        <p>If you received this email, the email service is configured properly!</p>
      `
    });

    if (sent) {
      res.json({ success: true, message: 'Test email sent successfully' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to send test email' });
    }
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({ success: false, message: 'Error sending test email', error: error.message });
  }
});