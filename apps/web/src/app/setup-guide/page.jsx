export default function SetupGuidePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            🚀 Setup Guide
          </h1>

          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Prerequisites
              </h2>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-3">
                  Required Software
                </h3>
                <ul className="text-blue-800 space-y-2">
                  <li>✓ Node.js 18 or higher</li>
                  <li>✓ npm or yarn package manager</li>
                  <li>✓ PostgreSQL database</li>
                  <li>✓ Git for version control</li>
                  <li>✓ Code editor (VS Code recommended)</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Step 1: Clone Repository
              </h2>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                {`git clone https://github.com/your-username/dogwalking-app.git
cd dogwalking-app`}
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Step 2: Install Dependencies
              </h2>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                npm install
              </div>
              <p className="text-gray-600 mt-2">
                This will install all required packages for both web and mobile
                apps.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Step 3: Database Setup
              </h2>
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-800 mb-2">
                    Local PostgreSQL
                  </h3>
                  <div className="bg-gray-900 text-green-400 p-3 rounded text-sm font-mono">
                    {`# Create database
createdb dogwalking_dev

# Connect to database
psql dogwalking_dev

# Import schema (you'll need to create this file from your current schema)
\\i schema.sql`}
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">
                    Cloud Database (Supabase)
                  </h3>
                  <ol className="text-green-700 space-y-2">
                    <li>1. Create account at supabase.com</li>
                    <li>2. Create new project</li>
                    <li>3. Copy connection string from settings</li>
                    <li>4. Import your schema via SQL editor</li>
                  </ol>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Step 4: Environment Variables
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">
                    Create .env.local file:
                  </h3>
                  <div className="bg-gray-900 text-green-400 p-3 rounded text-sm font-mono">
                    {`# Database
DATABASE_URL=postgresql://username:password@localhost:5432/dogwalking_dev

# Authentication
AUTH_SECRET=your-super-secure-random-string-here
AUTH_URL=http://localhost:3000

# File Storage (Uploadcare)
UPLOADCARE_PUBLIC_KEY=demopublickey
UPLOADCARE_SECRET_KEY=your-secret-key

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000`}
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-orange-800 mb-2">
                    Getting API Keys
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <strong className="text-orange-900">
                        Google Maps API:
                      </strong>
                      <ol className="text-orange-700 text-sm mt-1 space-y-1">
                        <li>1. Go to Google Cloud Console</li>
                        <li>2. Create new project or select existing</li>
                        <li>3. Enable Maps JavaScript API</li>
                        <li>4. Create credentials (API key)</li>
                        <li>5. Restrict key to your domains</li>
                      </ol>
                    </div>

                    <div>
                      <strong className="text-orange-900">Uploadcare:</strong>
                      <ol className="text-orange-700 text-sm mt-1 space-y-1">
                        <li>1. Sign up at uploadcare.com</li>
                        <li>2. Create new project</li>
                        <li>3. Copy public and secret keys</li>
                        <li>4. Configure image processing settings</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Step 5: Start Development Servers
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Web App</h3>
                  <div className="bg-gray-900 text-green-400 p-3 rounded text-sm font-mono">
                    npm run dev
                  </div>
                  <p className="text-blue-800 text-sm mt-2">
                    Opens at http://localhost:3000
                  </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-900 mb-2">
                    Mobile App
                  </h3>
                  <div className="bg-gray-900 text-green-400 p-3 rounded text-sm font-mono">
                    cd apps/mobile
                    <br />
                    npx expo start
                  </div>
                  <p className="text-purple-800 text-sm mt-2">
                    Scan QR code with Expo Go app
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Step 6: Verify Setup
              </h2>
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-3">
                    ✅ Checklist
                  </h3>
                  <ul className="text-green-700 space-y-2">
                    <li>□ Web app loads without errors</li>
                    <li>□ Database connection works</li>
                    <li>□ User registration/login works</li>
                    <li>□ File upload works (try adding pet photo)</li>
                    <li>□ Mobile app connects to backend</li>
                    <li>□ Google Maps displays correctly</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Development Tools
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">
                    Recommended VS Code Extensions
                  </h3>
                  <ul className="text-sm space-y-1">
                    <li>• ES7+ React/Redux/React-Native snippets</li>
                    <li>• Prettier - Code formatter</li>
                    <li>• ESLint</li>
                    <li>• Tailwind CSS IntelliSense</li>
                    <li>• PostgreSQL</li>
                    <li>• REST Client (for API testing)</li>
                  </ul>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Mobile Development</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Install Expo Go on your phone</li>
                    <li>• Connect to same WiFi network</li>
                    <li>• Use iOS Simulator / Android Emulator</li>
                    <li>• Enable debug mode for development</li>
                    <li>• Install React Developer Tools</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Troubleshooting
              </h2>
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <h3 className="font-semibold text-red-800 mb-2">
                    Common Issues
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <strong className="text-red-900">
                        Database connection fails:
                      </strong>
                      <p className="text-red-700 text-sm">
                        Check DATABASE_URL format and ensure PostgreSQL is
                        running
                      </p>
                    </div>

                    <div>
                      <strong className="text-red-900">
                        Module not found errors:
                      </strong>
                      <p className="text-red-700 text-sm">
                        Delete node_modules and package-lock.json, then run npm
                        install
                      </p>
                    </div>

                    <div>
                      <strong className="text-red-900">
                        Expo app won't connect:
                      </strong>
                      <p className="text-red-700 text-sm">
                        Ensure both devices are on same network, try tunnel mode
                      </p>
                    </div>

                    <div>
                      <strong className="text-red-900">
                        Maps not loading:
                      </strong>
                      <p className="text-red-700 text-sm">
                        Verify Google Maps API key and billing is enabled
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Next Steps
              </h2>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Ready to develop! 🎉
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    📖 Read the{" "}
                    <a
                      href="/documentation"
                      className="text-blue-600 hover:underline"
                    >
                      full documentation
                    </a>
                  </li>
                  <li>
                    🔌 Explore{" "}
                    <a
                      href="/api-docs"
                      className="text-blue-600 hover:underline"
                    >
                      API endpoints
                    </a>
                  </li>
                  <li>🎨 Customize the design and features</li>
                  <li>🚀 Deploy to production when ready</li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
