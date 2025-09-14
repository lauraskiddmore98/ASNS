import { useFormStore } from '@/hooks/use-form-store';
import { Button } from '@/components/ui/button';

export function LanguageToggle() {
  const { isEnglish, toggleLanguage } = useFormStore();

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        onClick={toggleLanguage}
        variant="default"
        size="sm"
        className="bg-primary text-primary-foreground hover:opacity-90"
        data-testid="language-toggle"
      >
        {isEnglish ? 'NL' : 'EN'}
      </Button>
    </div>
  );
}
