# Collectr MVP – Product Requirements Document (PRD)

---

## 1. Problem & Opportunity  
Physical‑game collectors currently lack a single, reliable destination to catalogue and showcase their libraries. Existing sites bias toward digital storefronts (Steam, PSN) or price‑tracking (PriceCharting) and often gate APIs. An IG‑compliant, collector‑first web app blending Discogs‑style completeness with Letterboxd‑style social discovery fills this gap.

## 2. Goals & Success Metrics (MVP)  

| Goal | Metric | Target | Notes |
| --- | --- | --- | --- |
| Fast first‑item add | Median time from sign‑up → first game added | ≤ 90 s | Key activation moment |
| Coverage | % of searches that return ≥1 match | ≥ 95 % | External API + user‑generated fallback |
| Data quality | % of game entries passing validation | ≥ 98 % | Title + platform + publisher present |
| Performance | 95th‑percentile search latency | ≤ 300 ms | Measured at CDN edge |
| Security | Zero P1/P2 pen‑test findings | 100 % pass | Meets IG bar |

## 3. Personas  
1. **Collector Carla** – 34, owns 500+ retro carts, wants quick batch entry and shelf tracking.  
2. **Curator Chris** – 25, moderate collection, enjoys adding missing editions and artwork.  
3. **Viewer Val** – 18, no collection yet, browses friends’ shelves for inspiration.

## 4. Key User Stories (Must‑Have for MVP)  

| ID | Story | Acceptance Criteria |
| --- | --- | --- |
| U1 | As **any user**, I can create an account with Google/Apple so I don’t manage passwords. | OAuth2 login succeeds; email scope only. |
| U2 | As **Carla**, I can search “Chrono Trigger SNES” and see canonical matches sorted by relevance. | ≤ 300 ms response; cover‑art thumbnail. |
| U3 | As **Carla**, I can tap “Add to My Shelf”, pick condition (CIB, loose), and save. | Game appears in personal shelf immediately. |
| U4 | As **Chris**, when a search returns “No results”, I can create a new entry via a guided form. | Mandatory fields: title, platform, publisher, year. |
| U5 | As **Val**, I can view another user’s public shelf via shareable URL. | Read‑only; no PII beyond chosen handle. |
| U6 | As **any user**, I can edit or delete my own entries. | Soft delete within 30 days. |

## 5. Functional Requirements  

1. **Search Service**  
   * Primary data: **IGDB** (free tier via Twitch OAuth).  
   * Fallback overflow: **RAWG** when rate‑limited.  
   * Deduplicate by IGDB `id` + platform slug.  

2. **Game Creation Workflow**  
   * If no external match → surface “Add New Game”.  
   * On submit: run AI enrichment (OpenAI function call) to autofill cover‑art alt text & synopsis.  
   * Entry flagged `pending_review = true`; moderator or two‑user up‑votes to publish.  

3. **Collection (Shelf) API**  
   * `POST /v1/shelves/{userId}/items` – idempotent by `gameId+variant`.  
   * `GET /v1/shelves/{userId}` – cursor‑based pagination.  

4. **Authentication & AuthZ**  
   * Firebase Auth (Google, Apple).  
   * Firestore rules: user can write only to `shelves/{uid}/**`.  

5. **Batch Add** (Nice‑to‑Have)  
   * Barcode scan via PWA camera + ZXing.js; lookup via IGDB UPC field.

## 6. Non‑Functional Requirements  

* **Performance** – Search p95 ≤ 300 ms; write p95 ≤ 200 ms.  
* **Scalability** – 10 k DAU, 1 M game docs, auto‑scaling Cloud Functions.  
* **Security & IG Compliance** – TLS 1.3; AES‑256 at rest; PII limited to OAuth UID + email; logs redact UIDs (30‑day retention); secrets in per‑env Secret Manager with tracked rotation.  
* **Privacy** – Private shelf by default; explicit toggle for public.  
* **Accessibility** – WCAG 2.2 AA; alt text auto‑generated then user‑editable.  
* **Localization** – English only in MVP; strings externalized.

## 7. Data Model (Firestore outline)

```
games (COLLECTION)
  {gameId}
    title: string
    platform: string   // enum (SNES, PS2…)
    publisher: string
    year: number
    coverUrl: string
    createdBy: uid
    pending_review: bool

shelves (COLLECTION)
  {uid} (DOCUMENT)
    items (SUBCOLLECTION)
      {gameId_variant}
        gameRef: /games/{gameId}
        condition: enum
        notes: string
```

## 8. API Sketch  

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/v1/games/search?q=` | public | IGDB → cache → response |
| POST | `/v1/games` | user | Propose new game |
| GET | `/v1/shelves/{uid}` | public/private | Read shelf |
| POST | `/v1/shelves/{uid}/items` | owner | Add game |
| PATCH | `/v1/shelves/{uid}/items/{id}` | owner | Update condition/notes |
| DELETE | same | owner | Soft-delete |

## 9. External Integrations & Trade‑offs  

| Option | Pros | Cons | MVP Decision |
| --- | --- | --- | --- |
| **IGDB API** | Free tier; rich metadata; UPCs | 4 req/s cap | **Use**; cache aggressively |
| **RAWG API** | Good images; no key needed | Unknown limits | Use as overflow |
| Gen‑AI fill | Infinite coverage | Hallucination risk; moderation needed | Use **only** when no API match; gate review |
| MobyGames paid API | Complete retro data | Cost; license | Post‑MVP |

## 10. Open Questions / Risks  

1. Moderator workflow scope – manual queue or two‑user consensus?  
2. Legal: IGDB TOS requires displaying “IGDB” credit – OK in footer?  
3. Storage cost for user‑uploaded covers – budget?

## 11. Launch Plan  

* **Tech Alpha (private)** – Core search/add/view; seed 1 k games.  
* **Beta (public invite)** – User‑generated game creation + moderation.  
* **MVP GA** – Social sharing, basic profile, public shelf.

---

### Appendix: Architecture High‑Level  

* **Frontend Web** – Next.js + TypeScript; static export behind CloudFront CDN.  
* **Backend** – Firebase (Auth, Firestore, Cloud Functions, Storage).  
* **AI Services** – OpenAI via server proxy; no client keys.  
* **CI/CD** – GitHub Actions → Firebase Hosting & Functions; env secrets via OIDC.

### Next Steps  

1. Confirm moderator workflow model.  
2. Register IGDB API keys; test search latency & quota.  
3. Create ADR‑001 “Data Source Strategy” capturing the API+AI blended approach.

## Firebase-Centric Tech Stack Specification
**Date:** 2025-08-03

This document defines the authoritative tech stack for the project. It is optimized for a small team, strong security/IG posture, and EU/UK data residency. Use this as source-of-truth for scaffolding and initial implementation.

---

## 1) Architecture Overview (authoritative)
- **Clients:**
  - **Web:** Next.js (TypeScript, React, App Router) on Firebase Hosting.
  - **iOS:** SwiftUI app, Firebase SDK via SPM.
- **Backend:**
  - **Cloud Run (Node.js/TypeScript)** for REST/HTTP APIs and admin tasks.
  - **Cloud Functions v2** only for event triggers (Auth/Firestore/Storage).
  - **Pub/Sub** for async jobs; **Cloud Scheduler** for cron; **Workflows** for orchestrations.
- **Data:** **Cloud Firestore (native mode)** as primary DB.
- **Files:** **Cloud Storage**.
- **Auth:** **Firebase Authentication** (passwordless/email-link + Apple + Google). MFA on.
- **Security:** Security Rules (deny-by-default), **App Check** enforced, **Secret Manager**.
- **Analytics/Reporting:** Firestore → **BigQuery export** (daily), derived tables for reporting.
- **Observability:** Cloud Logging/Monitoring/Trace + Sentry (web/API) + Crashlytics (apps).
- **Environments/Residency:** Separate GCP projects: `*-dev`, `*-stg`, `*-prod`; region **europe-west2 (London)** (fallback **europe-west1**).

---

## 2) Versions & Tooling (pin these)
- **Node.js:** 20 LTS
- **TypeScript:** ^5.x
- **Next.js:** current stable (App Router)
- **React:** 18.x
- **Package manager:** pnpm
- **Runtime for Cloud Run/Functions:** Node 20
- **iOS:** iOS 16+ target, Xcode current stable, Swift 5.9+
- **Lint/Format:** ESLint (+@typescript-eslint), Prettier, SwiftFormat/SwiftLint
- **Testing:** Vitest + Testing Library (web), XCTest (iOS)
- **IaC:** Terraform (Google provider) for projects/secrets/Run/Networking (minimal to start)
- **CI/CD:** GitHub Actions with Workload Identity Federation → deploy via Firebase CLI + gcloud

---

## 3) Web App (Next.js)
**Libraries**
- UI: Tailwind, Radix UI (accessibility), class-variance-authority
- Validation: Zod
- Data access: Firebase JS SDK (modular) client-side; Admin SDK on Cloud Run
- Auth: Firebase Auth client SDK; server verifies ID token per request (bearer)

**Standards**
- Strict TypeScript, `noImplicitAny`, `exactOptionalPropertyTypes`
- API contracts with Zod schemas (shared types `/packages/types`)
- Edge caching via Hosting + CDN; images via Next Image on Hosting

---

## 4) iOS App
**Stack**
- SwiftUI + async/await; Concurrency throughout
- Firebase (Auth, Firestore, Storage, Crashlytics, Performance) via SPM
- Architecture: MVVM + Coordinators; environment-scoped `Session` store
- Secure storage: Keychain for any auxiliary tokens (Firebase handles refresh)

**Minimums**
- Unit tests for view models; UI tests for auth/onboarding
- Feature flags via Remote Config

---

## 5) Backend/API (Cloud Run + Functions v2)
**Cloud Run service (`api`):**
- Framework: Fastify or NestJS (TypeScript). **Default: Fastify + Zod (lean, fast).**
- Middleware:
  - Auth: Verify Firebase ID token (audience, issuer, exp).
  - Request validation via Zod; structured JSON logging.
- Responsibilities: privileged reads/writes, role checks, batch/aggregate ops, webhooks.

**Event handlers (Functions v2):**
- Triggers: `onAuth.user().onCreate`, Firestore document create/update, Storage object finalize.
- Only lightweight logic; heavy work → Pub/Sub → Cloud Run worker.

---

## 6) Data Model & Access
- **Firestore rules:** deny-by-default; role-based fields (`roles.{uid}: true`) at org/tenant/doc level.
- **Indexes:** pre-create composite indexes for hot queries; document size < 1MB; avoid deeply nested arrays.
- **Aggregations:** counter/summary docs written by Cloud Run to reduce read-amplification.
- **BigQuery:** enable daily export; create `derived_*` tables for analytics.

---

## 7) Auth & Identity
- Providers: Email-link (passwordless), Apple, Google.
- **MFA** required for admin/staff.
- **Blocking functions**: domain allowlist/tenant checks, risk gating.
- **Session:** client receives Firebase ID token; backend re-checks on each call.
- **App Check** enforced for Firestore/Storage/Functions/Run.

---

## 8) Security, IG & Compliance Controls
- **IAM:** least privilege; separate deployer SA vs runtime SA; no broad `Editor`.
- **Secrets:** Secret Manager (API keys, third-party creds); no secrets in env files.
- **Audit:** Cloud Audit Logs (Admin/Data Access) retained ≥ 180 days (per policy).
- **Backups:** Firestore automated backups; Storage object versioning + lifecycle rules.
- **PII hygiene:** no PII in doc IDs or Storage paths; data minimization; TTLs for transient data.
- **DSAR support:** admin Cloud Run endpoint for export/delete by `userId`.
- **OWASP ASVS mapping:** apply authz checks server-side; input validation; rate limiting at Cloud Run.

---

## 9) Observability & Quality Gates
- **SLOs:**
  - p95 API latency < 300ms (in-region)
  - Error budget: 99.5% monthly availability
- **Alerts:** error ratio, 5xx spikes, cost anomalies, queue backlogs.
- **Crash & perf:** Crashlytics + Performance for clients; Sentry for web/API (optional).
- **Structured logs:** fields: `ts, level, service, route, userId, requestId`.

---

## 10) Cost Guardrails
- Firestore: design to ≤ 5 reads/user action avg; paginate (limit 20/50); avoid chatty listeners.
- Cloud Run: `minInstances: 0` (dev/stg), `1` (prod); set `maxInstances` per service.
- Budgets + alerts per project; daily spend report to Slack/email.

---

## 11) Repos & Monorepo Layout
```
/apps
  /web            # Next.js app
  /ios            # Xcode project
  /api            # Cloud Run (Fastify/NestJS)
  /workers        # Cloud Run worker(s)
/packages
  /types          # Shared Zod schemas & TS types
  /eslint-config  # Shared lint rules
/infrastructure
  /terraform      # Projects, secrets, run svcs, schedulers
/firebase         # firestore.rules, storage.rules, indexes
```

---

## 12) CI/CD (GitHub Actions skeletons)
**Quality on every PR:**
- Lint (web/api/workers), type-check, unit tests, iOS build (no signing)
- Firebase Emulator tests for Security Rules

**Deploy on `main` and tags:**
- Push to `main` → dev deploy
- Release tags `v*` → stg; manual approve → prod

Notes: Use **Workload Identity Federation** (no JSON keys). Deploy web via Firebase Hosting channels; deploy Cloud Run with `gcloud run deploy`.

---

## 13) Initial Dependencies (lock for scaffold)
**Web (`apps/web`)**
```json
{
  "dependencies": {
    "next": "latest",
    "react": "^18",
    "react-dom": "^18",
    "firebase": "^10",
    "zod": "^3",
    "class-variance-authority": "^0.7",
    "@radix-ui/react-dialog": "latest",
    "tailwindcss": "latest"
  },
  "devDependencies": {
    "typescript": "^5",
    "eslint": "^9",
    "@typescript-eslint/eslint-plugin": "latest",
    "@typescript-eslint/parser": "latest",
    "prettier": "latest",
    "vitest": "latest",
    "@testing-library/react": "latest"
  }
}
```

**API (`apps/api`)**
```json
{
  "dependencies": {
    "fastify": "latest",
    "@fastify/cors": "latest",
    "firebase-admin": "^12",
    "zod": "^3",
    "pino": "latest"
  },
  "devDependencies": {
    "typescript": "^5",
    "ts-node": "latest",
    "eslint": "^9",
    "vitest": "latest"
  }
}
```

---

## 14) Security Rules (starter posture)
**Firestore (`/firebase/firestore.rules`)**
```
// Deny by default
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    function isSignedIn() { return request.auth != null; }
    function isSelf(uid) { return isSignedIn() && request.auth.uid == uid; }

    match /users/{userId} {
      allow read, update: if isSelf(userId);
      allow create: if isSignedIn();
      allow delete: if false;
    }

    // Example: tenant-scoped collection with role map
    match /tenants/{tenantId}/{document=**} {
      function hasRole(role) {
        return isSignedIn() &&
          exists(/databases/$({database})/documents/tenants/$({tenantId})/roles/$({request.auth.uid})) &&
          get(/databases/$({database})/documents/tenants/$({tenantId})/roles/$({request.auth.uid})).data[role] == true;
      }
      allow read: if hasRole("reader");
      allow write: if hasRole("editor");
    }
  }
}
```

**Storage (`/firebase/storage.rules`)**
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /public/{allPaths=**} { allow read; allow write: if false; }
    match /user/{uid}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

---

## 15) Terraform (minimal to start)
- Projects: `dev/stg/prod` with billing + region policy
- Service APIs: enable Firestore, Run, Functions, Pub/Sub, Scheduler, Secret Manager
- Cloud Run services: `api`, `worker` with IAM invoker limited to Frontend & Functions
- Secrets: `FIREBASE_WEB_API_KEY`, third-party creds
- Budgets + alerts

---

## 16) Operational Playbooks (DOR/DOE)
- **Definition of Ready (per feature):**
  - Zod schema for inputs/outputs, Firestore indexes declared, security rule impact reviewed.
- **Definition of Done:**
  - Emulator tests pass (rules + API), e2e happy path, alerts in place, dashboards updated, runbooks updated.
- **Runbooks:** user deletion/DSAR, key rotation, incident triage, rollback.

---

## 17) Bootstrap Steps (for codegen to execute)
1. Create 3 Firebase/GCP projects: `appname-dev|stg|prod` in **europe-west2**.
2. Initialize Firestore (native), Storage, Hosting, Auth, App Check.
3. Scaffold monorepo (pnpm workspaces) with the directories above.
4. Add rules (`/firebase/*.rules`) + `firebaserc` with 3 targets.
5. Create Cloud Run `api` service (Node 20) with unauthenticated disabled; allow only Invoker SA + Hosting rewrite.
6. Set GitHub Actions with Workload Identity Federation; create deploy workflows for each env.
7. Enable BigQuery export for Firestore in prod.

---

## 18) Known Limits / When to step outside Firebase
- Heavy relational/reporting → mirror to BigQuery (already planned) or add Cloud SQL (Postgres) sidecar.
- Complex search → add Algolia/Meilisearch; store only doc IDs + public fields.
- Enterprise SSO/SAML per tenant → use Firebase Auth multi-tenant or proxy via Cloud Run.

---

*End of spec.*

