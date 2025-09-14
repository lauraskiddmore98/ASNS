import type { VercelRequest, VercelResponse } from '@vercel/node';
import { formDataSchema } from '../../shared/schema';
import { sendEmail, generateReidentificationEmail } from '../../server/services/resend';
import { z } from 'zod';

// Type definitions for storage
interface Submission {
  id: string;
  submissionData: any;
  submittedAt: Date;
  emailSent: string;
}

// In-memory storage for Vercel (you'll want to use a database for production)
let submissions: Submission[] = [];

const storage = {
  createReidentificationSubmission: async (data: { submissionData: any }) => {
    const submission: Submission = {
      id: Math.random().toString(36).substr(2, 9),
      submissionData: data.submissionData,
      submittedAt: new Date(),
      emailSent: "false"
    };
    submissions.push(submission);
    return submission;
  },
  updateReidentificationEmailStatus: async (id: string, status: string) => {
    const submission = submissions.find(s => s.id === id);
    if (submission) {
      submission.emailSent = status;
    }
  }
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Validate the form data
    const validatedData = formDataSchema.parse(req.body);
    
    // Store the submission
    const submission = await storage.createReidentificationSubmission({
      submissionData: validatedData
    });
    
    // Generate email content
    const emailContent = generateReidentificationEmail(validatedData);
    
    // Only send email if both environment variables are set
    let emailSent = false;
    if (process.env.ADMIN_EMAIL && process.env.FROM_EMAIL) {
      // Send email using Resend
      const emailParams = {
        to: process.env.ADMIN_EMAIL,
        from: process.env.FROM_EMAIL,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text
      };
      emailSent = await sendEmail(emailParams);
    } else {
      console.log('Email not sent - ADMIN_EMAIL or FROM_EMAIL not configured');
      console.log('Would send email to:', process.env.ADMIN_EMAIL || 'undefined');
      console.log('Subject:', emailContent.subject);
    }
    
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
}
