# Reconnect Network (Agro-Walls)
### Mission-Critical Disaster Missing Person Reunification, AI Intake & Incident Command System

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Google Gemini AI](https://img.shields.io/badge/Google%20Gemini-NLP%20Intake-8E75B2?style=flat&logo=google&logoColor=white)](https://ai.google.dev)
[![Leaflet GIS](https://img.shields.io/badge/Leaflet-GIS%20Mapping-199900?style=flat&logo=leaflet&logoColor=white)](https://leafletjs.com)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media%20Pipeline-3448C5?style=flat&logo=cloudinary&logoColor=white)](https://cloudinary.com)
[![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.org)

**Reconnect Network** is an enterprise-grade humanitarian reunification, geospatial incident tracking, and disaster response platform built for emergency dispatchers, first responders (NDRF / SDRF), relief camp volunteers, hospital triage units, and displaced families during catastrophic crisis events (such as riverine floods, surges, and seismic disasters).

The system continuously aggregates fragmented missing person reports, shelter intake rosters, hospital casualty registers, and crowdsourced citizen sightings into a verified, unified operational ledger.

---

## 🌟 Key Features & Functional Modules

### 1. 🗺️ Rajasthan & National Incident Map (`/incident-map`)
- **State Administrative Border Highlighting**: Prominently illuminates Rajasthan borders with dynamic blue/cyan luminescence while subtly dimming national peripheral zones.
- **100% Free & Open GIS Layers**: Uses Leaflet with OpenStreetMap Standard, Carto Dark Matter, and Esri World Imagery (zero watermarks, no external API keys required).
- **Comprehensive City Clusters**: Powered by `all-indian-cities.json` spanning all 35 Rajasthan district hubs and 528 Indian national cities.
- **Dynamic Live Database Synchronization**: Real-time aggregation of MongoDB case records into district cluster discs with count badges, pulsing alert halos, and interactive dossier popups.
- **Tactical Navigation Controls**: Instant `RJ` (Center on Rajasthan), `IN` (View All India), zoom controls, priority filters (`CRITICAL`, `HIGH`, `ROUTINE`), and instant search with one-click clear.

### 2. 🎙️ AI Voice & Multilingual NLP Intake Assistant (`/report/new`)
- **Powered by Google Gemini Bilingual Models**: Empathetic conversational intake assistant supporting Hindi (हिन्दी), English, and Hinglish.
- **Native Speech-to-Text & Text-to-Speech**: Hands-free field reporting via Web Speech API (`SpeechRecognition` & `SpeechSynthesis`) for volunteers in distress zones.
- **Automated Slot-Filling**: Dynamically extracts Subject Name, Last Known Location, Age, Gender, Distinctive Clothing, and Reporter Contact Phone through natural back-and-forth dialogue.
- **Category Quick Starters**: Direct intent triggers for Missing Person reports, Found/Rescued individuals, and Hospital admissions without submitting predefined dummy data.
- **One-Click MongoDB Ingestion**: Directly validates and registers the conversational intake dossier into MongoDB Atlas without requiring manual form entry.

### 3. 🕸️ Physics-Enabled Dynamic Connection Graph (`/connection-graph`)
- **Interactive Force-Directed Network**: D3/HTML5 Canvas graph topology modeling relationships between missing persons, candidate matches, and operational disaster sectors.
- **Dynamic Database Binding**: Automatically builds edges and nodes from active cases, shared relief camp sectors, and correlation match confidence scores.
- **Selective Focus & Isolation**: Clicking any node isolates its immediate network while smoothly fading unrelated nodes and connections for clarity.
- **Simulation Controls**: Real-time physics toggles, velocity damping, zoom/pan navigation, and direct case dossier navigation.

### 4. 📊 Situational Operations Command Dashboard (`/overview`)
- **Real-Time KPIs**: Live tracking of total incident intakes, verified reunifications, critical priority queues, and correlation rates.
- **Automated SitRep Export**: Generates and downloads structured Markdown Operational Situation Reports (`SITREP_*.md`) detailing field metrics and queue depth.
- **Verification Telemetry**: Real-time queue monitoring with one-click navigation to pending review dockets.
- **Live Activity Ledger**: Real-time tamper-evident event feed of intakes, field rescues, and verified matches.

### 5. 📁 Live Case Registry (`/cases`)
- **Full-Text Ingestion Search**: Instant search by Name, Aliases, Case ID, Last Known Location, Sector, or Physical Marks with URL parameter synchronization (`?search=...`).
- **Operational Triage Filters**: Filter by `Critical (<24h)`, `High Priority`, `Unaccompanied Minors`, `Awaiting Verification`, or `Verified`.
- **Direct Dossier Access**: Click through any record to inspect the complete operational dossier docket.

### 6. 📄 Comprehensive Case Dossier (`/cases/:id`)
- **Biometric & Physical Docket**: Age, gender, height, build, complexion, scars/birthmarks, and clothing recorded at displacement.
- **Cloudinary Image Integration**: Renders verified reference portraits or field photos dynamically.
- **Candidate Matches Grid**: Algorithmic candidate cards showing confidence score, holding facility, distance, and key correlation evidence.
- **Cryptographic Audit Log**: Tamper-evident SHA-256 hash tracking for every action taken on the record.

### 7. 🧠 Match Intelligence Engine (`/match-intel`, `/match-intel/:id`)
- **Multi-Vector Correlation**: Algorithmic cross-referencing of facial biometrics, demographic overlap, clothing consistency, and geospatial proximity.
- **Side-by-Side Comparison Workspace**: Compares missing person intake profiles against unidentified individuals admitted at medical centers and shelters.
- **Human-in-the-Loop Protocol**: Requires authorized dispatcher verification before triggering family liaison contacts.

### 8. ✅ Verification Queue (`/verification`)
- **Dispatcher Review Station**: Secondary review triage protecting families against false positive confirmations.
- **One-Click Actions**: Sworn verification, rejection with reasoning, request for field photo, or supervisory escalation.

### 9. 🔀 Entity Disambiguation & Duplicate Resolution (`/duplicates`)
- **Non-Destructive Clustering**: Resolves duplicate queries filed across multiple hotlines and field desks into a single canonical master record without deleting source data.
- **Comparative Attribute Matrix**: Side-by-side reconciliation of phonetic spelling variants (e.g. "Agrawal" vs "Agarwal") and witness discrepancies.

### 10. 🤝 Crowdsourced Community Tips (`/community-reports`)
- **Public Citizen Intake**: Enables volunteers and citizens to submit photos and location sightings from smartphones.
- **Dispatcher Review Pipeline**: Triage tabs (`New Submissions`, `Under Review`, `Accepted`, `Rejected`, `Potential Duplicate`).

### 11. 🏡 Public Family Status Portal (`/status`, `/status/:id`)
- **Calm, Low-Bandwidth Interface**: Dedicated portal for anxious relatives to check real-time search progress using their Case ID.
- **Transparent 6-Stage Progress Tracker**: Reassures families at every stage from intake to cross-facility indexing, human verification, and reunion.

### 12. 📈 Disaster Analytics & Sector Velocity (`/analytics`)
- **Geospatial Sector Density**: Resolution velocity across flood sectors (Riverfront, Basin, Lowlands, Outflows).
- **Vulnerability Cohorts**: Breakdown for vulnerable demographics (Unaccompanied Minors, Elderly 60+, Adult Cohorts).
- **Printable Executive Brief**: Direct print and PDF generation of situational telemetry.

### 13. 🛡️ Tamper-Evident Audit Trail (`/audit`)
- Immutable blockchain-inspired ledger where every priority elevation, photo upload, record merge, and verification commits a SHA-256 cryptographic block with operator signature.

### 14. 🔐 Privacy & Role-Based Access Control (`/privacy`)
- Multi-agency clearance matrix (Control Room, Verifier, Hospital, Shelter, Public) enforcing CJIS/HIPAA compliant PII and minor redaction.

### 15. 📦 13 Integrated Operational Section Modules
Full interactive views with real CSV telemetry export and CAD synchronization:
- Medical & Triage Registry (`/medical-triage`)
- Field Response Logistics (`/field-units`)
- Emergency Shelter Network (`/shelters`)
- Forensic Identification (`/forensics`)
- Volunteer Coordination (`/volunteers`)
- Helpline Audio Transcripts (`/helpline-transcripts`)
- Transport Corridors (`/transport`)
- Supply Chain & Relief Depot (`/supply-chain`)
- Government Agency Interop (`/agency-interop`)
- Missing Children & Minors (`/minors`)
- Unidentified Remains (`/unidentified`)
- Community Hotline Feed (`/hotline`)
- Field Ingestion Desk (`/intake-queue`)

---

## 🛠️ Architecture & Tech Stack

```
 agro-walls/
 ├── server/                   # Express Backend & MongoDB API
 │   ├── config/               # Database (Mongoose) & Cloudinary SDK setup
 │   ├── models/               # Case, Report, Match, Verification, AuditLog, SourceFeed
 │   ├── routes/               # Case, Report, Chatbot (Gemini), Verification, Audit routes
 │   ├── scripts/              # Automated database seeder (seed.ts)
 │   └── index.ts              # Express server entrypoint (Port 5001)
 ├── src/                      # React Frontend SPA
 │   ├── components/           # Chatbot (NLP), Map, AppShell, Navigation, Badges
 │   ├── context/              # CaseContext (Syncs with MongoDB API)
 │   ├── pages/                # 17 operational, map, graph, and public pages
 │   ├── services/             # Centralized REST API client (api.ts)
 │   ├── styles/               # Bespoke High-Contrast Vanilla CSS Design System
 │   └── App.tsx               # Client-side router configuration
 ├── public/                   # Static assets & all-indian-cities.json
 ├── package.json              # Unified dependencies and operational scripts
 └── vite.config.ts            # Vite config with backend API reverse proxy
```

### Technology Highlights:
- **Frontend**: React 18, TypeScript, Vite, React Router DOM 6, Leaflet GIS, D3 Force, Lucide Icons.
- **AI & NLP**: Google Gemini 3.5 / 2.5 Flash API for bilingual Hindi/English/Hinglish entity extraction.
- **Backend**: Node.js, Express, TypeScript, Multer, Cloudinary SDK.
- **Database**: MongoDB Atlas with Mongoose ODM.
- **Cloud Media**: Cloudinary API for resilient photo uploads and CDN delivery.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or later
- **npm**: v9.0.0 or later
- **MongoDB Atlas** account (or local MongoDB instance)
- **Google Gemini API Key** (for NLP Voice & Text Chatbot)
- **Cloudinary** account (for media storage)

### 1. Clone the Repository
```bash
git clone https://github.com/m-agrawal09/agro-walls.git
cd agro-walls
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
PORT=5001
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.pdqrenn.mongodb.net/reconnect_network?retryWrites=true&w=majority&appName=Cluster0
CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>
GEMINI_API_KEY=<your_gemini_api_key>
```

### 4. Seed the Database
Populate MongoDB Atlas with realistic missing person cases, verification queue items, matches, and audit logs:
```bash
npm run seed
```

### 5. Run the Application Locally

Run backend and frontend concurrently:

**Terminal 1 — Backend Server (Port 5001):**
```bash
npm run server
```

**Terminal 2 — Vite Frontend (Port 5173):**
```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:5173
```
*(The frontend automatically proxies `/api` requests to `http://localhost:5001`)*.

---

## 📡 API Reference

| Endpoint | Method | Description |
| :--- | :---: | :--- |
| `/api/health` | `GET` | Health check & MongoDB connection status |
| `/api/chat/intake` | `POST` | Gemini NLP conversation triage & slot-filling (Hindi / English / Hinglish) |
| `/api/chat/submit-report` | `POST` | One-click direct ingestion of AI-extracted case dossier into MongoDB |
| `/api/cases` | `GET` | Search and filter cases (`?search=...`, `?priority=...`, `?status=...`, `?isMinor=...`) |
| `/api/cases/:id` | `GET` | Retrieve complete dossier for a single case by Case ID |
| `/api/cases` | `POST` | Create a new missing person case record |
| `/api/cases/:id/verify` | `PATCH` | Sworn verification of a case match candidate |
| `/api/cases/:id/reject` | `PATCH` | Record rejection of candidate correlation |
| `/api/cases/:id/merge` | `PATCH` | Non-destructive duplicate record consolidation |
| `/api/cases/:id/priority` | `PATCH` | Escalate or update case priority (`CRITICAL`, `HIGH`, `ROUTINE`) |
| `/api/upload` | `POST` | Upload photo to Cloudinary CDN (multipart/form-data) |
| `/api/matches` | `GET` | Fetch algorithmic candidate matches (optional `?caseId=...`) |
| `/api/matches/:id/verify`| `POST` | Confirm match candidate and update parent case |
| `/api/verifications` | `GET` | Fetch items currently in verification queue |
| `/api/verifications/:id` | `PATCH` | Update verification status and notes |
| `/api/community-reports`| `GET` | Fetch citizen tips (filter by `?tab=...`) |
| `/api/community-reports`| `POST`| Submit new citizen sighting or tip |
| `/api/audit` | `GET` | Fetch cryptographic ledger audit blocks (`?limit=50`) |
| `/api/stats/kpi` | `GET` | Summary statistics and disaster situation metrics |
| `/api/stats/sources` | `GET` | Ingest feed latency and data pipeline health |

---

## 🧪 Production Build & Validation
To compile TypeScript and create an optimized production bundle:
```bash
npm run build
```
Preview the production bundle:
```bash
npm run preview
```

---

## 🔒 Data Protection & Ethics
- **Zero Data Loss on Merge**: Duplicate resolutions maintain all original case numbers and field sightings as immutable linked references.
- **Minor Child Privacy**: Children under 18 have PII automatically masked from public feeds in compliance with child protection guidelines.
- **Auditable Accountability**: Every administrative change leaves a cryptographic SHA-256 footprint for post-incident review.

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).