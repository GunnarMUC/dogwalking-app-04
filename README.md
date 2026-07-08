
[![License](https://img.shields.io/badge/License-Apache%202.0-blue)](LICENSE)n
[![CI](https://github.com/GunnarMUC/dogwalking-marketplace/actions/workflows/ci.yml/badge.svg)](https://github.com/GunnarMUC/dogwalking-marketplace/actions)

# 🐕 DogWalking Marketplace Platform

A full-stack marketplace platform connecting pet owners with professional dog walkers. Built with modern web and mobile technologies for a seamless experience across all devices.

## 📋 Project Overview

DogWalking is a comprehensive platform that enables:

- **Pet Owners** to find, book, and manage dog walking services
- **Dog Walkers** to offer their services, manage bookings, and earn income
- Real-time tracking, photo updates, and secure payment processing

## 🏗️ Architecture

This is a monorepo containing two main applications:

```
create-anything/apps/
├── mobile/          # React Native + Expo mobile app
└── web/             # React Router + Hono backend
```

### Mobile App (`/apps/mobile`)
- **Framework**: React Native 0.79 + Expo 53
- **Navigation**: Expo Router (file-based routing)
- **Platforms**: iOS, Android, Web (PWA)
- **Features**: Native mobile experience with offline support

### Web App (`/apps/web`)
- **Frontend**: React Router 7
- **Backend**: Hono (lightweight web framework)
- **Runtime**: Node.js serverless
- **Features**: Admin dashboard, API endpoints, SSR

## ✨ Features

### For Pet Owners
- ✅ Create and manage multiple pet profiles with photos
- ✅ Search for dog walkers by location, rating, and availability
- ✅ Book walking services with flexible scheduling
- ✅ Track walks in real-time on an interactive map
- ✅ Receive photo updates during walks
- ✅ View booking history and manage favorites
- ✅ Secure payment processing
- ✅ Rate and review walkers

### For Dog Walkers
- ✅ Create professional walker profile with bio and experience
- ✅ Set hourly rates and availability
- ✅ Accept or decline booking requests
- ✅ GPS navigation to pickup locations
- ✅ Share photos with owners during walks
- ✅ Track earnings and completed walks
- ✅ Dashboard with daily statistics
- ✅ Build reputation through ratings

## 🛠️ Technology Stack

### Frontend
| Layer | Mobile | Web |
|-------|--------|-----|
| Framework | React Native 0.79 | React 18 |
| Routing | Expo Router 5 | React Router 7 |
| UI Library | Native Components | Chakra UI / shadcn/ui |
| Styling | NativeWind | Tailwind CSS |
| Icons | Lucide React Native | Lucide React |
| Maps | React Native Maps | Google Maps API |

### Backend & Infrastructure
- **Runtime**: Node.js serverless functions
- **Web Framework**: Hono (ultra-fast web framework)
- **Database**: PostgreSQL (Neon serverless)
- **Authentication**: NextAuth.js with JWT
- **File Storage**: Uploadcare
- **API**: RESTful JSON APIs

### State & Data Management
- **State**: Zustand (lightweight state management)
- **Server State**: TanStack Query (React Query)
- **Forms**: React Hook Form + Yup validation
- **Date Handling**: date-fns

### Developer Tools
- **Languages**: TypeScript, JavaScript (JSX)
- **Package Manager**: npm
- **Build Tools**: Vite (web), Metro (mobile)
- **Testing**: Vitest + Testing Library
- **Code Quality**: ESLint, Prettier

## 📊 Database Schema

### Core Tables

**auth_users**
- User accounts (owners & walkers)
- Fields: id, email, password_hash, name, phone_number, address, user_type, created_at

**pets**
- Pet profiles
- Fields: id, owner_id, name, breed, age, weight, photo_url, special_instructions, medical_info

**walker_profiles**
- Walker-specific information
- Fields: id, user_id, bio, experience_years, hourly_rate, service_radius, is_available, certifications

**bookings**
- Walk booking records
- Fields: id, owner_id, walker_id, pet_id, scheduled_date, duration_minutes, status, price, special_requests, walk_notes, photo_urls

**Status Flow**: pending → confirmed → completed | cancelled

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or bun
- PostgreSQL database (local or Neon)
- Expo CLI (for mobile)

### Quick Start

1. **Clone the repository**:
```bash
git clone <repository-url>
cd create-anything/apps
```

2. **Install dependencies**:
```bash
# Install web dependencies
cd web
npm install

# Install mobile dependencies
cd ../mobile
npm install
```

3. **Set up environment variables**:

**Web** (`apps/web/.env`):
```env
DATABASE_URL=postgresql://...
AUTH_SECRET=your-secure-random-string
UPLOADCARE_PUBLIC_KEY=your-uploadcare-key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-maps-key
```

**Mobile** (`apps/mobile/.env`):
```env
API_BASE_URL=http://localhost:5173
EXPO_PUBLIC_API_URL=http://localhost:5173
```

4. **Start development servers**:

**Web**:
```bash
cd apps/web
npm run dev
# Runs on http://localhost:5173
```

**Mobile**:
```bash
cd apps/mobile
npx expo start
# Opens Expo dev tools
```

## 📱 API Documentation

### Authentication
- `POST /api/auth/signin` - Sign in user
- `POST /api/auth/signup` - Register new user
- `GET /api/auth/token` - Validate token

### Pets
- `GET /api/pets` - List user's pets
- `POST /api/pets` - Create new pet
- `PUT /api/pets/:id` - Update pet
- `DELETE /api/pets/:id` - Delete pet

### Bookings
- `GET /api/bookings` - List bookings (filtered by user role)
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking status
- `GET /api/bookings/:id` - Get booking details

### Walkers
- `GET /api/walkers/search` - Search available walkers
- `GET /api/walker-profiles` - Get walker profile
- `POST /api/walker-profiles` - Create/update walker profile

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

## 📂 Project Structure

```
apps/
├── mobile/
│   ├── src/
│   │   ├── app/              # Expo Router pages
│   │   │   ├── (tabs)/       # Tab navigation
│   │   │   ├── pets/         # Pet management
│   │   │   ├── walkers/      # Walker features
│   │   │   └── booking/      # Booking flows
│   │   ├── components/       # Reusable components
│   │   └── utils/            # Utilities & hooks
│   ├── assets/               # Images & fonts
│   ├── polyfills/            # Platform-specific code
│   └── package.json
│
└── web/
    ├── src/
    │   ├── app/              # React Router pages
    │   │   ├── api/          # API routes
    │   │   ├── account/      # Auth pages
    │   │   └── documentation/
    │   ├── utils/            # Utilities
    │   └── client-integrations/ # UI libraries
    ├── plugins/              # Vite plugins
    └── package.json
```

## 🧪 Testing

**Web**:
```bash
cd apps/web
npm run test
```

**Mobile**:
```bash
cd apps/mobile
npm test
```

## 📦 Building for Production

### Web Build
```bash
cd apps/web
npm run build
# Outputs to dist/
```

### Mobile Build

**Development Build**:
```bash
cd apps/mobile
npx expo prebuild
npx expo run:ios
npx expo run:android
```

**Production Build** (requires EAS account):
```bash
eas build --platform ios
eas build --platform android
```

## 🚀 Deployment Options

### Option 1: Cloud Platform (Recommended)
**Cost**: ~€60-85/month

- **Web**: Vercel or Netlify
- **Database**: Neon (serverless PostgreSQL)
- **File Storage**: Uploadcare
- **Mobile**: Expo EAS Update + App Stores

**Pros**: Zero server management, auto-scaling, built-in CDN

### Option 2: Self-Hosted
**Cost**: ~€45-80/month

- **Server**: VPS (DigitalOcean, Hetzner, Linode)
- **Database**: Self-hosted PostgreSQL
- **File Storage**: S3-compatible service
- **Mobile**: Manual updates + App Stores

**Pros**: Full control, potentially lower costs at scale

## 🔒 Security

- Password hashing with Argon2
- JWT-based authentication
- Secure token storage (expo-secure-store)
- SQL injection protection (parameterized queries)
- HTTPS/TLS encryption in production
- Role-based access control

## 📈 Performance Optimizations

- Image optimization with Expo Image
- Lazy loading of routes
- React Query caching
- Serverless cold start optimization
- Database connection pooling
- CDN for static assets

## 🐛 Troubleshooting

### Common Issues

**Database connection failed**:
- Verify DATABASE_URL in .env
- Check PostgreSQL is running
- Ensure network connectivity

**Mobile app not connecting to API**:
- Check API_BASE_URL in mobile .env
- Ensure web server is running
- Check network permissions

**Build errors**:
```bash
# Clear caches
cd apps/mobile && npx expo start -c
cd apps/web && rm -rf dist node_modules && npm install
```

## 📝 Development Guidelines

1. **Code Style**: Follow existing patterns, use ESLint
2. **Commits**: Use conventional commits (feat:, fix:, docs:)
3. **Testing**: Write tests for new features
4. **Type Safety**: Use TypeScript where possible
5. **Documentation**: Update README for major changes

## 🗺️ Roadmap

- [ ] Real-time chat between owners and walkers
- [ ] In-app payment processing (Stripe)
- [ ] Push notifications
- [ ] Walk route history and statistics
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Social features (share walks)
- [ ] Walker background checks integration

## 📄 License

[Add your license here]

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For questions or issues:
- Check the documentation in `/apps/web/src/app/documentation`
- Review API docs at `/api-docs`
- Open an issue on GitHub

## 🙏 Acknowledgments

Built with:
- React & React Native communities
- Expo team
- Neon Database
- All open-source contributors

---

Made with ❤️ for dog lovers everywhere 🐾

