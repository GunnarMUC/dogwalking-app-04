# 🐕 DogWalking Mobile App

A React Native mobile application connecting pet owners with trusted dog walkers. Built with Expo and modern React Native technologies.

## Overview

This mobile app provides a seamless experience for both pet owners and dog walkers to manage dog walking services. Pet owners can find and book walkers, while walkers can manage their bookings and provide real-time updates during walks.

## Features

### For Pet Owners 👤
- **Pet Management**: Add, edit, and manage multiple pet profiles with photos
- **Walker Discovery**: Search for local dog walkers with filters
- **Easy Booking**: Schedule walks with preferred walkers
- **Real-time Tracking**: Track your dog's walk in real-time on a map
- **Photo Updates**: Receive photo updates during walks
- **Booking History**: View past and upcoming bookings
- **Favorites**: Save favorite walkers for quick booking

### For Dog Walkers 🚶
- **Professional Profile**: Create and manage walker profile with bio, rates, and experience
- **Booking Management**: Accept, decline, and manage walk requests
- **Availability Control**: Set your availability and working hours
- **GPS Navigation**: Navigate to pickup locations easily
- **Photo Sharing**: Share photos with owners during walks
- **Earnings Tracking**: Monitor your income and completed walks
- **Dashboard**: View daily schedule and statistics

## Tech Stack

- **Framework**: React Native 0.79 + Expo 53
- **Navigation**: Expo Router 5
- **State Management**: Zustand + TanStack Query
- **UI Components**: 
  - Lucide React Native (icons)
  - Expo Image (optimized images)
  - React Native Maps (location features)
  - Sonner Native (notifications)
  - Moti (animations)
- **Authentication**: Custom auth with secure storage
- **File Upload**: Uploadcare
- **Forms**: Yup validation
- **Date Handling**: date-fns

## Project Structure

```
mobile/
├── src/
│   ├── app/                    # Expo Router pages
│   │   ├── (tabs)/            # Tab navigation screens
│   │   │   ├── home.jsx       # Dashboard
│   │   │   ├── bookings.jsx   # Booking management
│   │   │   ├── favorites.jsx  # Saved walkers
│   │   │   └── profile.jsx    # User profile
│   │   ├── pets/              # Pet management
│   │   │   ├── index.jsx      # Pet list
│   │   │   ├── add.jsx        # Add pet
│   │   │   └── edit/[id].jsx  # Edit pet
│   │   ├── walkers/           # Walker features
│   │   │   ├── search.jsx     # Search walkers
│   │   │   └── [id].jsx       # Walker profile
│   │   ├── booking/[id].jsx   # Booking details
│   │   ├── walk/[id].jsx      # Active walk tracking
│   │   └── walker-setup.jsx   # Walker onboarding
│   ├── components/            # Reusable components
│   └── utils/                 # Utilities & hooks
│       ├── auth/              # Authentication logic
│       ├── useUpload.js       # File upload hook
│       └── useHandleStreamResponse.js
├── polyfills/                 # Platform-specific polyfills
│   ├── native/               # Native implementations
│   ├── web/                  # Web implementations
│   └── shared/               # Shared implementations
├── assets/                    # Images and static files
├── App.tsx                    # Root component
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or bun
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

1. **Navigate to mobile directory**:
```bash
cd apps/mobile
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
Create a `.env` file in the mobile directory (not currently configured - needs setup)

4. **Start the development server**:
```bash
npx expo start
```

5. **Run on a device**:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app for physical device

## Key Screens

### Home Screen
- Personalized dashboard based on user type (owner/walker)
- Quick actions for common tasks
- Pet overview for owners
- Today's statistics for walkers

### Bookings Screen
- Filter bookings by status (all, pending, confirmed, completed)
- View booking details
- Pull to refresh functionality

### Walker Search
- Browse available walkers
- Filter by location, rating, price
- View walker profiles and ratings

### Pet Management
- Add/edit pet profiles with photos
- Manage special instructions and medical info
- View all your pets

### Profile Screen
- Manage account settings
- View statistics (walks completed, money spent/earned)
- Logout and preferences

## API Integration

The mobile app connects to the web backend API:

**Base URL**: Configured in fetch polyfills

**Key Endpoints**:
- `GET /api/pets` - Fetch user's pets
- `POST /api/pets` - Create new pet
- `GET /api/bookings` - Fetch bookings
- `POST /api/bookings` - Create booking
- `GET /api/walkers/search` - Search walkers
- `GET /api/walker-profiles` - Get walker profile
- `POST /api/walker-profiles` - Create/update walker profile

## Authentication

Uses secure token-based authentication:
- Tokens stored in `expo-secure-store` (native) or encrypted storage (web)
- Auto-refresh on app launch
- WebView-based OAuth flow for web compatibility
- Role-based access (owner/walker)

## Platform Support

- ✅ iOS (native)
- ✅ Android (native)
- ✅ Web (Progressive Web App)

## Build & Deploy

### Development Build
```bash
npx expo prebuild
npx expo run:ios
npx expo run:android
```

### Production Build
```bash
# Configure in eas.json
eas build --platform ios
eas build --platform android
```

### Web Build
```bash
npx expo export:web
```

## Configuration Files

- **app.json**: Expo app configuration
- **eas.json**: EAS Build configuration
- **metro.config.js**: Metro bundler config
- **tsconfig.json**: TypeScript configuration

## Dependencies Highlights

**Core**:
- `expo` - Expo framework
- `react-native` - React Native core
- `expo-router` - File-based routing

**UI/UX**:
- `lucide-react-native` - Icons
- `expo-image` - Optimized images
- `moti` - Animations
- `@gorhom/bottom-sheet` - Bottom sheets

**Features**:
- `react-native-maps` - Map integration
- `expo-location` - Location services
- `expo-camera` - Camera access
- `expo-image-picker` - Photo picker
- `@tanstack/react-query` - Data fetching

**Storage**:
- `expo-secure-store` - Secure storage
- `@react-native-async-storage/async-storage` - Async storage

## Development Notes

- Uses patch-package for dependency patches
- Polyfills enable web compatibility
- Error boundaries for crash handling
- Safe area insets for modern devices

## Testing

Run tests (when configured):
```bash
npm test
```

## Troubleshooting

**Metro bundler cache issues**:
```bash
npx expo start -c
```

**iOS build issues**:
```bash
cd ios && pod install && cd ..
```

**Android build issues**:
```bash
cd android && ./gradlew clean && cd ..
```

## Contributing

1. Follow React Native best practices
2. Use TypeScript for new files
3. Maintain existing code style
4. Test on both iOS and Android

## License

[Add your license here]

## Support

For issues or questions, contact the development team.

