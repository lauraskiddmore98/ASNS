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

  const onSubmit = (data: Step1Data) => {
    updateFormData(data);
    setCurrentStep(1);
    setLocation('/step-2');
  };

  const handleBack = () => {
    setLocation('/');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-2xl font-semibold mb-6 text-secondary" data-testid="step-title">
            {t('step_1_title')}
          </h2>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel data-testid="label-username">{t('username')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('username')} {...field} data-testid="input-username" />
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
                    <FormLabel data-testid="label-fullname">{t('full_name')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('full_name')} {...field} data-testid="input-fullname" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accountTypes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel data-testid="label-accounttypes">{t('account_types')}</FormLabel>
                    <div className="flex flex-wrap gap-4 mt-2">
                      {(['private', 'business', 'creditcard'] as const).map((type) => (
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
                            data-testid={`checkbox-${type}`}
                          />
                          <label
                            htmlFor={type}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            data-testid={`label-${type}`}
                          >
                            {t(type)}
                          </label>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
