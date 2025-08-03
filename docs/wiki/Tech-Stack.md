# Tech Stack

## Overview
Collectr uses a modern, Firebase-centric architecture optimized for rapid development, security, and scalability.

## Frontend

### Web Application
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.x (strict mode)
- **Styling**: Tailwind CSS 3.x + Radix UI
- **Build**: Static export for Firebase Hosting
- **State Management**: React hooks + Firebase SDK
- **Authentication**: Firebase Auth (Google, Apple, Email)

### UI Components
- **Component Library**: Radix UI (accessibility-first)
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with custom design system
- **Forms**: React Hook Form + Zod validation

## Backend

### API Server
- **Framework**: Fastify 4.x (Node.js/TypeScript)
- **Runtime**: Node.js 20 LTS
- **Authentication**: Firebase Admin SDK (JWT verification)
- **Validation**: Zod schemas
- **Logging**: Pino (structured JSON logging)
- **Deployment**: Cloud Run (production) / local (development)

### Database & Storage
- **Primary Database**: Cloud Firestore (native mode)
- **File Storage**: Cloud Storage
- **Authentication**: Firebase Auth
- **Region**: europe-west2 (London)
- **Security**: Firestore Security Rules (deny-by-default)

## External Services

### Game Data APIs
- **Primary**: IGDB API (via Twitch OAuth)
- **Fallback**: RAWG API
- **AI Enrichment**: OpenAI (future feature)

### Authentication Providers
- **Google OAuth**: Enabled
- **Apple Sign-In**: Enabled  
- **Email/Password**: Enabled for development

## Development Tools

### Package Management
- **Manager**: pnpm 9.x
- **Structure**: Monorepo with workspaces
- **Build Tool**: Native TypeScript + tsup (for packages)

### Code Quality
- **Linter**: ESLint 9.x + @typescript-eslint
- **Formatter**: Prettier
- **Type Checking**: TypeScript strict mode
- **Testing**: Vitest + Testing Library

### Development Environment
- **Firebase Emulators**: Auth, Firestore, Storage, Hosting
- **Hot Reload**: tsx watch (API), Next.js dev (web)
- **Environment**: dotenv + Firebase config

## Deployment & Infrastructure

### Hosting
- **Web App**: Firebase Hosting (CDN + static assets)
- **API**: Cloud Run (containerized Node.js)
- **Database**: Cloud Firestore
- **Files**: Cloud Storage

### CI/CD
- **Platform**: GitHub Actions
- **Authentication**: Workload Identity Federation
- **Environments**: dev, staging, production
- **Deployment**: Firebase CLI + gcloud

### Monitoring & Security
- **Logging**: Cloud Logging + structured JSON
- **Monitoring**: Cloud Monitoring + Firebase Performance
- **Security**: App Check + Security Rules
- **Secrets**: Google Secret Manager

## Architecture Patterns

### Data Flow
```
User → Next.js (SSG) → Firebase Auth → Fastify API → Firestore
     ↘ Firebase SDK (client) → Firestore (direct for reads)
```

### Authentication Flow
```
User → Firebase Auth → ID Token → API Bearer Auth → Firestore Rules
```

### File Organization
```
collectr/
├── apps/
│   ├── web/          # Next.js frontend
│   ├── api/          # Fastify backend
│   └── workers/      # Background jobs (future)
├── packages/
│   ├── types/        # Shared Zod schemas
│   └── eslint-config/# Shared linting rules
├── firebase/         # Firebase config & rules
└── infrastructure/   # Terraform (future)
```

## Performance Targets

### API Performance
- **Search p95**: ≤ 300ms (IGDB requirement)
- **Write p95**: ≤ 200ms
- **Availability**: 99.5% monthly

### Web Performance
- **First Load JS**: < 100KB
- **Lighthouse**: > 90 (Performance, Accessibility, SEO)
- **Core Web Vitals**: Green ratings

## Security Model

### Authentication
- **Client**: Firebase Auth SDK (ID tokens)
- **Server**: Firebase Admin SDK (token verification)
- **Session**: Stateless JWT-based

### Authorization
- **Database**: Firestore Security Rules
- **API**: Role-based access control
- **Files**: Storage Security Rules

### Data Protection
- **Encryption**: TLS 1.3 (transport), AES-256 (at rest)
- **PII**: Minimal collection, proper anonymization
- **GDPR**: Right to export/delete implemented

## Scalability Considerations

### Database
- **Reads**: Client-side caching + CDN
- **Writes**: Batch operations where possible
- **Indexes**: Composite indexes for complex queries
- **Limits**: < 1MB documents, pagination for large collections

### API
- **Caching**: Redis (future) for game search results
- **Rate Limiting**: 100 req/min per client
- **Auto-scaling**: Cloud Run (0 to N instances)

---

*Last Updated: 2025-08-03*