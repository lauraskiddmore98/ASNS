import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useFormStore } from '@/hooks/use-form-store';
import { useTranslation } from '@/lib/translations';
import { CheckCircle, Smartphone, CreditCard, Shield, AlertTriangle } from 'lucide-react';

export default function Landing() {
  const [, setLocation] = useLocation();
  const { isEnglish } = useFormStore();
  const t = useTranslation(isEnglish);

  const handleStart = () => {
    setLocation('/step-1');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* SNS Bank Header */}
      <div className="bg-primary text-white py-6">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold" data-testid="sns-logo">SNS Bank</h1>
              <p className="text-orange-100 mt-1">Opnieuw identificeren</p>
            </div>
            <div className="text-right text-sm text-orange-100">
              <p>Veilig • Vertrouwd • Noodzakelijk</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Main Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-secondary mb-4" data-testid="main-title">
            Opnieuw identificeren bij SNS Bank
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="main-subtitle">
            De komende tijd vragen we een groot deel van onze klanten om zich opnieuw te identificeren bij SNS. 
            We zijn door wetgeving namelijk verplicht om dat te doen.
          </p>
        </div>

        {/* Why Re-identify Section */}
        <Card className="mb-8 border-l-4 border-l-primary">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-secondary" data-testid="why-title">
                  Waarom opnieuw identificeren?
                </h2>
                <p className="text-muted-foreground mb-4" data-testid="why-description-1">
                  Toen je voor het eerst een particuliere of zakelijke rekening bij SNS opende, heb je je identiteitsbewijs- en persoonsgegevens gegeven. 
                  Een deel van onze klanten hebben we geïdentificeerd met bijvoorbeeld een 1-cent storting vanuit een andere bank. 
                  Die manier van identificeren voldoet niet meer aan de wet (de Wwft).
                </p>
                <p className="text-muted-foreground" data-testid="why-description-2">
                  Er zijn ook klanten die we hebben geïdentificeerd met een identiteitsbewijs waar niet alle gegevens op staan. 
                  We zijn volgens die wet verplicht om jou te identificeren en zeker te weten dat je bent wie je zegt dat je bent. 
                  We moeten persoonsgegevens opslaan in ons klantenbestand.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What You Need Section */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-8 mb-8">
          <h3 className="text-xl font-semibold mb-6 text-secondary flex items-center gap-2" data-testid="requirements-title">
            <CheckCircle className="h-6 w-6 text-primary" />
            Dit heb je nodig bij het opnieuw identificeren
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg border border-orange-200">
              <CreditCard className="h-12 w-12 text-primary mb-3" />
              <h4 className="font-semibold text-secondary mb-2">Nederlandse ID</h4>
              <p className="text-sm text-muted-foreground" data-testid="requirement-passport">
                Je Nederlandse paspoort of identiteitskaart (met een rijbewijs kan het niet)
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg border border-orange-200">
              <Smartphone className="h-12 w-12 text-primary mb-3" />
              <h4 className="font-semibold text-secondary mb-2">Smartphone</h4>
              <p className="text-sm text-muted-foreground" data-testid="requirement-phone">
                Je smartphone met een NFC-chip (op een tablet kan het niet)
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg border border-orange-200">
              <Shield className="h-12 w-12 text-primary mb-3" />
              <h4 className="font-semibold text-secondary mb-2">Toegang tot SNS</h4>
              <p className="text-sm text-muted-foreground" data-testid="requirement-app">
                Je SNS inloggegevens en toegang tot je account
              </p>
            </div>
          </div>
        </div>

        {/* How it Works Section */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-6 text-secondary">
              Zo werkt het
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                <div>
                  <h4 className="font-semibold text-secondary">Inloggen en verificatie</h4>
                  <p className="text-muted-foreground text-sm">Login met je gebruikersnaam en volledige naam voor verificatie.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                <div>
                  <h4 className="font-semibold text-secondary">Persoonlijke gegevens</h4>
                  <p className="text-muted-foreground text-sm">Vul je persoonlijke gegevens en contactinformatie in.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                <div>
                  <h4 className="font-semibold text-secondary">ID verificatie</h4>
                  <p className="text-muted-foreground text-sm">Voer je identiteitsgegevens en Digicode in voor verificatie.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                <div>
                  <h4 className="font-semibold text-secondary">Betaalgegevens</h4>
                  <p className="text-muted-foreground text-sm">Verifieer je SNS betaalkaart gegevens voor volledige identificatie.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-4">
            <Shield className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold mb-2 text-blue-900" data-testid="security-title">
                Hoe weet ik dat het veilig is?
              </h3>
              <p className="text-blue-800 mb-2" data-testid="security-description">
                Je identificeert je alleen via het vertrouwde SNS systeem. We vragen je nooit om je te identificeren via een link, bij je aan de deur of in een telefoongesprek.
              </p>
              <p className="text-blue-800 text-sm">
                <strong>Let op:</strong> Deze gegevens worden verzonden voor re-identificatie volgens Wwft wetgeving.
              </p>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="text-center">
          <Button
            onClick={handleStart}
            size="lg"
            className="bg-primary hover:bg-orange-600 text-white px-12 py-4 text-lg font-semibold rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"
            data-testid="button-start"
          >
            Start Re-identificatie Process
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Het proces duurt ongeveer 5-10 minuten
          </p>
        </div>
      </div>
    </div>
  );
}
