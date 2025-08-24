# Firebase Emulator Development Guide

## Overview

Firebase Emulators provide a local development environment that mimics Firebase services without connecting to production. This enables safe development, testing, and debugging of Firebase features locally.

## Why Use Firebase Emulators?

### ✅ Benefits
- **No Production Impact**: Test without affecting live data
- **Offline Development**: Work without internet connection
- **Fast Iteration**: No network latency for rapid development
- **Free Testing**: No Firebase usage costs during development
- **Realistic Environment**: Behavior matches production closely
- **Data Inspection**: View and manipulate test data easily

### 🚫 When NOT to Use
- Final production testing (use staging environment)
- Performance testing under production load
- Testing actual email delivery (emails are simulated)
- Testing production-specific integrations

## Services Available

| Service | Port | Purpose | UI Available |
|---------|------|---------|--------------|
| **Authentication** | 9099 | User authentication & management | ✅ |
| **Firestore** | 8080 | NoSQL database operations | ✅ |
| **Storage** | 9199 | File upload/download | ✅ |
| **Functions** | 5001 | Serverless functions (when added) | ✅ |
| **Hosting** | 5000 | Static site hosting (when added) | ✅ |
| **Emulator UI** | 4000 | Web interface for all emulators | ✅ |

## Installation & Setup

### Prerequisites

1. **Node.js** (18.20.5+ or 20+):
   ```bash
   node --version
   ```

2. **Java Development Kit** (11 or higher):
   ```bash
   # macOS with Homebrew
   brew install openjdk@11
   
   # Set environment variables
   export JAVA_HOME="/opt/homebrew/opt/openjdk@11"
   export PATH="$JAVA_HOME/bin:$PATH"
   
   # Verify installation
   java -version
   ```

3. **Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   firebase --version
   ```

### Project Configuration

1. **firebase.json** (already configured):
   ```json
   {
     "emulators": {
       "auth": {
         "port": 9099
       },
       "firestore": {
         "port": 8080
       },
       "storage": {
         "port": 9199
       },
       "ui": {
         "enabled": true,
         "port": 4000
       },
       "singleProjectMode": true
     },
     "firestore": {
       "rules": "firestore.rules",
       "indexes": "firestore.indexes.json"
     },
     "storage": {
       "rules": "storage.rules"
     }
   }
   ```

2. **Security Rules** (already configured):
   - `firestore.rules`: Database security rules
   - `storage.rules`: File storage security rules
   - `firestore.indexes.json`: Database indexes

## Starting the Emulators

### Basic Startup

```bash
# From project root directory
firebase emulators:start

# Or with specific project ID
firebase emulators:start --project demo-collectr
```

### Advanced Options

```bash
# Clear all data on startup
firebase emulators:start --clear

# Start only specific emulators
firebase emulators:start --only auth,firestore

# Import existing data
firebase emulators:start --import ./emulator-data

# Export data on shutdown
firebase emulators:start --export-on-exit ./emulator-data
```

### Expected Output

```
i  emulators: Starting emulators: auth, firestore, storage
i  firestore: Firestore Emulator logging to firestore-debug.log
✔  firestore: Firestore Emulator UI websocket is running on 9150.
✔  All emulators ready! It is now safe to connect your app.
i  View Emulator UI at http://127.0.0.1:4000/

┌────────────────┬────────────────┬─────────────────────────────────┐
│ Emulator       │ Host:Port      │ View in Emulator UI             │
├────────────────┼────────────────┼─────────────────────────────────┤
│ Authentication │ 127.0.0.1:9099 │ http://127.0.0.1:4000/auth      │
├────────────────┼────────────────┼─────────────────────────────────┤
│ Firestore      │ 127.0.0.1:8080 │ http://127.0.0.1:4000/firestore │
├────────────────┼────────────────┼─────────────────────────────────┤
│ Storage        │ 127.0.0.1:9199 │ http://127.0.0.1:4000/storage   │
└────────────────┴────────────────┴─────────────────────────────────┘
```

## Development Workflow

### 1. Start Development Environment

```bash
# Terminal 1: Start Firebase Emulators
firebase emulators:start

# Terminal 2: Start Web App (after emulators are running)
pnpm --filter @collectr/web dev
```

### 2. Application Connection

The app automatically connects to emulators in development mode:

```typescript
// firebase.ts automatically detects development mode
if (process.env.NODE_ENV === 'development' && !globalThis.__FIREBASE_EMULATOR_CONNECTED__) {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectStorageEmulator(storage, 'localhost', 9199);
    
    globalThis.__FIREBASE_EMULATOR_CONNECTED__ = true;
    console.log('Connected to Firebase emulators');
  } catch (error) {
    console.warn('Could not connect to Firebase emulators:', error);
  }
}
```

### 3. Development Cycle

1. **Make Code Changes** → Auto-reload with Next.js
2. **Test Features** → Use app normally
3. **Check Data** → View in Emulator UI
4. **Debug Issues** → Console logs + Emulator UI
5. **Reset Data** → Restart emulators with `--clear`

## Using the Emulator UI

### Accessing the UI
- **Main Dashboard**: http://127.0.0.1:4000/
- **Authentication**: http://127.0.0.1:4000/auth
- **Firestore**: http://127.0.0.1:4000/firestore
- **Storage**: http://127.0.0.1:4000/storage

### Authentication Emulator

#### Features
- View all users created during development
- Add/remove users manually
- View user claims and metadata
- Test different authentication states
- Monitor sign-in/sign-out events

#### Testing Users
```javascript
// Any email/password combination works in emulator
Email: test@collectr.dev
Password: password123

// Google OAuth uses real Google accounts but doesn't create production users
```

#### Common Tasks
1. **View Users**: See all registered test users
2. **Delete Users**: Clean up test accounts
3. **Check Claims**: Verify custom user claims
4. **Monitor Activity**: View authentication logs

### Firestore Emulator

#### Features
- Browse collections and documents
- Add/edit/delete data manually
- Query data with filters
- Import/export data
- Monitor rule evaluations

#### Common Tasks
1. **View Collections**: Browse user data, games, profiles
2. **Add Test Data**: Create sample documents manually
3. **Test Queries**: Verify database queries work correctly
4. **Check Security**: Ensure rules prevent unauthorized access

#### Example Test Data
```javascript
// users collection
{
  "userId123": {
    "email": "test@collectr.dev",
    "displayName": "Test User",
    "createdAt": "2025-08-23T16:00:00Z",
    "profileComplete": false
  }
}

// users/{userId}/games collection
{
  "gameId456": {
    "title": "Super Mario Bros",
    "platform": "NES",
    "condition": "Good",
    "addedAt": "2025-08-23T16:00:00Z"
  }
}
```

### Storage Emulator

#### Features
- View uploaded files
- Download files
- Organize by folder structure
- Monitor upload/download activity
- Test security rules

#### Common Tasks
1. **View Files**: See uploaded images, documents
2. **Test Uploads**: Verify file upload functionality
3. **Check Access**: Ensure proper file permissions
4. **Monitor Size**: Track storage usage

## Authentication in Emulator Mode

### How It Works
- **Email/Password**: Any combination works (no real email validation)
- **Google OAuth**: Uses real Google accounts but creates emulator-only users
- **Password Reset**: Emails appear in emulator UI, not sent to real addresses
- **User Data**: All data is temporary and local

### Testing Scenarios

#### 1. Email/Password Registration
```javascript
// Test different email formats
✅ test@example.com
✅ user123@test.dev  
✅ invalid-email-format  // Still works in emulator

// Test passwords
✅ "123456"           // Minimum length
✅ "password123"      // Normal password
✅ "a"                // Even single character works in emulator
```

#### 2. Google OAuth Testing
```javascript
// Process
1. User clicks "Continue with Google"
2. Real Google popup opens
3. User signs in with real Google account
4. Emulator creates local user (doesn't affect production)
5. App receives user data normally
```

#### 3. Password Reset Testing
```javascript
// Process
1. User enters email and requests reset
2. Emulator UI shows "sent" email in Auth > Templates
3. Click email to see reset link
4. Reset link works like production
```

### User Session Testing

```javascript
// Test authentication state persistence
1. Sign in → Check localStorage for Firebase token
2. Refresh page → Should stay logged in
3. Clear localStorage → Should log out
4. Sign out → Should clear all tokens
```

## Data Management

### Importing/Exporting Data

```bash
# Export current emulator data
firebase emulators:export ./backup-data

# Import previously exported data
firebase emulators:start --import ./backup-data

# Start fresh (delete all data)
firebase emulators:start --clear
```

### Sample Data Creation

Create `sample-data.js`:
```javascript
const admin = require('firebase-admin');

// Initialize with emulator
admin.initializeApp({
  projectId: 'demo-collectr'
});

const db = admin.firestore();
db.settings({
  host: 'localhost:8080',
  ssl: false
});

// Create sample user
async function createSampleData() {
  await db.collection('users').doc('sample-user').set({
    email: 'sample@collectr.dev',
    displayName: 'Sample User',
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
  
  console.log('Sample data created');
}

createSampleData();
```

Run with: `node sample-data.js`

## Debugging & Troubleshooting

### Common Issues

#### 1. Emulators Won't Start

**Java Not Found**:
```bash
Error: Could not find or access Java runtime

# Solution:
export JAVA_HOME="/opt/homebrew/opt/openjdk@11"
export PATH="$JAVA_HOME/bin:$PATH"
```

**Port Already in Use**:
```bash
Error: Port 9099 is already in use

# Solution: Kill process using port
lsof -ti:9099 | xargs kill -9

# Or change port in firebase.json
```

#### 2. App Not Connecting to Emulators

**Check Console Output**:
```javascript
// Should see in browser console:
"Connected to Firebase emulators"

// If missing, check:
1. Emulators are running
2. Environment is set to 'development'
3. No firewall blocking localhost connections
```

**Connection Code**:
```typescript
// Verify this runs in development
if (process.env.NODE_ENV === 'development') {
  console.log('Attempting emulator connection...');
  // Connection code should execute
}
```

#### 3. Authentication Issues

**Google OAuth Not Working**:
- Ensure popup blockers are disabled
- Check browser console for errors
- Verify real Google account is used
- Try redirect fallback if popup fails

**Email/Password Issues**:
- Any email/password should work
- Check network tab for auth requests
- Verify requests go to localhost:9099

#### 4. Data Not Persisting

**Data Disappears on Restart**:
```bash
# Use export/import to persist data
firebase emulators:start --export-on-exit ./data
firebase emulators:start --import ./data
```

**Rules Blocking Access**:
- Check Firestore rules in emulator UI
- Verify authentication state
- Test with admin account

### Debug Logging

Enable detailed logging:

```bash
# Start with debug output
DEBUG=firebase* firebase emulators:start

# View specific service logs
tail -f firestore-debug.log
```

In code:
```typescript
// Add debug logging
if (process.env.NODE_ENV === 'development') {
  console.log('Auth state:', user);
  console.log('Firebase config:', app.options);
}
```

### Performance Monitoring

Monitor emulator performance:

```bash
# Check resource usage
ps aux | grep firebase
netstat -an | grep 9099

# Monitor file handles
lsof | grep firebase
```

## Best Practices

### 1. Development Workflow
- ✅ Always start emulators before web app
- ✅ Use consistent test data across team
- ✅ Export/import data for reproducible tests
- ✅ Clear data regularly to test fresh state
- ❌ Don't rely on emulator data long-term

### 2. Testing Strategy
- ✅ Test both success and error scenarios
- ✅ Verify security rules work correctly
- ✅ Test with different user types/states
- ✅ Validate data structures match expectations
- ❌ Don't skip production environment testing

### 3. Data Management
- ✅ Use meaningful IDs and data in tests
- ✅ Create helper scripts for common data setup
- ✅ Document test scenarios and expected outcomes
- ❌ Don't mix test and production data concepts

### 4. Team Collaboration
- ✅ Share emulator configuration files
- ✅ Document any emulator-specific setup
- ✅ Use version control for rules and indexes
- ❌ Don't commit exported emulator data

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: Test with Firebase Emulators

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Setup Java
        uses: actions/setup-java@v3
        with:
          distribution: 'temurin'
          java-version: '11'
          
      - name: Install Firebase CLI
        run: npm install -g firebase-tools
        
      - name: Install dependencies
        run: pnpm install
        
      - name: Start emulators and run tests
        run: |
          firebase emulators:exec --only auth,firestore 'pnpm test'
```

## Comparison: Emulator vs Production

| Feature | Emulator | Production |
|---------|----------|------------|
| **Data Persistence** | Temporary | Permanent |
| **Authentication** | Any credentials work | Real validation |
| **Email Delivery** | Simulated | Actually sent |
| **Performance** | Local speed | Network dependent |
| **Security Rules** | Same as production | Same as emulator |
| **Costs** | Free | Usage-based billing |
| **Internet Required** | No | Yes |
| **Setup Complexity** | Simple | More configuration |

---

**Last Updated**: August 23, 2025  
**Author**: Claude Code AI  
**Status**: ✅ Complete and Tested

## Quick Reference Commands

```bash
# Start everything
firebase emulators:start

# Start with clean slate
firebase emulators:start --clear

# Export data on exit
firebase emulators:start --export-on-exit ./data

# Import existing data
firebase emulators:start --import ./data

# Check if running
curl http://localhost:4000

# Kill all emulator processes
pkill -f firebase
```