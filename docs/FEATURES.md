# Flash-n-Frame Features

## Overview

Flash-n-Frame is a visual intelligence platform that transforms content into professional infographics. This document provides detailed information about all available features.

---

## Table of Contents

1. [GitFlow (Repository Analyzer)](#gitflow-repository-analyzer)
2. [SiteSketch (Article to Infographic)](#sitesketch-article-to-infographic)
3. [Reality Engine](#reality-engine)
4. [DevStudio](#devstudio)
5. [User Settings & API Keys](#user-settings--api-keys)
6. [Theme System](#theme-system)
7. [Keyboard Shortcuts](#keyboard-shortcuts)

---

## GitFlow (Repository Analyzer)

Transform GitHub repositories into visual architectural blueprints.

### Core Features

#### Repository Structure Visualization
- Fetches complete file tree from any public GitHub repository
- Supports private repositories with user-provided GitHub token
- Filters for relevant code files (JS, TS, Python, Go, Rust, etc.)
- Excludes build artifacts (node_modules, dist, build)

#### AI-Powered Infographic Generation
- Converts repository structure to visual diagrams
- Highlights key files and directories
- Shows technology stack and patterns

#### Dependency Graph Generator
Multi-ecosystem support for dependency visualization:

| Ecosystem | Manifest File | Features |
|-----------|--------------|----------|
| npm | package.json | Production, dev, peer dependencies |
| pip | requirements.txt | Version constraints |
| Cargo | Cargo.toml | Rust crates |
| Go | go.mod | Go modules |

Features:
- Version badges for each dependency
- AI security analysis
- Outdated package detection

#### DevStudio Integration
- "Explore in DevStudio" button on analyzed repos
- Converts file tree to D3 graph data
- Seamless navigation between views

---

## SiteSketch (Article to Infographic)

Transform web articles into concise, professional infographics.

### Core Features

#### Single URL Mode
- Enter any article URL
- AI extracts key information
- Generates visual summary infographic

#### Multi-Source Comparison Mode
- Compare 2-3 articles simultaneously
- Side-by-side visual comparison
- Identifies common themes and differences

#### Key Stats Extractor
- Automatically identifies statistics in articles
- Highlights numbers, percentages, dates
- Creates data-focused infographics

### Supported Content Types
- News articles
- Blog posts
- Documentation pages
- Research papers (HTML format)

---

## Reality Engine

AI-powered design transformation tools.

### Style Transfer
- Upload source image
- Apply different visual styles
- Maintain content while changing aesthetics

### Wireframe to Code
- Upload wireframe or mockup images
- AI generates functional code
- Supports multiple frameworks

### Component Library Scanner
- Analyze existing UI components
- Extract design patterns
- Generate component documentation

### Responsive Variant Generator
- Input desktop design
- Generate mobile/tablet variants
- Maintain design consistency

### Dashboard Generator
- Describe desired dashboard
- AI creates layout and components
- Customizable widget placement

---

## DevStudio

Interactive development environment for code exploration.

### D3 Visualization
- Force-directed graph layout
- Interactive pan and zoom
- Node selection and details
- Relationship visualization

### AI Code Review
- Select files for review
- AI analyzes code quality
- Provides improvement suggestions
- Identifies potential issues

### Test Case Generator
- Analyze function signatures
- Generate unit test templates
- Support for multiple testing frameworks

### Documentation Generator
- Parse code structure
- Generate JSDoc/docstrings
- Create README sections

### Gap/Bottleneck Catcher
- Analyze codebase architecture
- Identify missing abstractions
- Find performance bottlenecks
- Suggest refactoring opportunities

---

## User Settings & API Keys

Manage personal API keys for various services.

### Sections

#### Developer & AI Services
| Service | Key Type | Usage |
|---------|----------|-------|
| GitHub | Personal Access Token | Private repo access |
| Google Gemini | API Key | AI generation |
| OpenAI | API Key | AI features |
| Anthropic | API Key | AI features |

#### Cloud Storage
| Service | Key Type | Usage |
|---------|----------|-------|
| Notion | Integration Token | Document access |
| Google Drive | API Key | File storage |

#### AWS Services
| Service | Key Type | Usage |
|---------|----------|-------|
| AWS | Access Key ID | AWS services |
| AWS | Secret Access Key | AWS auth |
| AWS | Region | Service region |

#### CRM & Support
| Service | Key Type | Usage |
|---------|----------|-------|
| HubSpot | API Key | CRM integration |
| Freshdesk | API Key + Domain | Support tickets |

#### Security
| Service | Key Type | Usage |
|---------|----------|-------|
| Bitwarden | Client ID + Secret | Password management |

#### Enterprise
| Service | Key Type | Usage |
|---------|----------|-------|
| vsaX | API Key | Enterprise features |

#### Microsoft 365
| Service | Key Type | Usage |
|---------|----------|-------|
| Azure AD | Client ID/Secret/Tenant | Auth |
| Teams | Webhook URL | Notifications |
| SharePoint | Site URL | Document storage |
| Power Apps | Environment ID | App integration |

### Security
- Keys stored in browser localStorage only
- Never sent to Flash-n-Frame servers
- Private to each user's browser
- Fallback to environment variables if not set

---

## Theme System

Three visual themes with full CSS variable support.

### Dark Theme (Default)
- Dark backgrounds (#0a0a0f)
- Light text (#e0e0e0)
- Purple accent (#8b5cf6)
- Best for: Low-light environments

### Light Theme
- White backgrounds (#ffffff)
- Dark text (#1a1a2e)
- Purple accent (#7c3aed)
- Best for: Bright environments

### Solarized Theme
- Solarized base colors (#002b36)
- Solarized text palette
- Teal accent (#2aa198)
- Best for: Extended reading sessions

### Theme Toggle
- Located in AppHeader
- Click to cycle: Dark → Light → Solarized
- Preference saved to localStorage
- Icons: Moon (dark), Sun (light), Palette (solarized)

---

## Keyboard Shortcuts

Quick navigation and actions.

### Navigation Shortcuts

| Shortcut | Action |
|----------|--------|
| Alt + 1 | Go to Home |
| Alt + 2 | Go to GitFlow |
| Alt + 3 | Go to SiteSketch |
| Alt + 4 | Go to Reality Engine |
| Alt + 5 | Go to DevStudio |

### Action Shortcuts

| Shortcut | Action |
|----------|--------|
| Shift + ? | Show keyboard shortcuts help |
| Ctrl + Enter | Execute render (Reality Engine) |

### Help Modal
- Press Shift + ? anywhere
- Shows complete shortcut reference
- Click outside or press Escape to close

---

## PWA Support

Flash-n-Frame works as a Progressive Web App.

### Features
- Installable to home screen
- Works offline (cached assets)
- Service worker for background sync
- App-like experience

### Installation
1. Open Flash-n-Frame in browser
2. Click "Install" prompt (or browser menu)
3. App installs to device
4. Launch from home screen/app drawer

---

## Data Persistence

### What's Saved
- Analysis history (IndexedDB)
- Task lists (IndexedDB)
- Project state (IndexedDB)
- API keys (localStorage)
- Theme preference (localStorage)

### What's NOT Saved
- Generated images (download to keep)
- Temporary analysis data
- Session-only states
