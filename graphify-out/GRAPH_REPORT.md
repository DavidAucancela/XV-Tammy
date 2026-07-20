# Graph Report - XV-Tammy  (2026-07-19)

## Corpus Check
- 76 files · ~259,653 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 446 nodes · 516 edges · 56 communities (26 shown, 30 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.84)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1f068b97`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Landing UI Components
- Landing Page & Hero
- Dev Tooling Dependencies
- TypeScript Compiler Config
- Runtime Deps & QR API
- Supabase Server Routes & Auth
- Layout & Music Player
- Admin & Login Clients
- Invitation RSVP Client
- QR Scanner
- NPM Scripts
- Family Video/Photo Content
- TS Project References
- Guest Seed Script
- Apple Icon
- Favicon
- Middleware
- Next Config
- PostCSS Config
- Photo Asset
- Photo Asset
- Photo Asset
- Photo Asset
- Photo Asset
- Photo Asset (Halloween)
- Photo Asset
- Photo Asset (Beach)
- Photo Asset
- Photo Asset (Zoo)
- Photo Asset
- Photo Asset
- Photo Asset
- Photo Asset
- Photo Asset
- Photo Asset
- Photo Asset
- Photo Asset
- README
- AGENTS.md
- graphify reference: extra exports and benchmark
- graphify reference: query, path, explain
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- graphify
- extraction-spec.md
- Tammy Portrait (Toddler)
- Tammy with Name Blocks
- AdminClient.tsx
- optimize-photos.sh
- PhotoGallery.tsx

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `What You Must Do When Invoked` - 12 edges
3. `/graphify` - 10 edges
4. `XV Años — Tammy` - 10 edges
5. `createAdminClient()` - 9 edges
6. `graphify reference: extra exports and benchmark` - 8 edges
7. `scripts` - 7 edges
8. `makeBurst()` - 7 edges
9. `useMusicContext()` - 7 edges
10. `getEventDetails()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `ScannerClient()` --references--> `html5-qrcode`  [EXTRACTED]
  src/app/scan/ScannerClient.tsx → package.json
- `GET()` --references--> `qrcode`  [EXTRACTED]
  src/app/api/qr/route.ts → package.json
- `AdminPage()` --calls--> `createAdminClient()`  [EXTRACTED]
  src/app/admin/page.tsx → src/lib/supabase/server.ts
- `POST()` --calls--> `createAdminClient()`  [EXTRACTED]
  src/app/api/checkin/route.ts → src/lib/supabase/server.ts
- `POST()` --calls--> `createAdminClient()`  [EXTRACTED]
  src/app/api/invitacion/route.ts → src/lib/supabase/server.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Supabase Client Architecture** — src_lib_supabase_server, src_lib_supabase_client, src_app_api_checkin_route, src_app_api_rsvp_route [EXTRACTED 0.90]
- **Landing Page Content Flow** — src_app_page, src_data_landingcontent, src_components_landing_photogallery, src_components_landing_familymessages [EXTRACTED 0.95]
- **Quinceañera Celebration for Tammy** — tammy_entity, public_photos_inicio_1, graphify_out_transcripts_mi_princesa_lyrics, graphify_out_transcripts_vid_20210407_wa0013_transcript [EXTRACTED 0.95]
- **Tammy's Life Stages Gallery** — public_photos_4, public_photos_5, public_photos_6, public_photos_7, public_photos_9, public_photos_inicio_1 [INFERRED 0.90]

## Communities (56 total, 30 thin omitted)

### Community 0 - "Landing UI Components"
Cohesion: 0.10
Nodes (14): lato, metadata, playfair, FamilyMessages(), TextItem, VideoItem, MusicPlayer(), PageTransition() (+6 more)

### Community 1 - "Landing Page & Hero"
Cohesion: 0.07
Nodes (24): OpengraphImage(), size, Home(), Recuerdos(), Firefly, FloatingIcons(), Icon, NAV_LINKS (+16 more)

### Community 2 - "Dev Tooling Dependencies"
Cohesion: 0.10
Nodes (21): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, postcss, tailwindcss, @tailwindcss/postcss (+13 more)

### Community 3 - "TypeScript Compiler Config"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, ./src/*, **/*.ts (+20 more)

### Community 4 - "Runtime Deps & QR API"
Cohesion: 0.07
Nodes (28): framer-motion, html5-qrcode, next, dependencies, framer-motion, html5-qrcode, next, qrcode (+20 more)

### Community 5 - "Supabase Server Routes & Auth"
Cohesion: 0.17
Nodes (13): AdminPage(), Guest, metadata, POST(), POST(), POST(), GET(), fetchGuest() (+5 more)

### Community 6 - "Layout & Music Player"
Cohesion: 0.12
Nodes (13): bloomContainer, bloomItem, Bud(), CLUSTER, CornerFlorals(), LEAF, Piece, ROSE (+5 more)

### Community 7 - "Admin & Login Clients"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 8 - "Invitation RSVP Client"
Cohesion: 0.21
Nodes (10): capitalize(), fade, getTimeLeft(), Guest, InvitationClient(), pad(), slideInOut, stagger (+2 more)

### Community 9 - "QR Scanner"
Cohesion: 0.23
Nodes (9): metadata, CamState, extractToken(), getQueue(), playBeep(), saveQueue(), ScannerClient(), ScanResult (+1 more)

### Community 10 - "NPM Scripts"
Cohesion: 0.09
Nodes (25): ButterflyHue, ButterflyShape(), Flight, WING_FILLS, ButterflyGame(), CatchableFlight, HUES, makeFlight() (+17 more)

### Community 11 - "Family Video/Photo Content"
Cohesion: 0.20
Nodes (10): Mi Princesa Lyrics, Birthday Greeting Transcript, Photo of children in school graduation or ceremony attire, Photo of a young girl holding a newborn baby, Portrait of a young girl in a turquoise hoodie, Photo of a young girl in a neon green soccer uniform, Photo of a young girl in a white traditional folk dress, Quinceañera portrait with 'Mis XV Años' text (+2 more)

### Community 12 - "TS Project References"
Cohesion: 0.14
Nodes (13): 1. Variables de entorno, 2. Schema de Supabase, 3. Instalar y correr, Deploy en Railway, Diseño visual, Estructura del proyecto, Personalizar contenido, Rutas (+5 more)

### Community 13 - "Guest Seed Script"
Cohesion: 0.25
Nodes (6): csvPath, envPath, GuestRow, isDryRun, rows, supabase

### Community 38 - "README"
Cohesion: 0.17
Nodes (10): Architecture, Color palette (Editorial champagne aesthetic), Commands, Environment variables, graphify, Key dependencies, Key features, Project (+2 more)

### Community 39 - "AGENTS.md"
Cohesion: 0.15
Nodes (11): Animaciones y componentes decorativos, Clientes Supabase, Comandos, Contenido editable, Contexto de música, Dev server, graphify, Imports (+3 more)

### Community 40 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 41 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 42 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 43 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 44 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 53 - "AdminClient.tsx"
Cohesion: 0.19
Nodes (7): AdminClient(), computeStats(), fmtTime(), GuestRow(), sortGuests(), metadata, createClient()

### Community 55 - "PhotoGallery.tsx"
Cohesion: 0.13
Nodes (12): Button(), ButtonProps, IconButton(), IconButtonProps, icons, Venue, GalleryGroup, PLACEHOLDER_GRADIENTS (+4 more)

## Knowledge Gaps
- **219 isolated node(s):** `nextConfig`, `name`, `version`, `private`, `dev` (+214 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **30 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Dev Tooling Dependencies` to `Runtime Deps & QR API`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **What connects `nextConfig`, `name`, `version` to the rest of the system?**
  _219 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Landing UI Components` be split into smaller, more focused modules?**
  _Cohesion score 0.09538461538461539 - nodes in this community are weakly interconnected._
- **Should `Landing Page & Hero` be split into smaller, more focused modules?**
  _Cohesion score 0.07308970099667775 - nodes in this community are weakly interconnected._
- **Should `Dev Tooling Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `TypeScript Compiler Config` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `Runtime Deps & QR API` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._