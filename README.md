# Atelier's Fitness 💪

A comprehensive gym management and community platform built with modern web technologies. Features user authentication, community posts, attendance tracking, profile management, and more.

## 🏗️ Architecture

This project uses a **pnpm monorepo** structure with two main applications:

- **`/apps/web`** - Next.js frontend with TypeScript and App Router
- **`/apps/api`** - NestJS backend API with TypeScript, MongoDB, and Cloudinary integration

## 🎨 Design System

The app uses a custom Atelier color palette defined in TailwindCSS:

- **Dark Red**: `#B71C1C` - Primary action color
- **Navy**: `#0B2545` - Primary background
- **Dark Yellow**: `#F6C85F` - Accent color
- **Black**: `#000000` - Text and contrast

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm 8+
- MongoDB Atlas account
- Cloudinary account

### Environment Setup

Create the following environment files:

**`apps/api/.env`:**
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/atelier
JWT_SECRET=your-super-secret-jwt-key
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

**`apps/web/.env.local`:**
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
```

### Installation

```bash
# Install dependencies for all packages
pnpm install

# Set up Git hooks
pnpm prepare
```

### Development

```bash
# Start the Next.js frontend (http://localhost:3000)
pnpm dev:web

# Start the NestJS API (http://localhost:3001)
pnpm dev:api
```

### Demo Credentials

The app comes with pre-seeded demo users:

| Gym ID | Password | Role | Membership |
|--------|----------|------|------------|
| GYM001 | password123 | admin | VIP |
| GYM002 | trainer2024 | trainer | Premium |
| GYM003 | member123 | member | Basic |

### Profile Onboarding Flow

1. **Login** with Gym ID and password
2. **Profile Completion** - If `isProfileComplete` is false, users are redirected to complete their profile
3. **Required Fields** - Email, phone, and membership type are required for profile completion
4. **Optional Fields** - Height, weight, goals, emergency contact, etc.
5. **Avatar Upload** - Users can upload profile pictures via Cloudinary
6. **Measurements** - Track progress with body measurements and notes
7. **Community Access** - Once profile is complete, users can access the community features

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev:web` | Start Next.js development server |
| `pnpm dev:api` | Start NestJS development server |
| `pnpm build:web` | Build Next.js for production |
| `pnpm build:api` | Build NestJS for production |
| `pnpm lint` | Run ESLint on both apps |
| `pnpm lint:fix` | Fix ESLint issues automatically |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm test` | Run tests for both apps |
| `pnpm test:watch` | Run tests in watch mode |

## 🛠️ Development Tools

### Code Quality

- **ESLint** - Code linting with TypeScript support
- **Prettier** - Code formatting
- **Husky** - Git hooks for pre-commit linting
- **lint-staged** - Run linters on staged files only

### Testing

- **Jest** - Testing framework for both apps
- **@testing-library/react** - React component testing utilities
- **@testing-library/jest-dom** - Custom Jest matchers

### CI/CD

- **GitHub Actions** - Automated CI pipeline
- Runs on Node.js 18.x and 20.x
- Checks: lint, typecheck, tests, and builds

## 📁 Project Structure

```
ateliers-fitness/
├── apps/
│   ├── web/                 # Next.js frontend
│   │   ├── src/
│   │   │   ├── app/         # App Router pages
│   │   │   └── components/  # React components
│   │   ├── tailwind.config.js
│   │   └── package.json
│   └── api/                 # NestJS backend
│       ├── src/
│       │   ├── app.controller.ts
│       │   ├── app.service.ts
│       │   └── main.ts
│       └── package.json
├── .github/workflows/       # GitHub Actions
├── .husky/                  # Git hooks
├── package.json             # Root workspace config
└── pnpm-workspace.yaml      # pnpm workspace config
```

## 🎯 Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** with secure token management
- **Role-based access control** (Admin, Trainer, Member)
- **Profile completion tracking**
- **Secure password hashing** with bcrypt

### 👤 User Management
- **Comprehensive user profiles** with extended fields
- **Avatar upload** with Cloudinary integration
- **Body measurements tracking** with history
- **Profile completion status** tracking
- **Emergency contact management**

### 🏘️ Community Features
- **Social feed** with posts, likes, and comments
- **Media upload** (images/videos) with Cloudinary
- **Workout sharing** with muscle groups and splits
- **Real-time interactions** with optimistic UI
- **Role-based post management**

### 📊 Attendance & Progress Tracking
- **Check-in system** with streak tracking
- **Calendar heatmap** visualization
- **Progress measurements** with historical data
- **Manual check-ins** for trainers/admins
- **Monthly statistics** and analytics

### 🎨 Frontend (Next.js)
- ⚡ **App Router** for optimal performance
- 🎨 **TailwindCSS** with custom Atelier theme
- 📱 **Mobile-first responsive design**
- 🔧 **TypeScript strict mode**
- 🧪 **Jest testing setup**
- 🎭 **Framer Motion** animations
- 🖼️ **Next.js Image optimization**

### 🚀 Backend (NestJS)
- 🚀 **Fast, scalable API framework**
- 🔧 **TypeScript strict mode**
- 🧪 **Jest testing setup**
- 🌐 **CORS enabled** for frontend communication
- 📊 **Health check endpoints**
- 🗄️ **MongoDB Atlas** integration
- ☁️ **Cloudinary** media management
- 🔒 **Input validation** with class-validator

## 🔧 Configuration

### TypeScript
Both apps use strict TypeScript configuration for type safety.

### ESLint & Prettier
- Shared configuration at the root level
- App-specific overrides where needed
- Automatic formatting on save (with proper editor setup)

### Git Hooks
Pre-commit hooks automatically run:
- ESLint with auto-fix
- Prettier formatting
- Only on staged files (via lint-staged)

## 🗄️ Database & Persistence

### MongoDB Atlas Collections
- **`users`** - User profiles, authentication, and extended profile data
- **`posts`** - Community posts with media, likes, and comments
- **`attendance`** - Check-in records and attendance tracking

### Cloudinary Integration
- **Media Storage** - Images and videos stored in Cloudinary
- **Optimized Delivery** - Automatic format and quality optimization
- **Transformations** - Avatar cropping, media resizing
- **Public IDs** - Stored for efficient media management

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
pnpm build:web
# Deploy the .next folder to your hosting platform
```

### Backend (Railway/Heroku/AWS)
```bash
pnpm build:api
# Deploy the dist folder to your server
```

### Environment Variables for Production
- Set all environment variables in your hosting platform
- Ensure MongoDB Atlas IP whitelist includes your server
- Configure Cloudinary settings for production
- Set up CORS for your production domain

## 🧪 Testing

### Unit Tests
```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests for specific app
pnpm --filter @atelier/web test
pnpm --filter @atelier/api test
```

### E2E Tests
```bash
# Run Playwright tests
pnpm e2e
```

## 🔧 Troubleshooting

### Common Issues

**1. MongoDB Connection Issues**
- Verify `MONGO_URI` is correct
- Check MongoDB Atlas IP whitelist
- Ensure database name is correct

**2. Cloudinary Upload Failures**
- Verify Cloudinary credentials
- Check file size limits (10MB for posts, 5MB for avatars)
- Ensure proper CORS configuration

**3. CORS Issues**
- Update CORS origins in `apps/api/src/main.ts`
- Add your domain/IP to allowed origins
- Check mobile access IP addresses

**4. Build Failures**
- Clear `.next` and `dist` folders
- Run `pnpm install` to ensure dependencies
- Check TypeScript errors with `pnpm typecheck`

## 📈 Performance & Optimization

### Frontend Optimizations
- **Next.js Image** component for optimized images
- **Framer Motion** for smooth animations
- **TailwindCSS** for efficient styling
- **Code splitting** with dynamic imports

### Backend Optimizations
- **MongoDB indexes** for efficient queries
- **Cloudinary transformations** for optimized media
- **JWT token validation** for fast authentication
- **Input validation** to prevent invalid data

## 🛣️ Roadmap

### Completed Features ✅
- ✅ User authentication and authorization
- ✅ Community posts with media upload
- ✅ Attendance tracking with streaks
- ✅ Profile management with measurements
- ✅ Avatar upload and management
- ✅ Mobile-responsive design
- ✅ Real-time interactions (likes, comments)

### Upcoming Features 🚧
- 🔄 Live workout classes booking
- 🔄 Nutrition tracking and meal planning
- 🔄 Personal trainer scheduling
- 🔄 Payment integration for memberships
- 🔄 Push notifications
- 🔄 Advanced analytics dashboard
- 🔄 Social challenges and competitions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `pnpm test`
5. Run linting: `pnpm lint`
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

## 📝 License

This project is private and proprietary to Atelier's Fitness.

---

**Built with ❤️ for fitness enthusiasts**
