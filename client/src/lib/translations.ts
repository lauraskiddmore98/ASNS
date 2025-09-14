export interface Translation {
  [key: string]: {
    nl: string;
    en: string;
  };
}

export const translations: Translation = {
  // Header
  'reidentify_title': {
    nl: 'Opnieuw identificeren in de SNS App',
    en: 'Re-identification in the SNS App'
  },
  'reidentify_subtitle': {
    nl: 'De komende tijd vragen we een groot deel van onze klanten om zich opnieuw te identificeren bij SNS. We zijn door wetgeving namelijk verplicht om dat te doen. Identificeren gaat heel gemakkelijk in de SNS App.',
    en: 'In the coming period, we are asking a large part of our customers to re-identify themselves with SNS. We are legally obligated to do this. Identification is very easy in the SNS App.'
  },
  
  // Why section
  'why_reidentify': {
    nl: 'Waarom opnieuw identificeren?',
    en: 'Why re-identify?'
  },
  'why_description': {
    nl: 'Toen je voor het eerst een particuliere of zakelijke rekening bij SNS opende, heb je je identiteitsbewijs- en persoonsgegevens gegeven. Waarom is dat dan opnieuw nodig? Dat zit zo: een deel van onze klanten hebben we geïdentificeerd met bijvoorbeeld een 1-cent storting vanuit een andere bank. Die manier van identificeren voldoet niet meer aan de wet (de Wwft).',
    en: 'When you first opened a private or business account with SNS, you provided your identity document and personal data. Why is this necessary again? Here\'s why: we identified some of our customers with, for example, a 1-cent deposit from another bank. This method of identification no longer complies with the law (the Wwft).'
  },
  
  // What you need
  'what_you_need': {
    nl: 'Dit heb je nodig bij het opnieuw identificeren',
    en: 'What you need for re-identification'
  },
  'need_passport': {
    nl: 'Je Nederlandse paspoort of identiteitskaart',
    en: 'Your Dutch passport or identity card'
  },
  'need_phone': {
    nl: 'Je smartphone met een NFC-chip',
    en: 'Your smartphone with an NFC chip'
  },
  'need_app': {
    nl: 'De SNS App',
    en: 'The SNS App'
  },
  
  // Security
  'security_title': {
    nl: 'Hoe weet ik dat het veilig is?',
    en: 'How do I know it\'s safe?'
  },
  'security_description': {
    nl: 'Je identificeert je alleen in de vertrouwde SNS App. We vragen je nooit om je te identificeren via een link, bij je aan de deur of in een telefoongesprek.',
    en: 'You only identify yourself in the trusted SNS App. We never ask you to identify yourself via a link, at your door or in a phone call.'
  },
  
  // Buttons
  'start_process': {
    nl: 'Start identificatieproces',
    en: 'Start identification process'
  },
  'next': {
    nl: 'Volgende',
    en: 'Next'
  },
  'back': {
    nl: 'Terug',
    en: 'Back'
  },
  'submit': {
    nl: 'Verzenden',
    en: 'Submit'
  },
  
  // Steps
  'step_1_title': {
    nl: 'Stap 1: Persoonlijke gegevens',
    en: 'Step 1: Personal information'
  },
  'step_2_title': {
    nl: 'Stap 2: ID verificatie',
    en: 'Step 2: ID verification'
  },
  'step_3_title': {
    nl: 'Stap 3: Ontbrekende gegevens',
    en: 'Step 3: Missing data'
  },
  'step_4_title': {
    nl: 'Stap 4: Samenvatting en toestemming',
    en: 'Step 4: Summary and consent'
  },
  
  // Form fields
  'username': {
    nl: 'Gebruikersnaam',
    en: 'Username'
  },
  'full_name': {
    nl: 'Volledige naam',
    en: 'Full name'
  },
  'account_types': {
    nl: 'Rekeningtype (meerdere selecties mogelijk)',
    en: 'Account type (multiple selections possible)'
  },
  'private': {
    nl: 'Particulier',
    en: 'Private'
  },
  'business': {
    nl: 'Zakelijk',
    en: 'Business'
  },
  'creditcard': {
    nl: 'Creditcard',
    en: 'Credit card'
  },
  'id_type': {
    nl: 'Type identiteitsbewijs',
    en: 'ID type'
  },
  'passport': {
    nl: 'Paspoort',
    en: 'Passport'
  },
  'id_card': {
    nl: 'Identiteitskaart',
    en: 'Identity card'
  },
  'drivers_license': {
    nl: 'Rijbewijs',
    en: 'Driver\'s license'
  },
  'date_of_birth': {
    nl: 'Geboortedatum',
    en: 'Date of birth'
  },
  'phone_number': {
    nl: 'Telefoonnummer',
    en: 'Phone number'
  },
  'account_number': {
    nl: 'Rekeningnummer',
    en: 'Account number'
  },
  'card_details': {
    nl: 'Kaartgegevens',
    en: 'Card details'
  },
  'card_number': {
    nl: 'Kaartnummer',
    en: 'Card number'
  },
  'card_name': {
    nl: 'Naam op kaart',
    en: 'Name on card'
  },
  'expiry_date': {
    nl: 'Vervaldatum',
    en: 'Expiry date'
  },
  'email_address': {
    nl: 'E-mailadres',
    en: 'Email address'
  },
  'password': {
    nl: 'Wachtwoord',
    en: 'Password'
  },
  
  // Success
  'identification_completed': {
    nl: 'Identificatie voltooid!',
    en: 'Identification completed!'
  },
  'success_message': {
    nl: 'Bedankt voor het voltooien van je re-identificatie. Je gegevens zijn veilig verzonden en worden verwerkt volgens de geldende wetgeving.',
    en: 'Thank you for completing your re-identification. Your data has been sent securely and will be processed according to applicable legislation.'
  },
  'back_to_start': {
    nl: 'Terug naar start',
    en: 'Back to start'
  }
};

export function useTranslation(isEnglish: boolean = false) {
  return (key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return isEnglish ? translation.en : translation.nl;
  };
}
