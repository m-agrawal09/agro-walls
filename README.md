# Reconnect Network (Agro-Walls)
### Mission-Critical Disaster Missing Person Reunification & Command Intelligence System

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media%20Pipeline-3448C5?style=flat&logo=cloudinary&logoColor=white)](https://cloudinary.com)
[![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.org)

**Reconnect Network** is an enterprise-grade disaster management and humanitarian reunification platform built for emergency dispatchers, first responders (NDRF/SDRF), field relief camps, hospitals, and affected families during catastrophic disasters (e.g. riverine floods, surges, and seismic events).

The system continuously aggregates fragmented missing person reports, shelter intake rosters, hospital casualty registers, and crowdsourced citizen sightings into a unified, verified operational ledger.

---

## 🌟 Key Features & Functional Modules

### 1. 📊 Situational Operations Command Dashboard (`/overview`)
- **Real-Time KPIs**: Live tracking of total incident intakes, verified reunifications, critical priority queues, and SLA compliance.
- **Verification Queue Telemetry**: At-a-glance status of cases awaiting dispatcher review.
- **Live Activity Ledger**: Real-time event feed of report intakes, field rescues, and verified matches.
- **Source Health Grid**: Health and ingest latency monitoring across hospital FHIR relays, shelter rosters, and field drone sensors.

### 2. 📁 Live Case Registry (`/cases`)
- **Full-Text Ingestion Search**: Instant search by Name, Aliases, Case ID, Last Known Location, Sector, or Physical Marks.
- **Operational Triage Filters**: Filter by `Critical (<24h)`, `High Priority`, `Unaccompanied Minors`, `Awaiting Verification`, or `Verified`.
- **Direct Dossier Access**: Click through any record to inspect the complete operational dossier docket.

### 3. 📄 Comprehensive Case Dossier (`/cases/:id`)
- **Biometric & Physical Docket**: Age, gender, height, build, complexion, scars/birthmarks, and clothing recorded at displacement.
- **Cloudinary Image Integration**: Renders verified reference portraits or field photos dynamically.
- **Candidate Matches Grid**: Algorithmic candidate cards showing confidence score, holding facility, distance, and key correlation evidence.
- **Chronological Timeline**: Step-by-step audit record from initial intake to field rescue and physical confirmation.
- **Cryptographic Audit Log**: Tamper-evident SHA-256 hash tracking for every action taken on the record.

### 4. 📝 Emergency Intake Wizard (`/report/new`)
- **Standardized FEMA-EDXL Schema**: Captures biometric markers, last known GPS coordinates, clothing descriptions, and family contact information.
- **Direct Cloudinary Photo Upload**: Native file drag-and-drop supporting JPEG/PNG with automatic Cloudinary CDN hosting and database binding.
- **Instant Database Ingestion**: Automatically creates records in both `Report` and `Case` collections in MongoDB Atlas.

### 5. 🧠 Match Intelligence Engine (`/match-intel`, `/match-intel/:id`)
- **Multi-Vector Correlation**: Algorithmic cross-referencing of facial biometrics, demographic overlap, clothing consistency, and geospatial distance.
- **Side-by-Side Comparison Workspace**: Compares missing person intake profiles against unidentified individuals admitted at medical centers and shelters.
- **Human-in-the-Loop Protocol**: Requires authorized dispatcher verification before triggering family liaison contacts.

### 6. ✅ Verification Queue (`/verification`)
- **Dispatcher Review Station**: Secondary review triage protecting families against false positive confirmations.
- **One-Click Actions**: Sworn verification, rejection with reasoning, request for field photo, or supervisory escalation.

### 7. 🔀 Entity Disambiguation & Duplicate Resolution (`/duplicates`)
- **Non-Destructive Clustering**: Resolves duplicate queries filed across multiple hotlines and field desks into a single canonical master record without deleting source data.
- **Comparative Attribute Matrix**: Side-by-side reconciliation of phonetic spelling variants (e.g. "Agrawal" vs "Agarwal") and witness discrepancies.

### 8. 🤝 Crowdsourced Community Tips (`/community-reports`)
- **Public Citizen Intake**: Enables volunteers and citizens to submit photos and location sightings from smartphones.
- **Dispatcher Review Pipeline**: Triage tabs (`New Submissions`, `Under Review`, `Accepted`, `Rejected`, `Potential Duplicate`).

### 9. 🏡 Public Family Status Portal (`/status`, `/status/:id`)
- **Calm, Low-Bandwidth Interface**: Dedicated portal for anxious relatives to check real-time search progress using their Case ID.
- **Transparent 6-Stage Progress Tracker**: Reassures families at every stage from intake to cross-facility indexing, human verification, and reunion.

### 10. 📈 Disaster Analytics & Sector Velocity (`/analytics`)
- **Geospatial Sector Density**: Resolution velocity across flood sectors (Riverfront, Basin, Lowlands, Outflows).
- **Vulnerability Cohorts**: Breakdown for vulnerable demographics (Unaccompanied Minors, Elderly 60+, Adult Cohorts).

### 11. 🛡️ Tamper-Evident Audit Trail (`/audit`)
- Immutable blockchain-inspired ledger where every priority elevation, photo upload, record merge, and verification commits a SHA-256 cryptographic block with operator signature.

### 12. 🔐 Privacy & Role-Based Access Control (`/privacy`)
- Multi-agency clearance matrix (Control Room, Verifier, Hospital, Shelter, Public) enforcing CJIS/HIPAA compliant PII and minor redaction.

---

## 🛠️ Architecture & Tech Stack

```
 agro-walls/
 ├── server/                   # Express Backend & MongoDB API
 │   ├── config/               # Database (Mongoose) & Cloudinary SDK setup
 │   ├── models/               # Case, Report, Match, Verification, AuditLog, SourceFeed
 │   ├── routes/               # REST API route handlers
 │   ├── scripts/              # Automated database seeder (seed.ts)
 │   └── index.ts              # Express server entrypoint (Port 5001)
 ├── src/                      # React Frontend SPA
 │   ├── components/           # AppShell, Navigation, Badges, Presentation Bar
 │   ├── context/              # CaseContext (Syncs with MongoDB API)
 │   ├── pages/                # 14 operational and public-facing pages
 │   ├── services/             # Centralized REST API client (api.ts)
 │   ├── styles/               # Bespoke Vanilla CSS Design System
 │   └── App.tsx               # Client-side router configuration
 ├── package.json              # Unified dependencies and operational scripts
 └── vite.config.ts            # Vite config with backend API reverse proxy
```

### Technology Highlights:
- **Frontend**: React 18, TypeScript, Vite, React Router DOM 6, Lucide Icons, Custom High-Contrast Design System.
- **Backend**: Node.js, Express, TypeScript, Multer, Cloudinary SDK.
- **Database**: MongoDB Atlas with Mongoose ODM.
- **Cloud Media**: Cloudinary API for resilient photo uploads and CDN delivery.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or later
- **npm**: v9.0.0 or later
- **MongoDB Atlas** account (or local MongoDB instance)
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
Create a `.env` file in the root directory (or use the configured Atlas cluster):
```env
PORT=5001
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.pdqrenn.mongodb.net/reconnect_network?retryWrites=true&w=majority&appName=Cluster0
CLOUDINARY_CLOUD_NAME=dsy2ygl9h
CLOUDINARY_API_KEY=474483762314945
CLOUDINARY_API_SECRET=l69YpXxIgQB1Wctdi8RUU1Q10p0
```

### 4. Seed the Database with Realistic Disaster Data
Populate MongoDB Atlas with realistic missing person cases, verification queue items, matches, and audit logs:
```bash
npm run seed
```

### 5. Run the Application Locally

You can run the backend and frontend simultaneously:

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
| `/api/cases` | `GET` | Search and filter cases (supports query params: `search`, `priority`, `status`, `isMinor`) |
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
Preview the production build locally:
```bash
npm run preview
```

---

## 🔒 Data Protection & Ethics
- **Zero Data Loss on Merge**: Duplicate resolutions maintain all original case numbers and field sightings as immutable linked references.
- **Minor Child Privacy**: Children under 18 have PII automatically masked from public feeds in compliance with child protection guidelines.
- **Auditable Accountability**: Every administrative change leaves a cryptographic footprint for post-incident review.

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).