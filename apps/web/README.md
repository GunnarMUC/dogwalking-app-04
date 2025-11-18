# 🐕 DogWalking Web Application

The web backend and admin interface for the DogWalking marketplace platform. Built with React Router 7 and Hono for a modern, performant web experience.

## Overview

This web application serves as:
1. **Backend API** - RESTful endpoints for mobile and web clients
2. **Web Interface** - Browser-based access to the platform
3. **Admin Dashboard** - Management tools for the platform
4. **Documentation Hub** - API docs and guides

## Features

### API Backend
- RESTful JSON APIs for all platform features
- Authentication & authorization with NextAuth.js
- PostgreSQL database integration (Neon serverless)
- File upload handling via Uploadcare
- Role-based access control (owners/walkers)
- Request validation and error handling

### Web Interface
- Responsive design for all screen sizes
- Server-side rendering for better SEO
- Real-time data updates with React Query
- Google Maps integration for location features
- Secure authentication flow

### Documentation
- Interactive API documentation
- Setup guides and tutorials
- Database schema documentation
- Deployment instructions

## Tech Stack

**Frontend**:
- React 18.2
- React Router 7 (with file-based routing)
- Tailwind CSS for styling
- Chakra UI / shadcn/ui components
- Lucide React icons
- Motion (Framer Motion fork) for animations

**Backend**:
- Hono (ultra-fast web framework)
- React Router Node adapter
- Neon serverless PostgreSQL
- NextAuth.js for authentication
- Argon2 password hashing

**Development**:
- Vite for blazing-fast builds
- TypeScript for type safety
- Vitest for testing
- ESLint for code quality

## Project Structure

```
web/
├── src/
│   ├── app/                      # Application routes
│   │   ├── api/                 # API endpoints
│   │   │   ├── auth/           # Authentication
│   │   │   ├── bookings/       # Booking management
│   │   │   ├── pets/           # Pet management
│   │   │   ├── profile/        # User profiles
│   │   │   ├── walker-profiles/ # Walker-specific
│   │   │   ├── walkers/        # Walker search
│   │   │   └── utils/          # API utilities
│   │   │       ├── sql.js      # Database connection
│   │   │       ├── create.js   # Helper functions
│   │   │       └── upload.js   # File upload
│   │   ├── account/            # Auth pages
│   │   │   ├── signin/
│   │   │   ├── signup/
│   │   │   └── logout/
│   │   ├── documentation/      # Docs pages
│   │   ├── api-docs/          # API documentation
│   │   ├── onboarding/        # User onboarding
│   │   ├── setup-guide/       # Setup instructions
│   │   ├── layout.jsx         # Root layout
│   │   ├── page.jsx           # Home page
│   │   └── root.tsx           # Root component
│   ├── utils/                  # Shared utilities
│   │   ├── useAuth.js         # Auth hook
│   │   ├── useUser.js         # User data hook
│   │   ├── useUpload.js       # File upload hook
│   │   └── useHandleStreamResponse.js
│   ├── client-integrations/    # UI library configs
│   │   ├── chakra-ui.jsx
│   │   ├── shadcn-ui.jsx
│   │   ├── react-google-maps.jsx
│   │   └── recharts.jsx
│   ├── auth.js                # NextAuth configuration
│   └── index.css              # Global styles
├── plugins/                    # Vite plugins
│   ├── aliases.ts
│   ├── layouts.ts
│   ├── restart.ts
│   └── ...
├── test/                       # Test files
│   └── setupTests.ts
├── vite.config.ts             # Vite configuration
├── react-router.config.ts     # React Router config
├── tailwind.config.js         # Tailwind config
├── tsconfig.json              # TypeScript config
└── package.json
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or bun
- PostgreSQL database (Neon or local)

### Installation

1. **Navigate to web directory**:
```bash
cd apps/web
```

2. **Install dependencies**:
```bash
npm install
# or
bun install
```

3. **Set up environment variables**:

Create `.env` file:
```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Authentication
AUTH_SECRET=your-secure-random-string-min-32-chars
AUTH_TRUST_HOST=true

# File Upload
UPLOADCARE_PUBLIC_KEY=your-uploadcare-public-key

# Maps (for location features)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-key

# Optional: Development
NODE_ENV=development
```

4. **Initialize database**:

Run migrations or create tables manually:
```sql
-- See database schema in documentation
```

5. **Start development server**:
```bash
npm run dev
```

Server runs on `http://localhost:5173`

## API Endpoints

### Authentication
```
POST   /api/auth/signin              Sign in user
POST   /api/auth/signup              Register new user
GET    /api/auth/token               Validate JWT token
GET    /api/auth/expo-web-success    OAuth callback for mobile
```

### User Profile
```
GET    /api/profile                  Get current user profile
PUT    /api/profile                  Update user profile
```

### Pets Management
```
GET    /api/pets                     List user's pets
POST   /api/pets                     Create new pet
GET    /api/pets/:id                 Get pet details
PUT    /api/pets/:id                 Update pet
DELETE /api/pets/:id                 Delete pet
```

### Walker Profiles
```
GET    /api/walker-profiles          Get walker profile
POST   /api/walker-profiles          Create/update walker profile
PUT    /api/walker-profiles          Update profile (alias)
```

### Walker Search
```
GET    /api/walkers/search           Search for walkers
Query params:
  - lat: latitude
  - lng: longitude
  - radius: search radius in km
  - min_rating: minimum rating (0-5)
  - max_rate: maximum hourly rate
```

### Bookings
```
GET    /api/bookings                 List user's bookings
GET    /api/bookings?status=pending  Filter by status
POST   /api/bookings                 Create new booking
GET    /api/bookings/:id             Get booking details
PUT    /api/bookings/:id             Update booking status
DELETE /api/bookings/:id             Cancel booking
```

### API Response Format

**Success Response**:
```json
{
  "data": { ... },
  "message": "Success"
}
```

**Error Response**:
```json
{
  "error": "Error message",
  "details": "Additional information"
}
```

## Database

### Connection

Using Neon serverless PostgreSQL:
```javascript
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

// Usage
const results = await sql`SELECT * FROM users WHERE id = ${userId}`;
```

### Schema Overview

**auth_users**
```sql
CREATE TABLE auth_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name VARCHAR(255),
  phone_number VARCHAR(50),
  address TEXT,
  user_type VARCHAR(20) CHECK (user_type IN ('owner', 'walker')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**pets**
```sql
CREATE TABLE pets (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER REFERENCES auth_users(id),
  name VARCHAR(255) NOT NULL,
  breed VARCHAR(255),
  age INTEGER,
  weight DECIMAL(5,2),
  photo_url TEXT,
  special_instructions TEXT,
  medical_info TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**walker_profiles**
```sql
CREATE TABLE walker_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES auth_users(id) UNIQUE,
  bio TEXT,
  experience_years INTEGER,
  hourly_rate DECIMAL(6,2),
  service_radius INTEGER,
  is_available BOOLEAN DEFAULT true,
  certifications TEXT[],
  average_rating DECIMAL(3,2),
  total_walks INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**bookings**
```sql
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER REFERENCES auth_users(id),
  walker_id INTEGER REFERENCES auth_users(id),
  pet_id INTEGER REFERENCES pets(id),
  scheduled_date TIMESTAMP NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  status VARCHAR(20) CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  price DECIMAL(8,2),
  special_requests TEXT,
  walk_notes TEXT,
  photo_urls TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Authentication

Uses NextAuth.js with custom providers:

### Configuration (`src/auth.js`)
```javascript
import NextAuth from '@auth/core';
import Credentials from '@auth/core/providers/credentials';

export const { auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {}
      },
      authorize: async (credentials) => {
        // Custom validation logic
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  }
});
```

### Protected Routes
```javascript
import { auth } from '@/auth';

export async function GET(request) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // Handle authenticated request
}
```

## File Upload

Using Uploadcare for file storage:

```javascript
import { UploadClient } from '@uploadcare/upload-client';

const client = new UploadClient({ 
  publicKey: process.env.UPLOADCARE_PUBLIC_KEY 
});

// Upload file
const file = await client.uploadFile(file);
const cdnUrl = file.cdnUrl;
```

## Development

### Run Development Server
```bash
npm run dev
```

### Type Checking
```bash
npm run typecheck
```

### Build for Production
```bash
npm run build
```

### Run Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

## Testing

Using Vitest and Testing Library:

```javascript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

## Deployment

### Environment Setup

**Production Environment Variables**:
```env
DATABASE_URL=postgresql://...
AUTH_SECRET=production-secure-random-string
AUTH_TRUST_HOST=true
UPLOADCARE_PUBLIC_KEY=...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
NODE_ENV=production
```

### Build
```bash
npm run build
```

### Deploy to Vercel
```bash
vercel deploy
```

### Deploy to Other Platforms

The built app can be deployed to any Node.js hosting:
- Netlify
- Railway
- Render
- DigitalOcean App Platform
- AWS/GCP/Azure

## Configuration Files

### `vite.config.ts`
Vite build configuration with plugins

### `react-router.config.ts`
React Router SSR and routing configuration

### `tailwind.config.js`
Tailwind CSS customization

### `tsconfig.json`
TypeScript compiler options

## Performance Optimization

- Server-side rendering for initial load
- React Query for efficient data fetching
- Code splitting with dynamic imports
- Image optimization
- Database connection pooling
- CDN for static assets

## Security Best Practices

✅ Password hashing with Argon2
✅ SQL injection prevention (parameterized queries)
✅ JWT-based authentication
✅ CORS configuration
✅ Input validation
✅ Rate limiting (recommended to add)
✅ HTTPS in production

## Troubleshooting

### Database Connection Issues
```bash
# Test connection
psql $DATABASE_URL
```

### Build Errors
```bash
# Clear cache and rebuild
rm -rf dist node_modules .react-router
npm install
npm run build
```

### Port Already in Use
```bash
# Change port
PORT=3000 npm run dev
```

## Scripts

```json
{
  "dev": "react-router dev",
  "build": "react-router build",
  "start": "react-router-serve ./build/server/index.js",
  "typecheck": "react-router typegen && tsc --noEmit",
  "test": "vitest"
}
```

## Contributing

1. Follow existing code structure
2. Write tests for new features
3. Update documentation
4. Use TypeScript where possible
5. Follow naming conventions

## Resources

- [React Router Docs](https://reactrouter.com/)
- [Hono Docs](https://hono.dev/)
- [NextAuth.js Docs](https://authjs.dev/)
- [Neon Database](https://neon.tech/)
- [Tailwind CSS](https://tailwindcss.com/)

## License

[Add your license here]

## Support

For questions or issues:
- Check `/documentation` page
- Review `/api-docs` page
- Check console logs for errors
- Open an issue on GitHub

