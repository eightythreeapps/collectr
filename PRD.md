# Product Requirements Document (PRD)
## Retro Video Game Collection App - MVP

### 1. Executive Summary

**Product Name:** Collectr

**Vision:** Create a comprehensive digital cataloging system for retro video game collectors to manage, track, and showcase their physical game collections.

**MVP Goal:** Deliver a functional web application that allows users to catalog their video game collection with essential features for adding, viewing, editing, and organizing games.

### 2. Product Overview

#### 2.1 Problem Statement
Retro game collectors lack a dedicated, modern solution to:
- Track their growing collections across multiple platforms
- Quickly check if they already own a game while shopping
- Monitor collection value and completeness
- Share their collection with other enthusiasts

#### 2.2 Target Users
- Primary: Retro video game collectors (ages 25-45)
- Secondary: Video game enthusiasts looking to start collecting
- Tertiary: Game store owners managing inventory

#### 2.3 Success Metrics
- User registration and retention rate
- Number of games cataloged per user
- Daily/Weekly active users
- Time to add a new game (target: <30 seconds)

### 3. Technical Architecture

#### 3.1 Technology Stack
- **Frontend:** React with TypeScript
- **Backend:** Firebase Functions (TypeScript)
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth
- **Hosting:** Firebase Hosting
- **File Storage:** Firebase Storage (for game images)
- **Game Database API:** RAWG API
- **AI Vision:** Google Gemini API (via Vertex AI)
- **Image Processing:** Sharp (for image optimization)

#### 3.2 Development Principles
- Mobile-first responsive design
- Type-safe development with TypeScript
- Real-time data synchronization
- AI-enhanced user experience
- API response caching for performance
- Offline capability consideration for future releases

### 4. Core Features (MVP)

#### 4.1 User Authentication
**Priority:** P0 (Critical)

**Requirements:**
- Email/password registration and login
- Google OAuth integration
- Password reset functionality
- User profile creation upon registration

**Technical Implementation:**
- Firebase Auth for all authentication flows
- Secure token-based session management
- Protected routes in React

#### 4.2 Game Collection Management

##### 4.2.1 Add Game
**Priority:** P0 (Critical)

**Requirements:**
- **AI Cover Scan** (Primary method):
  - Camera/image upload for cover art
  - Gemini Vision API analyzes the image
  - Extracts game title, platform, and other visible information
  - Auto-populates form fields
  - Shows confidence score for AI predictions
  - User can confirm or edit extracted data
- **RAWG API Search**:
  - Search by title as user types
  - Display search results with cover art
  - One-click to import all game data
  - Platform filtering in search
- **Manual Entry** (Fallback):
  - Title (required)
  - Platform/Console (required, dropdown)
  - Publisher
  - Developer
  - Release Year
  - Region (NTSC/PAL/JP)
  - Condition (Mint/Near Mint/Good/Fair/Poor)
  - Complete in Box (CIB) status
  - Manual included (Y/N)
  - Notes (free text)
- Image storage for personal cover photos
- Barcode scanner integration (future consideration)

**Technical Implementation:**
- Gemini API integration via Firebase Functions
- RAWG API integration with TypeScript interfaces
- Image preprocessing before AI analysis
- Firestore document per game
- Firebase Storage for images
- Form validation with TypeScript interfaces
- Caching layer for API responses

##### 4.2.2 View Collection
**Priority:** P0 (Critical)

**Requirements:**
- Grid view with game cover thumbnails
- List view with detailed information
- Sort options:
  - Alphabetical
  - Platform
  - Year
  - Recently added
- Filter options:
  - By platform
  - By condition
  - By completion status
- Search functionality (title search)
- Pagination or infinite scroll

**Technical Implementation:**
- Firestore queries with compound indexes
- React components for view switching
- Debounced search implementation
- Virtual scrolling for large collections

##### 4.2.3 Edit/Delete Games
**Priority:** P0 (Critical)

**Requirements:**
- Edit all game fields
- Delete with confirmation dialog
- Bulk operations (select multiple)

**Technical Implementation:**
- Optimistic UI updates
- Firestore transactions for data consistency
- Soft delete option for recovery

#### 4.3 Platform Management
**Priority:** P1 (High)

**Requirements:**
- Predefined list of common platforms:
  - Nintendo (NES, SNES, N64, GameCube, etc.)
  - Sega (Genesis, Saturn, Dreamcast, etc.)
  - Sony (PS1, PS2, PS3, etc.)
  - Microsoft (Xbox, Xbox 360, etc.)
  - Atari systems
  - Others
- Custom platform addition
- Platform statistics (games per platform)

#### 4.4 Collection Statistics Dashboard
**Priority:** P1 (High)

**Requirements:**
- Total games count
- Games by platform breakdown
- Collection completeness metrics
- Condition distribution
- Recently added games
- Collection value estimate (future)

**Technical Implementation:**
- Firestore aggregation queries
- Client-side caching for performance
- React components with chart library (Chart.js or Recharts)

#### 4.6 AI-Powered Game Recognition
**Priority:** P0 (Critical)

**Requirements:**
- **Cover Art Recognition:**
  - Upload or capture game cover photo
  - Support for front/back/spine images
  - Handle various lighting conditions
  - Process multiple games in one image (batch scanning)
- **Gemini Vision Processing:**
  - Extract game title with confidence score
  - Identify platform/console from box design
  - Detect region (NTSC/PAL/JP) from ratings logos
  - Read publisher/developer information
  - Identify special editions or variants
  - Extract barcode if visible
- **Smart Matching:**
  - Cross-reference extracted data with RAWG API
  - Fuzzy matching for OCR errors
  - Platform-specific validation
  - Suggest closest matches if exact match not found
- **User Feedback Loop:**
  - Allow corrections to improve future recognition
  - Store correction data for ML training (future)

**Technical Implementation:**
- Vertex AI/Gemini API integration
- Image preprocessing (resize, enhance contrast)
- Structured prompt engineering for consistent results
- Response parsing and validation
- Fallback to manual search if confidence < 70%

#### 4.10 User Profile
**Priority:** P2 (Medium)

**Requirements:**
- Display name
- Avatar upload
- Collection visibility settings (public/private)
- Bio/description
- Join date
- Collection statistics summary
- RAWG API key management (optional, for power users)
- PriceCharting API key management (optional, for premium pricing)

### 5. Data Model

#### 5.1 Core Entities

**User Collection:**
```typescript
interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  collectionVisibility: 'public' | 'private';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Game Collection:**
```typescript
interface Game {
  id: string;
  userId: string;
  title: string;
  platform: string;
  publisher?: string;
  developer?: string;
  releaseYear?: number;
  region?: 'NTSC' | 'PAL' | 'JP' | 'OTHER';
  condition?: 'Mint' | 'Near Mint' | 'Good' | 'Fair' | 'Poor';
  cib: boolean;
  hasManual: boolean;
  notes?: string;
  coverImageUrl?: string;
  userImageUrl?: string; // User's own photo
  barcode?: string;
  rawgId?: number; // RAWG game ID
  rawgSlug?: string; // RAWG game slug
  metacriticScore?: number;
  esrbRating?: string;
  genres?: string[];
  aiConfidence?: number; // Confidence score from Gemini
  dataSource: 'manual' | 'rawg' | 'gemini' | 'mixed';
  addedAt: Timestamp;
  updatedAt: Timestamp;
}
```

**Platform Collection:**
```typescript
interface Platform {
  id: string;
  name: string;
  manufacturer: string;
  releaseYear?: number;
  rawgId?: number; // RAWG platform ID
  rawgSlug?: string;
  isCustom: boolean;
}
```

**API Cache Collection:**
```typescript
interface APICache {
  id: string;
  endpoint: string;
  query: string;
  response: any;
  source: 'rawg' | 'gemini';
  createdAt: Timestamp;
  expiresAt: Timestamp;
}
```

**Price Data Collection:**
```typescript
interface PriceData {
  id: string;
  gameId: string;
  source: 'pricecharting' | 'manual' | 'ebay';
  prices: {
    loose?: number;
    cib?: number;
    new?: number;
    graded?: number;
    box?: number;
    manual?: number;
  };
  currency: 'USD' | 'EUR' | 'GBP';
  lastUpdated: Timestamp;
  historicalPrices?: Array<{
    date: Timestamp;
    price: number;
    condition: string;
  }>;
}
```

**User Collection Value:**
```typescript
interface CollectionValue {
  userId: string;
  totalValue: number;
  totalCost: number; // What user paid
  profitLoss: number;
  valueByPlatform: Map<string, number>;
  valueByCondition: Map<string, number>;
  topValueGames: string[]; // Game IDs
  lastCalculated: Timestamp;
  trend30Days: number; // Percentage change
}
```

### 6. User Interface Requirements

#### 6.1 Design Principles
- Clean, modern interface
- High contrast for readability
- Touch-friendly controls
- Consistent spacing and typography
- Dark mode support (future)

#### 6.2 Key Screens
1. **Authentication:** Login/Register forms
2. **Dashboard:** Overview with statistics and recent additions
3. **Collection View:** Grid/List toggle with filters
4. **Add/Edit Game:** Form with all fields
5. **Game Detail:** Full game information display
6. **Profile:** User settings and preferences

#### 6.3 Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### 7. Security & Privacy

#### 7.1 Security Requirements
- HTTPS only
- Firebase Security Rules for data access
- Input sanitization
- XSS prevention
- Rate limiting on API calls

#### 7.2 Privacy Requirements
- User data isolation
- Optional public profiles
- No sharing of personal information
- GDPR compliance considerations

### 8. Performance Requirements

- Initial page load: < 3 seconds
- Game addition: < 2 seconds
- Search results: < 500ms
- Image upload: Progress indicator for files > 1MB
- Support for collections up to 10,000 games

### 9. Future Enhancements (Post-MVP)

**Phase 2 Features:**
- Barcode scanning for quick entry
- Integration with game databases (IGDB, GiantBomb)
- Price tracking and value estimates
- Wishlist functionality
- Collection sharing and social features
- Export collection (CSV, PDF)
- Mobile app (React Native)

**Phase 3 Features:**
- Marketplace integration
- Trade/sell functionality
- Achievement system
- Collection goals and completion tracking
- Advanced analytics
- Backup and restore functionality

### 10. Development Phases

#### Phase 1: Foundation (Week 1-2)
- Project setup (React, TypeScript, Firebase)
- Authentication implementation
- Basic routing and navigation
- Core data models

#### Phase 2: Core Features (Week 3-5)
- Add game functionality
- Collection view (grid/list)
- Edit/delete operations
- Search and filter

#### Phase 3: Enhancement (Week 6-7)
- Statistics dashboard
- User profiles
- Platform management
- Image handling optimization

#### Phase 4: Polish & Deploy (Week 8)
- UI/UX refinements
- Performance optimization
- Testing and bug fixes
- Production deployment

### 11. Testing Strategy

**Unit Testing:**
- Jest for React components
- Firebase Functions testing

**Integration Testing:**
- Firestore security rules testing
- Authentication flow testing

**User Acceptance Testing:**
- Beta testing with 5-10 collectors
- Feedback incorporation
- Performance testing with large datasets

### 12. Launch Strategy

**Soft Launch:**
- Deploy to Firebase Hosting
- Invite beta testers
- Gather feedback for 2 weeks

**Public Launch:**
- Fix critical issues from beta
- Announce on retro gaming forums
- Create documentation/help section

### 13. Monitoring & Analytics

- Firebase Analytics for user behavior
- Firebase Performance Monitoring
- Error tracking with Firebase Crashlytics
- Custom events for key actions (game added, search performed)

### 14. Budget & Resources

**Development Team:**
- 1 Full-stack developer (you)
- Optional: UI/UX designer for mockups

**Infrastructure Costs (Firebase):**
- Free tier initially (up to 50K reads/day)
- Estimated $25-50/month at scale

**Timeline:**
- MVP Development: 8 weeks
- Beta Testing: 2 weeks
- Total: 10 weeks to launch

### 15. Risk Mitigation

**Technical Risks:**
- Firebase quotas: Implement caching and pagination
- Large image storage: Compress images, set size limits
- Data loss: Regular Firestore backups

**User Adoption Risks:**
- Competition from existing apps: Focus on simplicity and speed
- User retention: Implement engaging features like statistics

### 16. API Integration Details

#### 16.1 RAWG API Configuration

**Base URL:** `https://api.rawg.io/api`

**Key Endpoints:**
- `/games` - Search and list games
- `/games/{id}` - Get detailed game information
- `/platforms` - Get platform list
- `/genres` - Get genre list

**Implementation Example:**
```typescript
// functions/src/services/rawgService.ts
import axios from 'axios';

class RAWGService {
  private apiKey: string;
  private baseURL = 'https://api.rawg.io/api';
  
  async searchGames(query: string, platform?: number) {
    const params = {
      key: this.apiKey,
      search: query,
      page_size: 20,
      ...(platform && { platforms: platform })
    };
    
    return axios.get(`${this.baseURL}/games`, { params });
  }
  
  async getGameDetails(id: number) {
    return axios.get(`${this.baseURL}/games/${id}`, {
      params: { key: this.apiKey }
    });
  }
}
```

#### 16.2 Gemini Vision API Configuration

**Setup Requirements:**
1. Enable Vertex AI API in Google Cloud Console
2. Configure Firebase project with Google Cloud
3. Set up service account with appropriate permissions

**Implementation Example:**
```typescript
// functions/src/services/geminiService.ts
import { VertexAI } from '@google-cloud/vertexai';

class GeminiVisionService {
  private vertexAI: VertexAI;
  private model: GenerativeModel;
  
  constructor() {
    this.vertexAI = new VertexAI({
      project: process.env.GCP_PROJECT,
      location: 'us-central1'
    });
    
    this.model = this.vertexAI.preview.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });
  }
  
  async analyzeGameCover(imageBase64: string) {
    const prompt = `
      Analyze this video game cover and extract:
      1. Game title (exactly as shown)
      2. Platform/Console (e.g., PlayStation 2, Xbox, Nintendo Switch)
      3. Publisher (if visible)
      4. Region (NTSC/PAL/JP based on rating logos)
      5. Any special edition indicators
      
      Respond in JSON format:
      {
        "title": "string",
        "platform": "string",
        "publisher": "string or null",
        "region": "string or null",
        "specialEdition": "string or null",
        "confidence": 0.0-1.0
      }
    `;
    
    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: imageBase64
      }
    };
    
    const result = await this.model.generateContent([prompt, imagePart]);
    return JSON.parse(result.response.text());
  }
}
```

#### 16.3 Caching Strategy

**Cache Layers:**
1. **Client-side:** React Query or SWR for request deduplication
2. **Firebase Functions:** In-memory cache for hot data
3. **Firestore:** Persistent cache for API responses

**Cache TTL:**
- RAWG search results: 24 hours
- RAWG game details: 7 days
- Platform list: 30 days
- Gemini responses: Permanent (for training data)

#### 16.4 PriceCharting Integration

**Implementation Strategy:**
```typescript
// functions/src/services/pricingService.ts
class PricingService {
  private pricechartingKey?: string;
  
  async getGamePrice(title: string, platform: string, upc?: string) {
    // Try cache first
    const cached = await this.getCachedPrice(title, platform);
    if (cached && !this.isStale(cached)) return cached;
    
    // If user has PriceCharting API key
    if (this.pricechartingKey) {
      return await this.fetchFromPriceCharting(title, platform, upc);
    }
    
    // Fallback: Allow manual entry with disclaimer
    return null;
  }
  
  async updateCollectionValues(userId: string) {
    // Run as scheduled function daily
    const games = await this.getUserGames(userId);
    
    for (const game of games) {
      const priceData = await this.getGamePrice(
        game.title, 
        game.platform,
        game.barcode
      );
      
      if (priceData) {
        await this.updateGameValue(game.id, priceData);
      }
    }
    
    // Calculate total collection value
    await this.calculateTotalValue(userId);
  }
}
```

**Pricing Display Options:**
1. **Free Tier:** Manual price entry only
2. **User API Key:** User provides their own PriceCharting key
3. **Premium:** App provides shared API access (future monetization)

### 17. Cost Analysis

**Monthly Operating Costs (Estimated):**
- Firebase Hosting: Free (within limits)
- Firestore: ~$10-30 (depends on users)
- Firebase Functions: ~$5-20
- Firebase Storage: ~$5-10
- RAWG API: Free (personal use)
- Gemini API: ~$20-50 (depends on usage)
- PriceCharting API: $15-30 (optional)
- **Total: ~$55-140/month at scale**

**Cost Optimization:**
- Aggressive caching (24-hour minimum)
- Batch API calls where possible
- User-provided API keys option
- Progressive enhancement (basic free, premium paid)

---

**Document Version:** 1.0
**Last Updated:** Current Date
**Author:** Product Owner
**Status:** Ready for Development