# Best Practices Guide

This document outlines best practices for developing, maintaining, and using Flash-n-Frame.

---

## Table of Contents

1. [Development Best Practices](#development-best-practices)
2. [Code Style Guidelines](#code-style-guidelines)
3. [Component Patterns](#component-patterns)
4. [State Management](#state-management)
5. [API Integration](#api-integration)
6. [Security Guidelines](#security-guidelines)
7. [Performance Optimization](#performance-optimization)
8. [Testing Guidelines](#testing-guidelines)

---

## Development Best Practices

### Project Setup

1. **Environment Variables**
   ```bash
   # Required
   DATABASE_URL=postgresql://...
   GEMINI_API_KEY=your-key
   
   # Optional (users can provide their own)
   # GITHUB_TOKEN, OPENAI_KEY, etc.
   ```

2. **Development Server**
   ```bash
   npm run dev  # Starts on port 5000
   ```

3. **Database Changes**
   ```bash
   npm run db:push  # Apply schema changes
   ```

### File Organization

```
DO:
├── components/
│   ├── FeatureName/
│   │   ├── FeatureName.tsx
│   │   ├── FeatureNameItem.tsx
│   │   └── index.ts
│   └── shared/
│       └── Button.tsx

DON'T:
├── FeatureName.tsx        # Don't put in root
├── feature-name.tsx       # Use PascalCase
└── featureName.component.tsx  # Don't add suffixes
```

### Import Order

```typescript
// 1. React and framework imports
import React, { useState, useEffect } from 'react';

// 2. Third-party libraries
import { useQuery } from '@tanstack/react-query';

// 3. Internal components
import { Button } from '../shared/Button';

// 4. Hooks and contexts
import { useUserSettings } from '../../contexts/UserSettingsContext';

// 5. Services and utilities
import { fetchRepoFileTree } from '../../services/githubService';

// 6. Types
import type { RepoFileTree } from '../../types';

// 7. Styles (if any)
import './FeatureName.css';
```

---

## Code Style Guidelines

### TypeScript

```typescript
// DO: Use explicit types for function parameters
function processData(data: InputData): OutputData {
  // ...
}

// DON'T: Use 'any' type
function processData(data: any) {
  // ...
}

// DO: Use interfaces for object shapes
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

// DO: Use type for unions/aliases
type Theme = 'dark' | 'light' | 'solarized';
```

### React Components

```typescript
// DO: Use functional components with explicit props interface
interface FeatureCardProps {
  title: string;
  description: string;
  onAction?: () => void;
}

export function FeatureCard({ title, description, onAction }: FeatureCardProps) {
  return (
    <div className="feature-card">
      <h3>{title}</h3>
      <p>{description}</p>
      {onAction && <button onClick={onAction}>Action</button>}
    </div>
  );
}

// DON'T: Use default exports for components
export default function FeatureCard() {} // Avoid
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `FeatureCard.tsx` |
| Hooks | camelCase with 'use' | `useDataManager.ts` |
| Services | camelCase with 'Service' | `geminiService.ts` |
| Contexts | PascalCase with 'Context' | `UserSettingsContext.tsx` |
| Types | PascalCase | `RepoFileTree` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_FILE_SIZE` |

---

## Component Patterns

### Container/Presenter Pattern

```typescript
// Container (handles logic)
function RepoAnalyzerContainer() {
  const [data, setData] = useState<RepoData | null>(null);
  const [loading, setLoading] = useState(false);
  
  const handleAnalyze = async (url: string) => {
    setLoading(true);
    const result = await analyzeRepo(url);
    setData(result);
    setLoading(false);
  };
  
  return <RepoAnalyzerPresenter data={data} loading={loading} onAnalyze={handleAnalyze} />;
}

// Presenter (handles UI)
function RepoAnalyzerPresenter({ data, loading, onAnalyze }: PresenterProps) {
  return (
    <div>
      {loading ? <Spinner /> : <Results data={data} />}
    </div>
  );
}
```

### Compound Components

```typescript
// Parent provides context
function Card({ children }: { children: React.ReactNode }) {
  return <div className="card">{children}</div>;
}

// Sub-components
Card.Header = function CardHeader({ children }) {
  return <div className="card-header">{children}</div>;
};

Card.Body = function CardBody({ children }) {
  return <div className="card-body">{children}</div>;
};

// Usage
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
</Card>
```

---

## State Management

### When to Use What

| State Type | Use Case | Tool |
|------------|----------|------|
| UI State | Form inputs, toggles | useState |
| Derived State | Computed values | useMemo |
| Side Effects | API calls, subscriptions | useEffect |
| Shared State | Theme, user settings | Context |
| Persistent State | History, preferences | IndexedDB/localStorage |

### Context Best Practices

```typescript
// DO: Split contexts by concern
<ThemeProvider>
  <UserSettingsProvider>
    <ProjectProvider>
      <App />
    </ProjectProvider>
  </UserSettingsProvider>
</ThemeProvider>

// DON'T: One giant context for everything
<GlobalProvider value={{ theme, user, project, settings }}>
  <App />
</GlobalProvider>
```

### Avoid Prop Drilling

```typescript
// BAD: Prop drilling through multiple levels
<Parent data={data}>
  <Child data={data}>
    <GrandChild data={data} />
  </Child>
</Parent>

// GOOD: Use context for deeply nested data
const DataContext = createContext<Data | null>(null);

<DataContext.Provider value={data}>
  <Parent>
    <Child>
      <GrandChild /> {/* Uses useContext(DataContext) */}
    </Child>
  </Parent>
</DataContext.Provider>
```

---

## API Integration

### Service Layer Pattern

```typescript
// services/githubService.ts
let userToken: string | null = null;

export function setUserGitHubToken(token: string | null) {
  userToken = token;
}

export async function fetchRepoFileTree(owner: string, repo: string): Promise<RepoFileTree[]> {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
  };
  
  if (userToken) {
    headers['Authorization'] = `Bearer ${userToken}`;
  }
  
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`,
    { headers }
  );
  
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }
  
  return response.json();
}
```

### Error Handling

```typescript
// DO: Catch and handle errors appropriately
try {
  const data = await fetchRepoFileTree(owner, repo);
  setData(data);
} catch (error) {
  if (error.message.includes('rate limit')) {
    showNotification('Rate limited. Please wait or add a GitHub token.');
  } else if (error.message.includes('404')) {
    showNotification('Repository not found. Check the URL.');
  } else {
    showNotification('An error occurred. Please try again.');
  }
  console.error('Fetch error:', error);
}

// DON'T: Silently fail
try {
  const data = await fetchRepoFileTree(owner, repo);
  setData(data);
} catch (error) {
  // Silent failure - user has no idea what happened
}
```

---

## Security Guidelines

### API Key Handling

```typescript
// DO: Store user keys in localStorage only
localStorage.setItem('user-api-keys', JSON.stringify(keys));

// DO: Use environment variables for shared keys
const sharedKey = import.meta.env.VITE_GEMINI_API_KEY;

// DON'T: Hardcode API keys
const API_KEY = 'sk-1234567890abcdef'; // NEVER do this

// DON'T: Log API keys
console.log('Using key:', apiKey); // Security risk
```

### Input Validation

```typescript
// DO: Validate user input
function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) return null;
  
  return {
    owner: match[1].trim(),
    repo: match[2].replace(/\.git$/, '').trim(),
  };
}

// DO: Sanitize before display
function displayUserContent(content: string) {
  return content.replace(/[<>]/g, '');
}
```

### HTTPS Only

```typescript
// DO: Use HTTPS for all API calls
fetch('https://api.github.com/...');

// DON'T: Use HTTP
fetch('http://api.github.com/...'); // Insecure
```

---

## Performance Optimization

### Lazy Loading

```typescript
// DO: Lazy load heavy components
const DevStudio = React.lazy(() => import('./components/DevStudio'));
const ImageEditor = React.lazy(() => import('./components/ImageEditor'));

// Use with Suspense
<Suspense fallback={<Loading />}>
  <DevStudio />
</Suspense>
```

### Memoization

```typescript
// DO: Memoize expensive computations
const sortedData = useMemo(() => {
  return data.sort((a, b) => b.priority - a.priority);
}, [data]);

// DO: Memoize callbacks passed to children
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

// DON'T: Create new functions on every render
<ChildComponent onClick={() => doSomething(id)} /> // New function each render
```

### Virtualization for Large Lists

```typescript
// For lists with 100+ items, use virtualization
import { FixedSizeList } from 'react-window';

function FileList({ files }: { files: FileItem[] }) {
  return (
    <FixedSizeList
      height={400}
      itemCount={files.length}
      itemSize={35}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>{files[index].name}</div>
      )}
    </FixedSizeList>
  );
}
```

---

## Testing Guidelines

### Unit Tests

```typescript
// Test pure functions
describe('parseGitHubUrl', () => {
  it('should parse valid GitHub URLs', () => {
    const result = parseGitHubUrl('https://github.com/owner/repo');
    expect(result).toEqual({ owner: 'owner', repo: 'repo' });
  });
  
  it('should handle .git suffix', () => {
    const result = parseGitHubUrl('https://github.com/owner/repo.git');
    expect(result).toEqual({ owner: 'owner', repo: 'repo' });
  });
  
  it('should return null for invalid URLs', () => {
    const result = parseGitHubUrl('not-a-url');
    expect(result).toBeNull();
  });
});
```

### Component Tests

```typescript
import { render, screen, fireEvent } from '@testing-library/react';

describe('SettingsButton', () => {
  it('should open settings modal on click', () => {
    render(
      <UserSettingsProvider>
        <SettingsButton />
        <UserSettingsModal />
      </UserSettingsProvider>
    );
    
    fireEvent.click(screen.getByRole('button', { name: /settings/i }));
    
    expect(screen.getByText('Your API Keys')).toBeInTheDocument();
  });
});
```

### Integration Tests

```typescript
describe('Repository Analysis Flow', () => {
  it('should fetch and display repository structure', async () => {
    render(<App />);
    
    // Navigate to GitFlow
    fireEvent.click(screen.getByText('GitFlow'));
    
    // Enter repo URL
    const input = screen.getByPlaceholderText(/github/i);
    fireEvent.change(input, { target: { value: 'https://github.com/test/repo' } });
    
    // Submit
    fireEvent.click(screen.getByText('Analyze'));
    
    // Wait for results
    await waitFor(() => {
      expect(screen.getByText('Repository Structure')).toBeInTheDocument();
    });
  });
});
```

---

## Documentation Standards

### Code Comments

```typescript
// DO: Explain WHY, not WHAT
// Retry with master branch because older repos may not use main as default
if (response.status === 404 && branch === 'main') {
  return fetchWithBranch('master');
}

// DON'T: State the obvious
// Set loading to true
setLoading(true);
```

### JSDoc for Public APIs

```typescript
/**
 * Fetches the file tree of a GitHub repository.
 * 
 * @param owner - Repository owner username
 * @param repo - Repository name
 * @returns Promise resolving to array of file tree items
 * @throws Error if repository not found or rate limited
 * 
 * @example
 * const files = await fetchRepoFileTree('facebook', 'react');
 */
export async function fetchRepoFileTree(owner: string, repo: string): Promise<RepoFileTree[]> {
  // ...
}
```
