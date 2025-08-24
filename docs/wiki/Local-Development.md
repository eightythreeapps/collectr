# Local Development Setup

Complete guide for setting up and running Collectr locally.

## Prerequisites

### Required Software
- **Node.js**: 20+ LTS (18.x works but shows warnings)
- **Java Development Kit**: 11+ (for Firebase emulators)
- **pnpm**: 9.x (`npm install -g pnpm`)
- **Firebase CLI**: Latest (`npm install -g firebase-tools`)
- **Git**: Latest version

### Java Setup (Required for Firebase Emulators)
```bash
# macOS with Homebrew
brew install openjdk@11

# Set environment variables (add to ~/.zshrc or ~/.bashrc)
export JAVA_HOME="/opt/homebrew/opt/openjdk@11"
export PATH="$JAVA_HOME/bin:$PATH"

# Verify installation
java -version
```

### Accounts Needed
- **Firebase/Google Cloud**: For backend services
- **IGDB/Twitch**: For game data API (optional for basic development)

## Initial Setup

### 1. Clone and Install
```bash
git clone https://github.com/yourusername/collectr.git
cd collectr
pnpm install
```

### 2. Environment Configuration

**Web App** (`apps/web/.env.local`):

*For Development (Firebase Emulators):*
```env
# Firebase Configuration for Development/Emulators
NEXT_PUBLIC_FIREBASE_API_KEY=demo-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=demo-collectr.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=demo-collectr
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=demo-collectr.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=998912996227
NEXT_PUBLIC_FIREBASE_APP_ID=demo-app-id

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_ENVIRONMENT=development
```

*For Production Firebase Project:*
```env
# Firebase Configuration for Production
NEXT_PUBLIC_FIREBASE_API_KEY=your_production_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=collectr-8ae95.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=collectr-8ae95
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=collectr-8ae95.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=998912996227
NEXT_PUBLIC_FIREBASE_APP_ID=your_production_app_id

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_ENVIRONMENT=development
```

**API Server** (`apps/api/.env`):
```env
# Server Configuration
PORT=3001
HOST=0.0.0.0
NODE_ENV=development

# Firebase Configuration
GOOGLE_CLOUD_PROJECT=collectr-8ae95
FIREBASE_PROJECT_ID=collectr-8ae95

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# External APIs (Optional)
IGDB_CLIENT_ID=your_twitch_client_id
IGDB_CLIENT_SECRET=your_twitch_client_secret
RAWG_API_KEY=your_rawg_api_key

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60000
```

### 3. Build Packages
```bash
pnpm build
```

## Running Development Servers

### Option 1: Development with Firebase Emulators (Recommended)

**Step 1: Start Firebase Emulators**
```bash
# From project root
firebase emulators:start
```

**Step 2: Start Web App** (in separate terminal)
```bash
pnpm --filter @collectr/web dev
```

This setup provides:
- **Firebase Auth Emulator**: http://localhost:9099
- **Firestore Emulator**: http://localhost:8080  
- **Storage Emulator**: http://localhost:9199
- **Firebase UI Dashboard**: http://localhost:4000
- **Web App**: http://localhost:3001 (or 3000)

### Option 2: Production Firebase Connection

**Firebase Emulators (for development only):**
```bash
firebase emulators:start --project=demo-collectr
```

**Production Firebase (for staging/testing):**
```bash
# Use production environment variables
firebase emulators:start --project=collectr-8ae95
```

**API Server:**
```bash
GOOGLE_CLOUD_PROJECT=collectr-8ae95 FIREBASE_PROJECT_ID=collectr-8ae95 pnpm --filter @collectr/api dev
```

**Web App:**
```bash
pnpm --filter @collectr/web dev
```

## Service URLs

| Service | URL | Purpose |
|---------|-----|---------|
| **Web App** | http://localhost:3001 | Next.js development server |
| **API Server** | http://localhost:3001 | Fastify backend API |
| **Firebase UI** | http://localhost:4000 | Emulator management interface |
| **Firestore** | http://localhost:8080 | Database emulator |
| **Auth Emulator** | http://localhost:9099 | Authentication emulator |
| **Storage** | http://localhost:9199 | File storage emulator |

## API Testing

### Health Check
```bash
curl http://localhost:3001/health
```

### Game Search
```bash
curl "http://localhost:3001/v1/games/search?q=mario&limit=3"
```

### Authentication Testing

**Test User Registration/Login:**
1. Open http://localhost:3001
2. Click "Sign In" or "Get Started"
3. Use Firebase emulator (any email/password works):
   ```
   Email: test@collectr.dev
   Password: password123
   ```
4. Or test Google OAuth with real Google account

**Test API with Authentication:**
```bash
# Get Firebase ID token from browser console after login:
# firebase.auth().currentUser.getIdToken().then(console.log)

curl -H "Authorization: Bearer YOUR_ID_TOKEN" \
     "http://localhost:3001/v1/users/me"
```

**View Authentication Data:**
- Open http://localhost:4000/auth
- See all test users and authentication events
- Manually add/remove users for testing

## Common Development Tasks

### Add New Package
```bash
pnpm create package-name
cd packages/package-name
pnpm init
```

### Update Dependencies
```bash
pnpm update --recursive
```

### Type Check All Packages
```bash
pnpm type-check
```

### Lint All Code
```bash
pnpm lint
```

### Build for Production
```bash
pnpm build
```

## Database Management

### View Local Data
- Open http://localhost:4000
- Navigate to Firestore tab
- Browse collections and documents

### Reset Local Data
```bash
# Stop emulators, then restart
firebase emulators:start --project=collectr-8ae95
```

### Deploy Rules to Production
```bash
cd firebase
firebase deploy --only firestore:rules,storage:rules,firestore:indexes
```

## Troubleshooting

### Port Conflicts
```bash
# Kill processes on specific ports
lsof -ti:3001 | xargs kill -9  # API port
lsof -ti:3000 | xargs kill -9  # Web port
lsof -ti:8080 | xargs kill -9  # Firestore port
```

### Firebase Authentication Issues

**Emulator Connection Problems:**
```bash
# Check if emulators are running
curl http://localhost:4000

# Restart emulators with clean data
firebase emulators:start --clear
```

**Authentication Not Working:**
- Verify app shows "Connected to Firebase emulators" in browser console
- Check environment variables in `.env.local`
- Ensure NEXT_PUBLIC_ENVIRONMENT=development
- Try different browser if Google OAuth fails

**Production Firebase Issues:**
- Check Firebase project ID in environment files
- Ensure Firebase CLI is logged in: `firebase login`
- Verify project selection: `firebase use collectr-8ae95`

### TypeScript Errors
```bash
# Clean build artifacts
pnpm clean
pnpm build

# Check for type errors
pnpm type-check
```

### Environment Variables Not Loading
- Ensure `.env` files exist and have correct names
- Check file permissions (should be readable)
- Restart development servers after changes
- Use `dotenv/config` import in entry files

### IGDB API Issues
- Verify Twitch application is set up correctly
- Check client ID and secret in environment file
- Test token generation manually:
```bash
curl -X POST "https://id.twitch.tv/oauth2/token" \
  -d "client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET&grant_type=client_credentials"
```

## Development Workflow

### Daily Startup
1. `git pull origin main`
2. `pnpm install` (if package.json changed)
3. **Start Firebase emulators:** `firebase emulators:start`
4. **Start web app** (new terminal): `pnpm --filter @collectr/web dev`
5. **Verify setup:**
   - Open http://localhost:3001 to verify web app
   - Check authentication works (sign up/login)
   - Test API with `curl http://localhost:3001/health`

### Before Committing
1. `pnpm lint` - Fix any linting issues
2. `pnpm type-check` - Resolve TypeScript errors
3. `pnpm build` - Ensure everything builds
4. Test key functionality manually

### Production Deployment
1. Build: `pnpm build`
2. Deploy web: `firebase deploy --only hosting`
3. Deploy API: Deploy to Cloud Run (future)

## IDE Configuration

### VS Code Extensions
- TypeScript and JavaScript Language Features
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Firebase

### Settings
```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

---

*Last Updated: 2025-08-03*