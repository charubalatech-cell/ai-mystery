Act as a Senior Full-Stack MERN Developer. Build a complete mystery game web application named "AI Mystery Room" based on the specification details provided below.

1. PROJECT OVERVIEW & ARCHITECTURE:
   - "AI Mystery Room" is an interactive forensic investigation platform.
   - User inputs a short story/scenario premise.
   - Backend calls OpenAI API to generate a mystery case with a hidden culprit, suspects, and forensic evidence.
   - Forensic evidence includes: encrypted chat logs, AI image prompts/CCTV captures, audio intercept transcripts/recordings, and document/autopsy logs.
   - User investigates evidence, evaluates suspect alibis/motives, and selects the culprit to solve the case.

2. TECH STACK:
   - Frontend: React.js (Vite), Tailwind CSS, Lucide-React icons, React Router DOM.
   - Backend: Node.js, Express.js.
   - Database: MongoDB with Mongoose ODM.
   - AI Integration: OpenAI API (GPT-4o / GPT-4o-mini) with structured JSON outputs.

3. UI/UX & DESIGN SYSTEM:
   - Dynamic Dark / Light mode toggle using React Context and localStorage persistence.
   - Dark Mode (Default): Deep Obsidian background (`#0B0F19`), slate card backgrounds (`#111827`), cyan (`#06B6D4`) and violet (`#8B5CF6`) radiant accent gradients, alert red (`#EF4444`) warning badges.
   - Light Mode: Cool slate white background (`#F8FAFC`), pure white card backgrounds (`#FFFFFF`), dark slate text (`#0F172A`), sky blue (`#0284C7`) and deep violet (`#7C3AED`) accents.

4. PAGE LAYOUTS & COMPONENTS TO IMPLEMENT:
   a) Landing / Dashboard (`/`):
      - Header bar with brand logo ("AI MYSTERY ROOM"), navigation items (Dashboard, Create Case, Investigation, Evidence Room, History), theme switcher, and profile status.
      - Hero section: Radiant gradient headline "Turn Your Story Into a Mystery", CTA buttons ("Create New Mystery", "Explore Demo Case"), and live telemetry metrics (Cases Generated, AI Coherence, Security Protocols).
      - Methodology section: 4-step workflow cards (1. Share Scenario, 2. AI Crafts Mystery, 3. Explore Evidence, 4. Find Culprit).
      - Case Catalog Grid: Theme selector cards (Homicide & Noir, Theft/Heist, Missing Person, Corporate Espionage, Supernatural).
      - Evidence Showcase Carousel: Interactive visual previews of chats, CCTV feeds, audio intercepts, and autopsy records.
   b) Case Creation Terminal (`/create`):
      - Input fields for Mystery Title (optional, max 80 chars) and Scenario Description (textarea, 30-2000 chars).
      - Category selector pills (Crime, Missing Person, Theft, Corporate, Supernatural).
      - Difficulty selector (Easy, Medium, Hard).
      - Suspect matrix count slider (3 to 6 suspects).
      - Atmospheric tone selector (Noir Suspense, Dark Thriller, Cosmic Horror, Classic Whodunit).
      - Sidebar telemetry preview panel with a primary "Synthesize Investigation Case" button.
   c) Active Investigation Briefing (`/investigation/:caseId`):
      - Status header: Case ID, Category, Difficulty, and Active status badge.
      - Incident Briefing & Reconstructed Timeline card (timestamped key events).
      - Evidence Matrix quick counts (WhatsApp Chats, CCTV Feeds, Audio Wiretaps, Documents, Crime Scene Photos).
      - Suspect Matrix grid: Cards displaying generated portraits, names, roles, alibis, motives, and an "Interrogate / Dossier" trigger.
      - Main CTAs: "Inspect Evidence Room" and "Submit Accusation".
   d) Evidence Room & Accusation Modal (`/evidence/:caseId`):
      - Multi-tab evidence viewer: Encrypted Chat Intercepts, CCTV Visual Snapshots, Audio Wiretaps (playback UI + transcript), and Forensic Documents.
      - Accusation Modal: Displays suspect profiles, allows the user to pick the culprit, validates the choice against the database, and displays the final case resolution (SOLVED or FAILED).

5. DATABASE SCHEMAS & API ENDPOINTS:
   - Mongoose `CaseSchema`:
     - `title`: String
     - `scenarioPrompt`: String
     - `category`: String (CRIME, MISSING_PERSON, THEFT, CORPORATE, SUPERNATURAL)
     - `difficulty`: String (EASY, MEDIUM, HARD)
     - `tone`: String
     - `briefing`: { location, timeOfIncident, summary, timeline: [{ time, event }] }
     - `suspects`: [{ id, name, role, alibi, motive, avatarUrl, isCulprit }]
     - `evidence`: [{ id, type (CHAT, IMAGE_CCTV, AUDIO, DOCUMENT), title, content, isClue }]
     - `status`: String (ACTIVE, SOLVED, FAILED)
   - API Routes:
     - `POST /api/cases/generate`: Accepts input scenario parameters, calls OpenAI API using a strict JSON response schema, creates case record in MongoDB, and returns generated case ID.
     - `GET /api/cases/:id`: Fetches case details (strips `isCulprit` boolean from the client response to prevent cheating).
     - `POST /api/cases/:id/accuse`: Accepts `{ suspectId }`, compares against true `isCulprit`, updates status to SOLVED or FAILED, and returns full solution breakdown.

Generate clean, modular, production-ready code for both frontend components and backend Express server routes.