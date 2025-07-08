# Product Requirements Document (PRD)

> **Project Name**: Collectr  
> **Description**: A web app to manage, organize, and track a personal collection of physical video games across platforms.

---

## 1. Overview

**Collectr** is a tool for gamers, collectors, and hobbyists to track and manage their physical game libraries. Users will be able to catalog games, mark ownership status, note condition, add metadata like release year, and optionally upload cover art.

The MVP will provide core CRUD functionality and basic browsing of the collection via a clean, performant web UI.

---

## 2. Goals & Success Metrics

### Goals

- Allow users to **create, read, update, and delete** game entries.
- Support **searching, filtering, and sorting** by platform, title, and ownership status.
- Enable users to optionally **upload cover art** per game.
- Provide a clean, fast, responsive UX built on **React** and managed via **NX** for future scalability.

### Success Metrics

- ✅ MVP functional requirements met
- 🧪 Internal collection size > 100 games without performance issues
- 📈 App loads under 1s on modern browsers (Lighthouse score > 90)
- 🧠 Developer productivity and testability proven via modular NX structure

---

## 3. Non-Goals / Out of Scope

- User authentication / accounts (MVP will use local storage or static data)
- Cloud sync or cross-device access
- Mobile-native apps (PWA may be considered in later phase)
- Barcode scanning or image recognition
- Public sharing / social features
- Metadata auto-fetch from external APIs (e.g., IGDB, GiantBomb)

---

## 4. Requirements
### Functional Requirements

| Issue # | Title                      | Description                                                                  | Labels                          | Phase |
|--------:|----------------------------|------------------------------------------------------------------------------|---------------------------------|-------|
| #101    | Create Game Entry          | Allow adding a new game to the collection with fields: title, platform, etc. | feature, frontend, crud         | MVP   |
| #102    | View Collection List       | Display all games in a list/grid view with key metadata shown                | feature, frontend, ux           | MVP   |
| #103    | Edit/Delete Game Entry     | Edit or remove a game from the collection                                    | feature, frontend, crud         | MVP   |
| #104    | Filter and Search          | Filter by platform, search by title, and sort by date/title                  | feature, frontend, search       | MVP   |
| #105    | Upload Cover Art           | Optionally upload an image per game for display in the collection            | feature, frontend, media        | MVP   |
| #106    | Save Data to Local Storage | Store the collection in the browser using local storage                      | feature, frontend, persistence  | MVP   |
| #107    | NX Project Setup           | Scaffold project using NX workspace with apps/libs separation                | setup, devtools, nx             | MVP   |
| #108    | Hosting set up             | Project to be set up to be hosted in Firebase                                | setup, devtools, server, hosting| MVP   |

### Non-Functional Requirements

1. **Security & Compliance**  
   - No PII; IG/GDPR not applicable in MVP.  
2. **Performance**  
   - Fast load and runtime performance via code-splitting and optimized asset delivery.  
3. **Scalability**  
   - Modular architecture via NX to support future expansions (e.g., API integrations, Auth)

---

## 5. Risks & Mitigations

| Risk                                          | Mitigation                                                                 |
|-----------------------------------------------|---------------------------------------------------------------------------|
| Browser storage limits for large collections | Warn users when approaching limits; provide export option in later phase |
| File upload size/corruption                  | Validate and preview uploaded files; limit to 2MB                         |
| NX complexity outweighs benefits for MVP     | Keep initial app/lib structure minimal and focused                        |
| Future cloud migration may require refactoring | Use clean interfaces and services from the start                          |

---
