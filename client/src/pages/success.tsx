import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { useFormStore } from '@/hooks/use-form-store';
import { useTranslation } from '@/lib/translations';

export default function Success() {
  const [, setLocation] = useLocation();
  const { resetForm, isEnglish } = useFormStore();
  const t = useTranslation(isEnglish);

  const handleBackToStart = () => {
    resetForm();
    setLocation('/');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Card>
        <CardContent className="pt-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" data-testid="success-icon" />
          </div>
          
          <h2 className="text-2xl font-semibold mb-4 text-secondary" data-testid="success-title">
            {t('identification_completed')}
          </h2>
          
          <p className="text-muted-foreground mb-6" data-testid="success-message">
            {t('success_message')}
          </p>
          
          <Button
            onClick={handleBackToStart}
            className="bg-primary text-primary-foreground px-6 py-2 hover:opacity-90"
            data-testid="button-backtostart"
          >
            {t('back_to_start')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
