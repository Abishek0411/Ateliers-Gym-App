# Atelier's Fitness 💪

A modern gym app built with a TypeScript monorepo architecture, featuring a Next.js frontend and NestJS backend.

## 🏗️ Architecture

This project uses a **pnpm monorepo** structure with two main applications:

- **`/apps/web`** - Next.js frontend with TypeScript and App Router
- **`/apps/api`** - NestJS backend API with TypeScript

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

### Frontend (Next.js)
- ⚡ App Router for optimal performance
- 🎨 TailwindCSS with custom Atelier theme
- 📱 Responsive design
- 🔧 TypeScript strict mode
- 🧪 Jest testing setup

### Backend (NestJS)
- 🚀 Fast, scalable API framework
- 🔧 TypeScript strict mode
- 🧪 Jest testing setup
- 🌐 CORS enabled for frontend communication
- 📊 Health check endpoint

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

## 🚀 Deployment

### Frontend
```bash
pnpm build:web
# Deploy the .next folder to your hosting platform
```

### Backend
```bash
pnpm build:api
# Deploy the dist folder to your server
```

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
