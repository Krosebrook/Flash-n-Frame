# Flash-n-Frame API Documentation

## Overview

Flash-n-Frame provides several internal services for AI-powered content generation and GitHub integration. This document covers the available APIs and how to use them.

---

## Table of Contents

1. [Gemini Service](#gemini-service)
2. [GitHub Service](#github-service)
3. [User Settings API](#user-settings-api)
4. [Persistence Service](#persistence-service)

---

## Gemini Service

**Location:** `services/geminiService.ts`

The Gemini Service provides AI-powered content generation using Google's Gemini API.

### Configuration

```typescript
import { setUserGeminiKey } from '../services/geminiService';

// Set user-provided API key (takes precedence over environment variable)
setUserGeminiKey('your-api-key');
```

### Functions

#### `generateInfographic(prompt: string, options?: GenerateOptions): Promise<GeneratedImage>`

Generates an infographic image based on the provided prompt.

**Parameters:**
- `prompt` (string): Description of the infographic to generate
- `options` (optional): Generation options including style, dimensions

**Returns:** Promise resolving to a GeneratedImage object with base64 data

#### `editImage(imageData: string, editPrompt: string): Promise<GeneratedImage>`

Edits an existing image based on the provided prompt.

**Parameters:**
- `imageData` (string): Base64-encoded image data
- `editPrompt` (string): Instructions for how to edit the image

**Returns:** Promise resolving to edited image data

#### `vectorizeImage(imageData: string): Promise<string>`

Converts a raster image to SVG format.

**Parameters:**
- `imageData` (string): Base64-encoded image data

**Returns:** Promise resolving to SVG string

#### `generateCode(designData: object): Promise<string>`

Generates code from design specifications.

**Parameters:**
- `designData` (object): Design specifications including layout, components

**Returns:** Promise resolving to generated code string

---

## GitHub Service

**Location:** `services/githubService.ts`

The GitHub Service provides repository analysis and file fetching capabilities.

### Configuration

```typescript
import { setUserGitHubToken } from '../services/githubService';

// Set user-provided token for private repo access
setUserGitHubToken('ghp_your-token');
```

### Functions

#### `fetchRepoFileTree(owner: string, repo: string): Promise<RepoFileTree[]>`

Fetches the complete file tree of a GitHub repository.

**Parameters:**
- `owner` (string): Repository owner username
- `repo` (string): Repository name

**Returns:** Promise resolving to array of file tree items

**Example:**
```typescript
const files = await fetchRepoFileTree('facebook', 'react');
// Returns array of { path: string, type: 'blob' | 'tree', sha: string }
```

#### `fetchFileContent(owner: string, repo: string, path: string, branch?: string): Promise<string | null>`

Fetches raw content of a specific file.

**Parameters:**
- `owner` (string): Repository owner
- `repo` (string): Repository name
- `path` (string): File path within repository
- `branch` (optional): Branch name, defaults to trying 'main' then 'master'

**Returns:** Promise resolving to file content string or null if not found

#### `fetchRepoDependencies(owner: string, repo: string): Promise<DependencyResult>`

Fetches and parses dependency information from a repository.

**Parameters:**
- `owner` (string): Repository owner
- `repo` (string): Repository name

**Returns:** Promise resolving to:
```typescript
{
  dependencies: DependencyInfo[];
  ecosystem: 'npm' | 'pip' | 'cargo' | 'go' | 'unknown';
  manifestFile: string;
}
```

**Supported Ecosystems:**
- npm (package.json)
- pip (requirements.txt)
- Cargo (Cargo.toml)
- Go (go.mod)

---

## User Settings API

**Location:** `contexts/UserSettingsContext.tsx`

The User Settings API provides a React context for managing user-specific API keys.

### Hook Usage

```typescript
import { useUserSettings } from '../contexts/UserSettingsContext';

function MyComponent() {
  const { apiKeys, setApiKey, hasKey, openSettings } = useUserSettings();
  
  // Check if a key is configured
  if (hasKey('githubToken')) {
    // Use the token
  }
  
  // Set a new key
  setApiKey('geminiKey', 'new-api-key');
  
  // Open settings modal
  openSettings();
}
```

### Available Keys

| Key | Description |
|-----|-------------|
| `githubToken` | GitHub Personal Access Token |
| `geminiKey` | Google Gemini API Key |
| `openaiKey` | OpenAI API Key |
| `anthropicKey` | Anthropic API Key |
| `notionKey` | Notion Integration Token |
| `googleDriveKey` | Google Drive API Key |
| `awsAccessKey` | AWS Access Key ID |
| `awsSecretKey` | AWS Secret Access Key |
| `awsRegion` | AWS Region |
| `hubspotKey` | HubSpot API Key |
| `freshdeskKey` | Freshdesk API Key |
| `freshdeskDomain` | Freshdesk Domain |
| `bitwardenClientId` | Bitwarden Client ID |
| `bitwardenClientSecret` | Bitwarden Client Secret |
| `vsaxKey` | vsaX API Key |
| `microsoftClientId` | Microsoft App Client ID |
| `microsoftClientSecret` | Microsoft App Client Secret |
| `microsoftTenantId` | Microsoft Tenant ID |
| `teamsWebhook` | Microsoft Teams Webhook URL |
| `sharePointSiteUrl` | SharePoint Site URL |
| `powerAppsEnvironment` | Power Apps Environment ID |

### Context Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `setApiKey` | `(service, value)` | Sets an API key |
| `clearApiKey` | `(service)` | Removes an API key |
| `clearAllKeys` | `()` | Removes all API keys |
| `hasKey` | `(service)` | Checks if key is configured |
| `openSettings` | `()` | Opens settings modal |
| `closeSettings` | `()` | Closes settings modal |

---

## Persistence Service

**Location:** `services/persistence.ts`

The Persistence Service provides IndexedDB-based storage for offline data persistence.

### Functions

#### `saveHistory(items: HistoryItem[]): Promise<void>`

Saves analysis history to IndexedDB.

#### `loadHistory(): Promise<HistoryItem[]>`

Loads analysis history from IndexedDB.

#### `saveTasks(tasks: Task[]): Promise<void>`

Saves task list to IndexedDB.

#### `loadTasks(): Promise<Task[]>`

Loads task list from IndexedDB.

#### `saveProjectState(state: ProjectState): Promise<void>`

Saves current project state.

#### `loadProjectState(): Promise<ProjectState | null>`

Loads saved project state.

---

## Error Handling

All services throw descriptive errors that should be caught and handled:

```typescript
try {
  const files = await fetchRepoFileTree('owner', 'repo');
} catch (error) {
  if (error.message.includes('rate limit')) {
    // Handle rate limiting
  } else if (error.message.includes('private')) {
    // Prompt user to add GitHub token
  }
}
```

---

## Rate Limits

### GitHub API
- **Unauthenticated:** 60 requests/hour
- **Authenticated:** 5,000 requests/hour

### Gemini API
- Varies by API key tier
- Implement exponential backoff for retries

---

## Security Notes

1. API keys are stored in browser localStorage only
2. Keys are never sent to Flash-n-Frame servers
3. Each user's keys are isolated to their browser
4. Use environment variables for shared/team keys
