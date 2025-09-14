import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useFormStore } from '@/hooks/use-form-store';
import { useTranslation } from '@/lib/translations';

export default function Landing() {
  const [, setLocation] = useLocation();
  const { isEnglish } = useFormStore();
  const t = useTranslation(isEnglish);

  const handleStart = () => {
    setLocation('/step-1');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-secondary mb-4" data-testid="main-title">
          {t('reidentify_title')}
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto" data-testid="main-subtitle">
          {t('reidentify_subtitle')}
        </p>
      </div>

      {/* Why Re-identify Section */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-semibold mb-4 text-secondary" data-testid="why-title">
            {t('why_reidentify')}
          </h2>
          <p className="text-muted-foreground mb-4" data-testid="why-description-1">
            {t('why_description')}
          </p>
          <p className="text-muted-foreground" data-testid="why-description-2">
            Er zijn ook klanten die we hebben geïdentificeerd met een identiteitsbewijs waar niet alle gegevens op staan. We zijn volgens die wet verplicht om jou te identificeren en zeker te weten dat je bent wie je zegt dat je bent.
          </p>
        </CardContent>
      </Card>

      {/* What You Need Section */}
      <div className="bg-accent rounded-lg p-8 mb-8">
        <h3 className="text-xl font-semibold mb-4 text-accent-foreground" data-testid="requirements-title">
          {t('what_you_need')}
        </h3>
        <ul className="space-y-2 text-accent-foreground">
          <li className="flex items-center space-x-2" data-testid="requirement-passport">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            <span>{t('need_passport')}</span>
          </li>
          <li className="flex items-center space-x-2" data-testid="requirement-phone">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            <span>{t('need_phone')}</span>
          </li>
          <li className="flex items-center space-x-2" data-testid="requirement-app">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            <span>{t('need_app')}</span>
          </li>
        </ul>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold mb-2 text-blue-900" data-testid="security-title">
          {t('security_title')}
        </h3>
        <p className="text-blue-800" data-testid="security-description">
          {t('security_description')}
        </p>
      </div>

      {/* Start Button */}
      <div className="text-center">
        <Button
          onClick={handleStart}
          size="lg"
          className="bg-primary text-primary-foreground px-8 py-4 text-lg font-semibold hover:opacity-90"
          data-testid="button-start"
        >
          {t('start_process')}
        </Button>
      </div>
    </div>
  );
}
