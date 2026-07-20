# Graph Report - .  (2026-07-11)

## Corpus Check
- 84 files · ~212,099 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 263 nodes · 290 edges · 39 communities (16 shown, 23 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.9)
- Token cost: 62,428 input · 5,523 output

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

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `scripts` - 7 edges
3. `createAdminClient()` - 7 edges
4. `ScannerClient()` - 6 edges
5. `SectionHeading()` - 5 edges
6. `useMusicContext()` - 5 edges
7. `createClient()` - 5 edges
8. `include` - 5 edges
9. `AdminClient()` - 4 edges
10. `InvitationClient()` - 4 edges

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
  src/app/api/rsvp/route.ts → src/lib/supabase/server.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Supabase Client Architecture** — src_lib_supabase_server, src_lib_supabase_client, src_app_api_checkin_route, src_app_api_rsvp_route [EXTRACTED 0.90]
- **Landing Page Content Flow** — src_app_page, src_data_landingcontent, src_components_landing_photogallery, src_components_landing_familymessages [EXTRACTED 0.95]
- **Quinceañera Celebration for Tammy** — tammy_entity, public_photos_inicio_1, graphify_out_transcripts_mi_princesa_lyrics, graphify_out_transcripts_vid_20210407_wa0013_transcript [EXTRACTED 0.95]
- **Tammy's Life Stages Gallery** — public_photos_4, public_photos_5, public_photos_6, public_photos_7, public_photos_9, public_photos_inicio_1 [INFERRED 0.90]

## Communities (39 total, 23 thin omitted)

### Community 0 - "Landing UI Components"
Cohesion: 0.08
Nodes (20): Tammy Portrait (Toddler), Tammy with Name Blocks, Button(), ButtonProps, IconButton(), IconButtonProps, CountdownSection(), getTimeLeft() (+12 more)

### Community 1 - "Landing Page & Hero"
Cohesion: 0.11
Nodes (11): FloatingIcons(), Icon, fadeSub, medallion, Sparkle, stagger, wordSlide, NAV_LINKS (+3 more)

### Community 2 - "Dev Tooling Dependencies"
Cohesion: 0.10
Nodes (21): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, postcss, tailwindcss, @tailwindcss/postcss (+13 more)

### Community 3 - "TypeScript Compiler Config"
Cohesion: 0.10
Nodes (21): dom, dom.iterable, esnext, ./src/*, compilerOptions, allowJs, esModuleInterop, incremental (+13 more)

### Community 4 - "Runtime Deps & QR API"
Cohesion: 0.10
Nodes (18): framer-motion, html5-qrcode, next, dependencies, framer-motion, html5-qrcode, next, qrcode (+10 more)

### Community 5 - "Supabase Server Routes & Auth"
Cohesion: 0.19
Nodes (12): AdminPage(), Guest, metadata, POST(), POST(), GET(), fetchGuest(), generateMetadata() (+4 more)

### Community 6 - "Layout & Music Player"
Cohesion: 0.14
Nodes (9): lato, metadata, playfair, FamilyMessages(), MusicPlayer(), MusicContext, MusicContextType, MusicProvider() (+1 more)

### Community 7 - "Admin & Login Clients"
Cohesion: 0.19
Nodes (7): AdminClient(), computeStats(), fmtTime(), GuestRow(), sortGuests(), metadata, createClient()

### Community 8 - "Invitation RSVP Client"
Cohesion: 0.21
Nodes (10): capitalize(), fade, getTimeLeft(), Guest, InvitationClient(), pad(), slideInOut, stagger (+2 more)

### Community 9 - "QR Scanner"
Cohesion: 0.23
Nodes (9): metadata, CamState, extractToken(), getQueue(), playBeep(), saveQueue(), ScannerClient(), ScanResult (+1 more)

### Community 10 - "NPM Scripts"
Cohesion: 0.18
Nodes (10): name, private, scripts, build, dev, lint, seed, seed:dry (+2 more)

### Community 11 - "Family Video/Photo Content"
Cohesion: 0.20
Nodes (10): Mi Princesa Lyrics, Birthday Greeting Transcript, Photo of children in school graduation or ceremony attire, Photo of a young girl holding a newborn baby, Portrait of a young girl in a turquoise hoodie, Photo of a young girl in a neon green soccer uniform, Photo of a young girl in a white traditional folk dress, Quinceañera portrait with 'Mis XV Años' text (+2 more)

### Community 12 - "TS Project References"
Cohesion: 0.25
Nodes (7): next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx, exclude, include

### Community 13 - "Guest Seed Script"
Cohesion: 0.25
Nodes (6): csvPath, envPath, GuestRow, isDryRun, rows, supabase

## Knowledge Gaps
- **125 isolated node(s):** `nextConfig`, `name`, `version`, `private`, `dev` (+120 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `Runtime Deps & QR API` to `NPM Scripts`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Dev Tooling Dependencies` to `NPM Scripts`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Why does `html5-qrcode` connect `Runtime Deps & QR API` to `QR Scanner`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Are the 7 inferred relationships involving `Tammy` (e.g. with `Mi Princesa Lyrics` and `Birthday Greeting Transcript`) actually correct?**
  _`Tammy` has 7 INFERRED edges - model-reasoned connections that need verification._
- **What connects `nextConfig`, `name`, `version` to the rest of the system?**
  _125 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Landing UI Components` be split into smaller, more focused modules?**
  _Cohesion score 0.0784313725490196 - nodes in this community are weakly interconnected._
- **Should `Landing Page & Hero` be split into smaller, more focused modules?**
  _Cohesion score 0.11255411255411256 - nodes in this community are weakly interconnected._