export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            🐕 DogWalking App Documentation
          </h1>

          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Project Overview
              </h2>
              <p className="text-gray-600 leading-relaxed">
                A comprehensive mobile and web platform connecting pet owners
                with trusted dog walkers. Built with modern technologies for
                seamless booking, tracking, and management of dog walking
                services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Key Features
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    For Pet Owners
                  </h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Pet profile management with photos</li>
                    <li>• Walker discovery and booking</li>
                    <li>• Real-time walk tracking</li>
                    <li>• Photo updates during walks</li>
                    <li>• Secure payment processing</li>
                  </ul>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">
                    For Dog Walkers
                  </h3>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Professional profile creation</li>
                    <li>• Flexible scheduling</li>
                    <li>• GPS navigation for walks</li>
                    <li>• Photo sharing with owners</li>
                    <li>• Earnings tracking</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Technical Architecture
              </h2>
              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-2">Frontend</h4>
                    <p>• Web: Next.js 14 with App Router</p>
                    <p>• Mobile: React Native with Expo</p>
                    <p>• State: Zustand + TanStack Query</p>
                    <p>• Styling: Tailwind CSS</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Backend</h4>
                    <p>• Runtime: Node.js serverless</p>
                    <p>• Database: PostgreSQL</p>
                    <p>• Auth: NextAuth.js</p>
                    <p>• Files: Uploadcare</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                API Endpoints
              </h2>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold">Authentication</h4>
                  <p className="text-sm text-gray-600">
                    POST /api/auth/signin, /api/auth/signup
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold">Pet Management</h4>
                  <p className="text-sm text-gray-600">
                    GET, POST, PUT, DELETE /api/pets
                  </p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h4 className="font-semibold">Booking System</h4>
                  <p className="text-sm text-gray-600">
                    GET, POST, PUT /api/bookings
                  </p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-semibold">Walker Services</h4>
                  <p className="text-sm text-gray-600">
                    GET /api/walkers/search, POST /api/walker-profiles
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Database Schema
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded">
                  <h4 className="font-semibold mb-2">Core Tables</h4>
                  <ul className="text-sm space-y-1">
                    <li>
                      • <strong>auth_users</strong> - User accounts
                    </li>
                    <li>
                      • <strong>pets</strong> - Pet profiles
                    </li>
                    <li>
                      • <strong>walker_profiles</strong> - Walker info
                    </li>
                    <li>
                      • <strong>bookings</strong> - Walk bookings
                    </li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <h4 className="font-semibold mb-2">Relationships</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Users can have multiple pets</li>
                    <li>• Users can create walker profiles</li>
                    <li>• Bookings connect owners & walkers</li>
                    <li>• Photos stored per booking</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Deployment Options
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-blue-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Cloud Platform (Recommended)
                  </h4>
                  <p className="text-sm text-blue-800 mb-2">
                    Vercel + Supabase + Uploadcare
                  </p>
                  <p className="text-sm text-blue-600">Cost: ~€60-85/month</p>
                  <p className="text-sm text-blue-600">
                    Zero server management
                  </p>
                </div>
                <div className="border border-green-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">
                    Self-Hosted
                  </h4>
                  <p className="text-sm text-green-800 mb-2">
                    VPS + PostgreSQL + File Storage
                  </p>
                  <p className="text-sm text-green-600">Cost: ~€45-80/month</p>
                  <p className="text-sm text-green-600">
                    Full control, manual management
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Mobile App Structure
              </h2>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Navigation</h4>
                <p className="text-sm mb-3">
                  Tab Navigation: Home, Bookings, Favorites, Profile
                </p>
                <h4 className="font-semibold mb-2">Key Screens</h4>
                <ul className="text-sm space-y-1">
                  <li>• Home dashboard with quick actions</li>
                  <li>• Pet management with photo upload</li>
                  <li>• Walker search and filtering</li>
                  <li>• Booking flow and scheduling</li>
                  <li>• Profile settings and preferences</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Getting Started
              </h2>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
                <pre className="text-sm">
                  {`git clone <repository-url>
npm install
cp .env.example .env.local
# Edit .env.local with your configuration
npm run dev`}
                </pre>
              </div>
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800">
                  Required Environment Variables:
                </h4>
                <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                  <li>• DATABASE_URL - PostgreSQL connection string</li>
                  <li>• AUTH_SECRET - Secure random string for auth</li>
                  <li>• UPLOADCARE_PUBLIC_KEY - File upload service</li>
                  <li>• NEXT_PUBLIC_GOOGLE_MAPS_API_KEY - Maps integration</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
