# FarmFresh frontend

React 19 + TypeScript conversion of the HTML designs in `/templates`. The original
Tailwind design tokens, responsive structure, dark theme, card styling, and page
hierarchy are preserved.

## Run locally

```bash
npm install
npm run dev
```

Use `npm run typecheck`, `npm run lint`, and `npm run build` before merging.

## Architecture

- `app/`: providers, layouts, and lazy route composition
- `components/`: design-system primitives and shared marketplace UI
- `features/`: page components and feature-local state
- `services/api/`: the stable backend boundary; mock implementations include
  replacement notes for future ASP.NET Core endpoints
- `mocks/`: realistic development data
- `types/`: backend-aligned domain contracts

Cart and authentication behavior are intentionally local/mock-only. When the .NET
API is ready, replace service implementations without changing page components.
