export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Collectr
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            The collector-first platform for tracking and showcasing your physical game collection.
            Blend the completeness of Discogs with the social discovery of Letterboxd.
          </p>
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
              <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
              <ul className="text-left space-y-2 text-gray-700">
                <li>• Quick game search and add</li>
                <li>• Complete condition tracking</li>
                <li>• Public shelf sharing</li>
                <li>• Comprehensive game database</li>
                <li>• Barcode scanning (PWA)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}