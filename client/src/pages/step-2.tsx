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

  const onSubmit = (data: Step2Data) => {
    updateFormData(data);
    setCurrentStep(2);
    setLocation('/step-3');
  };

  const handleBack = () => {
    setCurrentStep(0);
    setLocation('/step-1');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-2xl font-semibold mb-6 text-secondary" data-testid="step-title">
            {t('step_2_title')}
          </h2>
          
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
              <div className="bg-accent rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-accent-foreground" data-testid="card-details-title">
                  {t('card_details')}
                </h3>
                
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

              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  data-testid="button-back"
                >
                  {t('back')}
                </Button>
                <Button 
                  type="submit"
                  className="bg-primary text-primary-foreground hover:opacity-90"
                  data-testid="button-next"
                >
                  {t('next')}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
