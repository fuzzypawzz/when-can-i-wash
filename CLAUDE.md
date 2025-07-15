# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this
repository.

## Development Commands

- **Start development server**: `npm run dev:offline` (preferred for development)
- **Development with regular mode**: `npm run dev`
- **Build application**: `npm run build`
- **Run unit tests**: `npm run test` (watch mode) or `npm run test:nowatch` (single run)
- **Run E2E tests**: `npm run e2e`, `npm run e2e:ui`, or `npm run e2e:headed`
- **Lint and type check**: `npm run lint` (runs type-check, eslint, and stylelint)
- **Type checking only**: `npm run type-check`
- **ESLint only**: `npm run eslint`
- **Stylelint only**: `npm run stylelint`
- **Format code**: `npm run format`
- **Storybook**: `npm run storybook`

## Architecture Overview

This is a React SPA application template with a layered architecture organized into distinct
domains:

### Core Architecture Layers

1. **App.Core** - Application infrastructure and setup
   - `app/` - Application bootstrap and initialization (`bootstrap.ts`, `app-setup.tsx`)
   - `infrastructure/` - Core infrastructure services (auth, routing, HTTP, MSW, config)

2. **App.Logic** - Business logic and data management
   - `logic/` - Business logic implementations
   - `dtos/` - Data transfer objects
   - `infrastructure/` - Logic-specific infrastructure (query client)

3. **App.Service** - Service layer for external integrations
   - `service/` - Service implementations
   - `models/` - Service data models
   - `stubs/` - Mock data for testing

4. **App.UI** - User interface components and presentation
   - `components/` - React components
   - `pages/` - Page-level components
   - `assets/` - Static assets and global styles

5. **App.E2E** - End-to-end testing
   - `tests/` - E2E test specifications
   - `helpers/` - Test utilities and setup

### Key Technologies

- **React 19** with TypeScript
- **React Router 7** for routing
- **Vite** for build tooling
- **Vitest** for unit testing
- **Playwright** for E2E testing
- **MSW** (Mock Service Worker) for API mocking
- **Storybook** for component development
- **SCSS** with include-media for styling

### Application Bootstrap Flow

The app initializes through `bootstrap.ts` which:

1. Sets up Mock Service Worker
2. Redirects to desired page
3. Renders the React app
4. Sends app start event

### Path Aliases

Uses `@/` alias pointing to `src/` directory for clean imports.

### Node Version

Requires Node.js >= 22.12.0 (managed via Volta).

### Testing Setup

- Unit tests use Vitest with jsdom environment
- E2E tests use Playwright running against `localhost:5183`
- MSW provides API mocking in both development and testing
- Storybook runs on port 6006 for component testing

### File Naming Conventions

- React components: `kebab-case.tsx`
- Component styles: `kebab-case.scss`
- Presenter files: `kebab-case.presenter.ts`
- Vitest unit tests: `kebab-case.test.ts`
- Playwright E2E tests: `kebab-case.spec.ts`
- Storybook files: `kebab-case.stories.tsx`
- Directories: `kebab-case`

### Development Modes

- `dev:offline` - Development with offline/mock data (recommended)
- `dev:offline:e2e` - Special mode for E2E testing on port 5183
- Regular `dev` - Standard development mode

Always run `npm run lint` after making changes to ensure code quality and type safety.

## Architecture Principles

### Flat Presentation - "Tell Don't Ask"

Views should never need to be exposed to complex logic or data from business models, as this couples
the UI code with the domain. Views should be "told" what to do instead of "asking" what to do.

**Bad - View asking what to do:**

```tsx
{
  user.type === 'Admin' && <h1>{user.adminUserName}</h1>
}
{
  user.type === 'User' && <h1>{user.name}</h1>
}
{
  vm.activeDemo === 'store' && <StoreDemo />
}
```

**Good - View being told what to do:**

```tsx
;<h1>{vm.displayName}</h1>
{
  vm.shouldShowDemo && <div>{vm.demoContent}</div>
}
```

The presenter/view model should handle all logic and provide flat, ready-to-render data to the view.
Views should never contain conditional logic based on data types or states - instead they should
receive pre-computed properties that tell them exactly what to render.

**Important:** Presenters are TypeScript files (.ts) and should NEVER contain JSX/TSX markup. Keep
all markup in the view (.tsx) files. The presenter should only provide data and boolean flags that
tell the view what to render, not how to render it.
