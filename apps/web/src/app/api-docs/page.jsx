export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            🔌 API Documentation
          </h1>

          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Base URL
              </h2>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono">
                https://yourdomain.com/api
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Authentication
              </h2>
              <div className="space-y-6">
                <div className="border border-blue-200 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    POST /auth/signin
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Sign in existing user
                  </p>
                  <div className="bg-gray-100 p-3 rounded text-sm">
                    <strong>Body:</strong>
                    <br />
                    {"{ email: string, password: string }"}
                  </div>
                  <div className="bg-green-50 p-3 rounded text-sm mt-2">
                    <strong>Response:</strong>
                    <br />
                    {"{ user: User, session: Session }"}
                  </div>
                </div>

                <div className="border border-green-200 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">
                    POST /auth/signup
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Register new user
                  </p>
                  <div className="bg-gray-100 p-3 rounded text-sm">
                    <strong>Body:</strong>
                    <br />
                    {"{ name: string, email: string, password: string }"}
                  </div>
                  <div className="bg-green-50 p-3 rounded text-sm mt-2">
                    <strong>Response:</strong>
                    <br />
                    {"{ user: User, session: Session }"}
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Pet Management
              </h2>
              <div className="space-y-6">
                <div className="border border-purple-200 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-900 mb-2">
                    GET /pets
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">Get user's pets</p>
                  <div className="bg-gray-100 p-3 rounded text-sm">
                    <strong>Headers:</strong> Authorization: Bearer token
                  </div>
                  <div className="bg-green-50 p-3 rounded text-sm mt-2">
                    <strong>Response:</strong>
                    <br />
                    {"{ pets: Pet[] }"}
                  </div>
                </div>

                <div className="border border-purple-200 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-900 mb-2">
                    POST /pets
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">Add new pet</p>
                  <div className="bg-gray-100 p-3 rounded text-sm">
                    <strong>Body:</strong>
                    <br />
                    {`{
  name: string,
  breed?: string,
  age?: number,
  weight?: number,
  special_instructions?: string,
  photo_url?: string
}`}
                  </div>
                  <div className="bg-green-50 p-3 rounded text-sm mt-2">
                    <strong>Response:</strong>
                    <br />
                    {"{ pet: Pet }"}
                  </div>
                </div>

                <div className="border border-purple-200 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-900 mb-2">
                    PUT /pets/[id]
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">Update pet</p>
                  <div className="bg-gray-100 p-3 rounded text-sm">
                    <strong>Body:</strong> Same as POST /pets (all fields
                    optional except id)
                  </div>
                </div>

                <div className="border border-red-200 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-red-900 mb-2">
                    DELETE /pets/[id]
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">Delete pet</p>
                  <div className="bg-green-50 p-3 rounded text-sm mt-2">
                    <strong>Response:</strong> {"{ success: true }"}
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Booking System
              </h2>
              <div className="space-y-6">
                <div className="border border-orange-200 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-orange-900 mb-2">
                    GET /bookings
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Get user's bookings
                  </p>
                  <div className="bg-gray-100 p-3 rounded text-sm">
                    <strong>Query:</strong>{" "}
                    {"{ status?: string, limit?: number }"}
                  </div>
                  <div className="bg-green-50 p-3 rounded text-sm mt-2">
                    <strong>Response:</strong>
                    <br />
                    {"{ bookings: Booking[] }"}
                  </div>
                </div>

                <div className="border border-orange-200 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-orange-900 mb-2">
                    POST /bookings
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Create new booking
                  </p>
                  <div className="bg-gray-100 p-3 rounded text-sm">
                    <strong>Body:</strong>
                    <br />
                    {`{
  walker_id: number,
  pet_id: number,
  scheduled_date: string,
  duration_minutes: number,
  special_requests?: string
}`}
                  </div>
                  <div className="bg-green-50 p-3 rounded text-sm mt-2">
                    <strong>Response:</strong>
                    <br />
                    {"{ booking: Booking }"}
                  </div>
                </div>

                <div className="border border-orange-200 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-orange-900 mb-2">
                    PUT /bookings/[id]
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Update booking status
                  </p>
                  <div className="bg-gray-100 p-3 rounded text-sm">
                    <strong>Body:</strong>
                    <br />
                    {"{ status: 'confirmed' | 'completed' | 'cancelled' }"}
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Walker Services
              </h2>
              <div className="space-y-6">
                <div className="border border-indigo-200 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-indigo-900 mb-2">
                    GET /walkers/search
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Search available walkers
                  </p>
                  <div className="bg-gray-100 p-3 rounded text-sm">
                    <strong>Query:</strong>
                    <br />
                    {"{ location?: string, date?: string, radius?: number }"}
                  </div>
                  <div className="bg-green-50 p-3 rounded text-sm mt-2">
                    <strong>Response:</strong>
                    <br />
                    {"{ walkers: Walker[] }"}
                  </div>
                </div>

                <div className="border border-indigo-200 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-indigo-900 mb-2">
                    POST /walker-profiles
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Create walker profile
                  </p>
                  <div className="bg-gray-100 p-3 rounded text-sm">
                    <strong>Body:</strong>
                    <br />
                    {`{
  bio: string,
  experience_years: number,
  hourly_rate: number,
  service_areas: string[],
  availability: object
}`}
                  </div>
                  <div className="bg-green-50 p-3 rounded text-sm mt-2">
                    <strong>Response:</strong>
                    <br />
                    {"{ profile: WalkerProfile }"}
                  </div>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Data Types
              </h2>
              <div className="space-y-4">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">User</h4>
                  <pre className="text-sm">{`{
  id: number,
  name: string,
  email: string,
  user_type: 'owner' | 'walker' | 'admin',
  phone_number?: string,
  address?: string,
  created_at: string
}`}</pre>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Pet</h4>
                  <pre className="text-sm">{`{
  id: number,
  owner_id: number,
  name: string,
  breed?: string,
  age?: number,
  weight?: number,
  special_instructions?: string,
  photo_url?: string,
  created_at: string
}`}</pre>
                </div>

                <div className="bg-gray-100 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Booking</h4>
                  <pre className="text-sm">{`{
  id: number,
  owner_id: number,
  walker_id: number,
  pet_id: number,
  scheduled_date: string,
  duration_minutes: number,
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled',
  price?: number,
  special_requests?: string,
  walk_notes?: string,
  photo_urls: string[],
  created_at: string
}`}</pre>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Error Handling
              </h2>
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-900 mb-2">
                    Error Response Format
                  </h4>
                  <pre className="text-sm text-red-800">{`{
  error: "Error message",
  code?: "ERROR_CODE",
  details?: object
}`}</pre>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-100 p-3 rounded">
                    <h5 className="font-semibold mb-2">Common Status Codes</h5>
                    <ul className="text-sm space-y-1">
                      <li>• 200 - Success</li>
                      <li>• 201 - Created</li>
                      <li>• 400 - Bad Request</li>
                      <li>• 401 - Unauthorized</li>
                      <li>• 404 - Not Found</li>
                      <li>• 500 - Server Error</li>
                    </ul>
                  </div>
                  <div className="bg-gray-100 p-3 rounded">
                    <h5 className="font-semibold mb-2">Authentication</h5>
                    <p className="text-sm">
                      All protected endpoints require a valid session token in
                      the Authorization header.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
