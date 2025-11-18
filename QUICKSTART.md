# 🚀 Quick Start Guide

Get the DogWalking platform up and running in 5 minutes!

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js 18+ installed (`node --version`)
- ✅ npm installed (`npm --version`)
- ✅ Git installed (`git --version`)

## Step 1: Database Setup (Choose One)

### Option A: Neon (Easiest - Free Tier Available)

1. Go to [neon.tech](https://neon.tech)
2. Sign up for free account
3. Create a new project
4. Copy the connection string (looks like: `postgresql://user:pass@host.neon.tech/dbname`)

### Option B: Local PostgreSQL

```bash
# Install PostgreSQL (macOS)
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb dogwalking

# Your connection string:
# postgresql://localhost:5432/dogwalking
```

## Step 2: Database Schema

Create the required tables by running this SQL in your database:

```sql
-- Users table
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

-- Pets table
CREATE TABLE pets (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER REFERENCES auth_users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  breed VARCHAR(255),
  age INTEGER,
  weight DECIMAL(5,2),
  photo_url TEXT,
  special_instructions TEXT,
  medical_info TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Walker profiles table
CREATE TABLE walker_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES auth_users(id) ON DELETE CASCADE UNIQUE,
  bio TEXT,
  experience_years INTEGER,
  hourly_rate DECIMAL(6,2) DEFAULT 25.00,
  service_radius INTEGER DEFAULT 10,
  is_available BOOLEAN DEFAULT true,
  certifications TEXT[],
  average_rating DECIMAL(3,2) DEFAULT 0,
  total_walks INTEGER DEFAULT 0,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER REFERENCES auth_users(id) ON DELETE CASCADE,
  walker_id INTEGER REFERENCES auth_users(id) ON DELETE CASCADE,
  pet_id INTEGER REFERENCES pets(id) ON DELETE CASCADE,
  scheduled_date TIMESTAMP NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  status VARCHAR(20) CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')) DEFAULT 'pending',
  price DECIMAL(8,2),
  special_requests TEXT,
  walk_notes TEXT,
  photo_urls TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_pets_owner ON pets(owner_id);
CREATE INDEX idx_bookings_owner ON bookings(owner_id);
CREATE INDEX idx_bookings_walker ON bookings(walker_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_walker_profiles_user ON walker_profiles(user_id);
```

## Step 3: Web Backend Setup

```bash
# Navigate to web directory
cd apps/web

# Install dependencies
npm install

# Create environment file
cat > .env << 'EOF'
# Database (use your connection string from Step 1)
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Authentication (generate a random 32+ character string)
AUTH_SECRET=change-this-to-a-secure-random-string-min-32-chars
AUTH_TRUST_HOST=true

# File Upload (optional - for photo uploads)
UPLOADCARE_PUBLIC_KEY=demopublickey

# Maps (optional - for location features)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-key-here

# Environment
NODE_ENV=development
EOF

# Start the server
npm run dev
```

✅ Web server running on `http://localhost:5173`

## Step 4: Mobile App Setup

```bash
# Navigate to mobile directory
cd apps/mobile

# Install dependencies
npm install

# Start Expo dev server
npx expo start
```

Then:
- Press `w` to open in web browser
- Press `i` to open iOS simulator (Mac only)
- Press `a` to open Android emulator
- Scan QR code with Expo Go app on your phone

✅ Mobile app running!

## Step 5: Test the App

### Create a Test User (Pet Owner)

1. Open the app (web or mobile)
2. Click "Get Started" or "Sign Up"
3. Register with:
   - Email: `owner@test.com`
   - Password: `test1234`
   - Name: `Test Owner`
   - User Type: `Owner`

### Add a Test Pet

1. Go to "Profile" or "Pets" tab
2. Click "Add Pet"
3. Fill in:
   - Name: `Buddy`
   - Breed: `Golden Retriever`
   - Age: `3`
   - Weight: `30`

### Create a Test Walker Account

1. Log out
2. Register new account:
   - Email: `walker@test.com`
   - Password: `test1234`
   - Name: `Test Walker`
   - User Type: `Walker`
3. Complete walker profile setup

### Test Booking Flow

1. Log in as owner
2. Search for walkers
3. Select the test walker
4. Book a walk

## Common Issues & Fixes

### Database Connection Failed
```bash
# Check your DATABASE_URL is correct
echo $DATABASE_URL

# Test connection
psql "$DATABASE_URL" -c "SELECT 1;"
```

### Port Already in Use
```bash
# Web: Change port
PORT=3000 npm run dev

# Mobile: Use different port
npx expo start --port 8082
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Mobile: Clear Expo cache
npx expo start -c
```

### TypeScript Errors
```bash
# Regenerate types
npm run typecheck
```

## Next Steps

Now that you're running:

1. **Explore the Code**:
   - Check `apps/web/src/app/api/` for backend logic
   - Check `apps/mobile/src/app/` for mobile screens
   - Read the READMEs in each app folder

2. **Customize**:
   - Update branding and colors
   - Modify pricing logic
   - Add new features

3. **Deploy**:
   - See deployment guides in README.md
   - Set up production database
   - Configure domain and SSL

## Optional Enhancements

### Add Google Maps (for location features)

1. Get API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Maps JavaScript API
3. Add to `.env`:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-key-here
   ```

### Add File Upload (for photos)

1. Sign up at [uploadcare.com](https://uploadcare.com/)
2. Get public key
3. Add to `.env`:
   ```
   UPLOADCARE_PUBLIC_KEY=your-key-here
   ```

### Add Push Notifications

1. Configure in Expo project
2. Set up notification service
3. Implement in booking flow

## Development Tools

### Useful Commands

```bash
# Web
cd apps/web
npm run dev          # Start dev server
npm run build        # Build for production
npm run typecheck    # Check TypeScript
npm test            # Run tests

# Mobile
cd apps/mobile
npx expo start      # Start dev server
npx expo start -c   # Clear cache
npx expo prebuild   # Generate native code
```

### Database Management

```bash
# Connect to database
psql "$DATABASE_URL"

# View tables
\dt

# View table structure
\d auth_users

# Run query
SELECT * FROM auth_users;
```

### Debugging

**Web**:
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for API calls

**Mobile**:
- Shake device to open dev menu
- Check Expo dev tools in terminal
- Use React Native Debugger

## Resources

- 📖 [Full Documentation](README.md)
- 📱 [Mobile App README](apps/mobile/README.md)
- 🌐 [Web App README](apps/web/README.md)
- 🔗 [React Router Docs](https://reactrouter.com/)
- 🔗 [Expo Docs](https://docs.expo.dev/)

## Need Help?

1. Check the detailed READMEs
2. Search existing issues
3. Check the documentation page at `/documentation`
4. Review API docs at `/api-docs`

---

**You're all set! Happy coding! 🎉🐕**

