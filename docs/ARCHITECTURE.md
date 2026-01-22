# Flash-n-Frame Architecture

## Overview

Flash-n-Frame is a visual intelligence platform built with React and TypeScript. It transforms various content sources (GitHub repositories, articles, designs) into professional infographics using AI.

---

## System Architecture Diagram

```
+------------------------------------------+
|              Frontend (React)             |
+------------------------------------------+
|  App.tsx (Router + Lazy Loading)         |
|  +------------------------------------+  |
|  |  Contexts                          |  |
|  |  - ThemeContext (dark/light/solar) |  |
|  |  - ProjectContext (state mgmt)     |  |
|  |  - UserSettingsContext (API keys)  |  |
|  +------------------------------------+  |
|  +------------------------------------+  |
|  |  Views                             |  |
|  |  - Home                            |  |
|  |  - RepoAnalyzer (GitFlow)          |  |
|  |  - ArticleToInfographic (SiteSketch)|  |
|  |  - ImageEditor (Reality Engine)    |  |
|  |  - DevStudio                       |  |
|  +------------------------------------+  |
+------------------------------------------+
           |              |
           v              v
+------------------+  +------------------+
|  Services        |  |  External APIs   |
+------------------+  +------------------+
| geminiService    |  | Google Gemini AI |
| githubService    |  | GitHub REST API  |
| persistence      |  | IndexedDB        |
| omniAiService    |  +------------------+
| templateService  |
+------------------+
           |
           v
+------------------+
|  Data Layer      |
+------------------+
| IndexedDB        |
| (History, Tasks) |
| localStorage     |
| (API Keys)       |
| PostgreSQL       |
| (via Drizzle)    |
+------------------+
```

---

## Directory Structure

```
flash-n-frame/
├── components/              # React components
│   ├── backgrounds/         # Background effects (Aurora, Noise, etc.)
│   ├── drawer/              # Side drawer panels
│   ├── modals/              # Modal dialogs
│   ├── viz/                 # Data visualization components
│   ├── App.tsx              # Root component
│   ├── AppHeader.tsx        # Navigation header
│   ├── DevStudio.tsx        # Code exploration view
│   ├── Home.tsx             # Landing page
│   ├── ImageEditor.tsx      # Reality Engine view
│   ├── RepoAnalyzer.tsx     # GitFlow view
│   └── ArticleToInfographic.tsx  # SiteSketch view
├── contexts/                # React contexts
│   ├── ThemeContext.tsx     # Theme management
│   ├── ProjectContext.tsx   # Project state
│   └── UserSettingsContext.tsx  # API key management
├── hooks/                   # Custom React hooks
│   ├── useTaskManagement.ts # Task CRUD operations
│   ├── useDataManager.ts    # Data upload handling
│   └── useHistory.ts        # Undo/redo functionality
├── services/                # Business logic services
│   ├── geminiService.ts     # Gemini AI integration
│   ├── githubService.ts     # GitHub API integration
│   ├── persistence.ts       # IndexedDB wrapper
│   ├── omniAiService.ts     # AI widget generation
│   ├── templateService.ts   # Template management
│   └── errorService.ts      # Error handling
├── utils/                   # Utility functions
│   ├── buildGraphFromFileTree.ts  # D3 graph data generation
│   ├── aiHelpers.ts         # AI utility functions
│   └── storage.ts           # Storage utilities
├── db/                      # Database layer
│   ├── schema.ts            # Drizzle schema definitions
│   └── index.ts             # Database client
├── docs/                    # Documentation
├── public/                  # Static assets
├── types.ts                 # TypeScript type definitions
├── constants.ts             # Application constants
└── index.css                # Global styles with CSS variables
```

---

## Core Components

### App.tsx
- **Role:** Application root and router
- **Features:**
  - React.lazy() for code splitting
  - Keyboard shortcut handling (Alt+1-5, Shift+?)
  - View navigation state management
  - Context providers wrapper

### Contexts

#### ThemeContext
- Manages theme state: `dark`, `light`, `solarized`
- Applies CSS variables to document root
- Persists preference to localStorage

#### ProjectContext
- Centralized state for current project
- Stores: `repoName`, `fileTree`, `graphData`, `history`
- Provides: `addToHistory`, `setCurrentProject`

#### UserSettingsContext
- Manages user-specific API keys
- Stores keys in localStorage (browser-local)
- Syncs keys with service modules on change

### Views

#### GitFlow (RepoAnalyzer)
- GitHub repository analysis
- File tree fetching and filtering
- Dependency graph generation
- "Explore in DevStudio" integration

#### SiteSketch (ArticleToInfographic)
- URL-based article fetching
- Multi-source comparison mode
- Key stats extraction
- AI-powered infographic generation

#### Reality Engine (ImageEditor)
- Style transfer capabilities
- Wireframe to code generation
- Component library scanning
- Responsive variant generation

#### DevStudio
- Interactive D3 force-directed graphs
- Repository structure visualization
- AI code review
- Test case and documentation generation

---

## Data Flow

### Repository Analysis Flow

```
1. User enters GitHub URL
         ↓
2. githubService.fetchRepoFileTree()
   - Tries 'main' branch, falls back to 'master'
   - Filters for code files
   - Excludes node_modules, dist, build
         ↓
3. File tree stored in ProjectContext
         ↓
4. User clicks "Explore in DevStudio"
         ↓
5. buildGraphFromFileTree() converts to D3 format
         ↓
6. DevStudio renders interactive graph
```

### Infographic Generation Flow

```
1. User provides content (URL, repo, design)
         ↓
2. Content preprocessed and structured
         ↓
3. geminiService.generateInfographic()
   - Sends prompt to Gemini AI
   - Returns base64 image data
         ↓
4. Result displayed in InfographicResultCard
         ↓
5. History saved via persistence service
```

---

## State Management

### Local State
- Component-level useState for UI state
- Form inputs, toggles, loading states

### Context State
- Theme preferences (ThemeContext)
- Current project data (ProjectContext)
- API keys (UserSettingsContext)

### Persistent State
- IndexedDB: History, tasks, project state
- localStorage: Theme, API keys

---

## Styling Architecture

### CSS Variables (index.css)

```css
:root {
  /* Theme-specific variables */
  --bg-primary: #0a0a0f;
  --bg-secondary: #12121a;
  --text-primary: #e0e0e0;
  --accent-primary: #8b5cf6;
  --border-color: #2a2a3a;
}

[data-theme="light"] {
  --bg-primary: #ffffff;
  /* ... */
}

[data-theme="solarized"] {
  --bg-primary: #002b36;
  /* ... */
}
```

### Tailwind CSS
- Utility-first CSS framework
- Custom theme configuration
- @tailwindcss/vite plugin integration

---

## Build & Deployment

### Development
```bash
npm run dev          # Start Vite dev server on port 5000
```

### Production Build
```bash
npm run build        # Outputs to dist/
```

### Database
```bash
npm run db:push      # Push schema changes to PostgreSQL
```

### Deployment
- Static deployment target
- Output directory: `dist`
- Autoscale-compatible

---

## Security Considerations

1. **API Keys**
   - User keys stored in localStorage only
   - Never transmitted to backend
   - Environment variables for shared keys

2. **GitHub Access**
   - Personal tokens enable private repo access
   - Tokens stored client-side only
   - Bearer token authentication

3. **Content Security**
   - No user data stored on servers
   - All processing happens client-side where possible
   - External API calls use HTTPS

---

## Performance Optimizations

1. **Code Splitting**
   - React.lazy() for view components
   - Dynamic imports for heavy dependencies

2. **Caching**
   - IndexedDB for offline data access
   - Service worker for PWA support

3. **Rendering**
   - Virtual DOM diffing (React)
   - Memoization for expensive computations
   - D3 uses requestAnimationFrame
