# Collectr MVP

A collector-first platform for tracking and showcasing physical game collections. Combines the completeness of Discogs with the social discovery of Letterboxd.

## Project Structure

```
collectr/
├── apps/
│   ├── web/          # Next.js frontend
│   ├── api/          # Cloud Run API service
│   ├── ios/          # iOS SwiftUI app (future)
│   └── workers/      # Background workers (future)
├── packages/
│   ├── types/        # Shared TypeScript types and Zod schemas
│   └── eslint-config/# Shared ESLint configuration
├── infrastructure/
│   └── terraform/    # Infrastructure as Code
└── firebase/         # Firebase configuration and rules
```

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Radix UI
- **Backend**: Cloud Run (Fastify), Firebase Admin SDK
- **Database**: Cloud Firestore (native mode)
- **Authentication**: Firebase Auth (Google, Apple, email-link)
- **Storage**: Cloud Storage
- **External APIs**: IGDB (primary), RAWG (fallback)
- **Deployment**: Firebase Hosting + Cloud Run
- **CI/CD**: GitHub Actions with Workload Identity Federation

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+
- Firebase CLI
- gcloud CLI (for deployment)

### Local Development

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Set up environment variables:
   ```bash
   cp apps/web/.env.example apps/web/.env.local
   cp apps/api/.env.example apps/api/.env
   ```

3. Start Firebase emulators:
   ```bash
   cd firebase
   firebase emulators:start
   ```

4. Start development servers:
   ```bash
   # In separate terminals:
   pnpm --filter @collectr/web dev
   pnpm --filter @collectr/api dev
   ```

5. Open http://localhost:3000

### Build and Test

```bash
# Build all packages
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint

# Type check
pnpm type-check
```

## Key Features (MVP)

- [x] **Monorepo Setup**: Structured workspace with shared types
- [x] **Authentication**: Firebase Auth with OAuth providers
- [x] **Game Search**: IGDB + RAWG integration with relevance scoring
- [x] **Security**: Firestore rules with deny-by-default posture
- [ ] **Collection Management**: Add games to personal shelf
- [ ] **Public Shelves**: Share collections via public URLs
- [ ] **User Profiles**: Customizable profiles with privacy controls
- [ ] **Barcode Scanning**: PWA camera integration (nice-to-have)

## User Stories

| ID | Story | Status |
|----|-------|--------|
| U1 | OAuth login (Google/Apple) | ✅ Configured |
| U2 | Search "Chrono Trigger SNES" (≤300ms) | ✅ Implemented |
| U3 | Add to shelf with condition tracking | 🚧 In Progress |
| U4 | Create new game when no results | 📋 Planned |
| U5 | View public shelf via shareable URL | 📋 Planned |
| U6 | Edit/delete own entries | 📋 Planned |

## API Endpoints

### Games
- `GET /v1/games/search?q={query}` - Search games
- `GET /v1/games/barcode?upc={upc}` - Search by UPC
- `POST /v1/games` - Create new game (authenticated)
- `GET /v1/games/{gameId}` - Get game details

### Shelves
- `GET /v1/shelves/{userId}` - Get user's shelf
- `POST /v1/shelves/{userId}/items` - Add item to shelf
- `PATCH /v1/shelves/{userId}/items/{itemId}` - Update shelf item
- `DELETE /v1/shelves/{userId}/items/{itemId}` - Remove from shelf

### Users
- `GET /v1/users/me` - Get current user profile
- `PATCH /v1/users/me` - Update profile
- `GET /v1/users/{userId}` - Get public profile

## Security & Compliance

- **Authentication**: Firebase ID token verification on all protected endpoints
- **Authorization**: User can only modify their own data
- **Data Privacy**: Private by default, explicit public sharing
- **Input Validation**: Zod schemas for all API inputs
- **Rate Limiting**: 100 requests/minute per client
- **Security Rules**: Firestore deny-by-default with role-based access

## Performance Targets

- Search p95 latency: ≤ 300ms
- API write p95 latency: ≤ 200ms
- 95% search coverage (≥1 match)
- 98% data quality (required fields present)

## Deployment

### Environments

- **Development**: `collectr-dev` (auto-deploy from `main`)
- **Staging**: `collectr-stg` (manual promote from dev)
- **Production**: `collectr-prod` (manual promote from staging)

### Deploy Commands

```bash
# Deploy to development
firebase use dev
firebase deploy

# Deploy API to Cloud Run
gcloud run deploy collectr-api --source ./apps/api --region europe-west2
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is proprietary and confidential.