'use client';

import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        {user ? (
          // Authenticated user view
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome back, {user.displayName || user.email}!
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Ready to manage your game collection?
            </p>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Add Games</h3>
                <p className="text-gray-600 mb-4">
                  Quickly add games to your collection with our search or AI scanning features.
                </p>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                  Add Games
                </button>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">View Collection</h3>
                <p className="text-gray-600 mb-4">
                  Browse and manage your existing game collection with filters and sorting.
                </p>
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
                  View Collection
                </button>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Statistics</h3>
                <p className="text-gray-600 mb-4">
                  Get insights about your collection with detailed statistics and charts.
                </p>
                <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors">
                  View Stats
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Guest user view
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-900 mb-6">
              Collectr
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              The collector-first platform for tracking and showcasing your physical game collection.
              Blend the completeness of Discogs with the social discovery of Letterboxd.
            </p>
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
                <h2 className="text-2xl font-semibold mb-4">Features</h2>
                <ul className="text-left space-y-2 text-gray-700">
                  <li>• Quick game search and add</li>
                  <li>• Complete condition tracking</li>
                  <li>• Public shelf sharing</li>
                  <li>• Comprehensive game database</li>
                  <li>• AI-powered cover recognition</li>
                </ul>
              </div>
              <div className="max-w-md mx-auto">
                <p className="text-gray-600 mb-4">
                  Ready to start cataloging your collection?
                </p>
                <div className="space-y-3">
                  <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-medium">
                    Get Started - It&apos;s Free!
                  </button>
                  <p className="text-sm text-gray-500">
                    Join thousands of collectors already using Collectr
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}