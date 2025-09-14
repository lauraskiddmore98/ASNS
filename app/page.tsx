export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      {/* SNS Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">SNS</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">SNS Bank</h1>
                <p className="text-sm text-gray-600">Veilig bankieren</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-sm text-gray-600 hover:text-gray-900">🇳🇱 Nederlands</button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Re-identificatie vereist</h1>
            <p className="text-lg text-gray-600 mb-6">
              Om te voldoen aan de Wet ter voorkoming van witwassen en financieren van terrorisme (Wwft), moeten wij uw
              identiteit opnieuw verifiëren.
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <span className="ml-2 text-sm text-gray-600">Inloggen</span>
              </div>
              <div className="w-8 h-px bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <span className="ml-2 text-sm text-gray-600">Persoonlijke gegevens</span>
              </div>
              <div className="w-8 h-px bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <span className="ml-2 text-sm text-gray-600">Identiteitsverificatie</span>
              </div>
              <div className="w-8 h-px bg-gray-300"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                  4
                </div>
                <span className="ml-2 text-sm text-gray-600">Betalingsgegevens</span>
              </div>
            </div>
          </div>

          {/* Information Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-2">🔒 Veilig en vertrouwd</h3>
              <p className="text-blue-800 text-sm">
                Dit proces is volledig beveiligd en voldoet aan alle Nederlandse bankwetgeving.
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-semibold text-green-900 mb-2">⏱️ Snel en eenvoudig</h3>
              <p className="text-green-800 text-sm">
                Het hele proces duurt slechts 5-10 minuten en kan volledig online worden voltooid.
              </p>
            </div>
          </div>

          {/* Important Information */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-orange-900 mb-3">📋 Wat heeft u nodig?</h3>
            <ul className="text-orange-800 text-sm space-y-2">
              <li>• Een geldig Nederlands identiteitsbewijs (paspoort, ID-kaart of rijbewijs)</li>
              <li>• Uw SNS Bank inloggegevens</li>
              <li>• Een werkende camera of smartphone voor het maken van foto's</li>
              <li>• Ongeveer 5-10 minuten van uw tijd</li>
            </ul>
          </div>

          {/* Action Button */}
          <div className="text-center">
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-lg transition-colors">
              Start re-identificatie proces
            </button>
            <p className="text-xs text-gray-500 mt-4">
              Door verder te gaan gaat u akkoord met onze voorwaarden en privacybeleid
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>© 2024 SNS Bank N.V. Alle rechten voorbehouden.</p>
            <p className="mt-2">
              SNS Bank is onderdeel van de Volksbank en staat onder toezicht van De Nederlandsche Bank en de Autoriteit
              Financiële Markten.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
