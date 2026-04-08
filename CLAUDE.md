# Project Context for Claude Code

**This file provides project-specific context for Claude Code and its agents.**

---

## Agent System

**Scope:** Project-scoped agents (in `.claude/agents/`)

**Available Agents:** 7 production-ready agents for Expo/React Native

- **Grand Architect** (`.claude/agents/tier-s-meta/`) — Meta-orchestrator for complex features
- **Design Token Guardian** (`.claude/agents/tier-1-daily/`) — Enforces design system consistency
- **A11y Enforcer** (`.claude/agents/tier-1-daily/`) — WCAG 2.2 compliance validation
- **Test Generator** (`.claude/agents/tier-1-daily/`) — Auto-generates tests with ROI prioritization
- **Performance Enforcer** (`.claude/agents/tier-1-daily/`) — Tracks performance budgets
- **Performance Prophet** (`.claude/agents/tier-2-power/`) — Predictive performance analysis
- **Security Specialist** (`.claude/agents/tier-2-power/`) — Security audits & penetration testing

**Team Sync:** Agents are version controlled in `.claude/` — team members get them automatically via git.

---

## Project Overview

**Project Name:** Rock World
**Description:** A climbing route discovery app — browse guidebooks, view topo images with SVG overlays, and explore climbing routes.
**Target Platforms:** iOS, Android (React Native/Expo)

---

## Tech Stack

### Core

- **Expo SDK:** ~54.0.33
- **React Native:** 0.81.5
- **TypeScript:** ~5.9.2
- **React:** 19.1.0

### State Management

- Custom React hooks only (no Redux/Zustand/Jotai)
- Reanimated `useSharedValue` for animation state

### Navigation

- **Expo Router** (file-based routing, `expo-router` ~6.0.23)
- `@react-navigation/stack` + `@react-navigation/bottom-tabs` for nested flows

### Styling

- StyleSheet + custom design tokens (`src/theme/`)
- Co-located `*.styles.ts` files for non-trivial styles

### Key Libraries

- `react-native-reanimated` ~4.1.1 — animations (UI thread worklets)
- `react-native-gesture-handler` ~2.28.0 — pinch/pan gestures
- `@shopify/flash-list` ^2.2.2 — virtualized lists
- `@gorhom/bottom-sheet` ^5.2.8 — bottom sheet navigator
- `react-native-svg` 15.12.1 — SVG topo overlays
- `fast-xml-parser` ^5.3.4 — runtime SVG/XML parsing
- `expo-image` ~3.0.11 — optimized image rendering

---

## Architecture

### Layer Structure

| Layer              | Responsibility                                                   |
| ------------------ | ---------------------------------------------------------------- |
| `app/`             | Expo Router screens and route composition only — no domain logic |
| `features/<Name>/` | Feature-scoped UI, hooks, and types                              |
| `components/ui/`   | Shared design-system primitives                                  |
| `hooks/`           | Cross-feature reusable state and interaction logic               |
| `services/`        | Data loading, parsing, and integration utilities                 |
| `src/theme/`       | Design tokens and style system                                   |

### Folder Structure

```
app/
├── (tabs)/           # Tab navigator screens (index, guidebooks, topo)
├── search/           # Generic search screen (receives SearchContextConfig via params)
├── TopoView.tsx      # Main topo viewer screen
└── _layout.tsx       # Global provider / root-stack wiring only

features/
├── SearchBar/        # Animated header, filter chips, useSearchFiltersState
├── TopoPreview/      # SVG path loading and animations
└── TopoBottomSheet/  # Sheet navigator and route list

components/
├── ui/               # Shared design-system primitives
└── topo/             # Topo-specific shared components

services/
└── topo/             # SVG/XML parsing (loadSvgPaths.ts)

src/theme/
├── colors.ts         # Semantic color tokens (light/dark)
├── spacing.ts        # Spacing scale, radii, sizes, shadows
├── typography.ts     # Font families, weights, type scale
└── index.ts          # Unified theme export
```

### Key Patterns

- **Search configuration:** The search screen is generic — callers pass `SearchContextConfig` via route params to define which filters appear.
- **Topo rendering:** SVG paths are parsed from XML at runtime via `fast-xml-parser` and rendered as `react-native-svg` overlays on top of topo images.
- **Path alias:** `@/*` maps to the repo root (e.g., `@/components/ui/Button`).
- **React Compiler:** Enabled via `experiments.reactCompiler: true` — do **not** add `useMemo`/`useCallback` manually.

---

## Coding Conventions

### React Components

```typescript
// ✅ Functional components with explicitly typed props interface
interface Props {
  routeId: string;
  onSelect: () => void;
}

export function RouteCard({ routeId, onSelect }: Props) {}

// ✅ Named exports
export { RouteCard };

// ❌ No class components
// ❌ No type alias for props — use interface
```

### TypeScript

```typescript
// ✅ Explicit types for all props and return values
// ✅ No 'any' type (use 'unknown' if truly needed with justification)
// ✅ Prefer union types and const maps over enums
const FILTER_TYPE = {
  GRADE: 'grade',
  STYLE: 'style',
} as const;
type FilterType = (typeof FILTER_TYPE)[keyof typeof FILTER_TYPE];
```

### Naming Conventions

- **Components:** PascalCase (`RouteCard.tsx`)
- **Hooks:** camelCase with `use` prefix (`useSearchFiltersState.ts`)
- **Utilities/services:** camelCase (`loadSvgPaths.ts`)
- **Constants:** UPPER_SNAKE_CASE or `const` maps (`FILTER_TYPE`)
- **Styles:** co-located `ComponentName.styles.ts`

---

## Design System

### Theme Location

**Primary theme file:** `src/theme/index.ts`

### Token Usage

```typescript
import { theme } from '@/src/theme';

// Resolve colors for current scheme
const colors = theme.colors('dark'); // or 'light'
<View style={{ backgroundColor: colors.backgroundPrimary }} />

// Spacing
<View style={{ padding: theme.spacing.lg }} />   // 16px

// Border radius
<View style={{ borderRadius: theme.radii.lg }} /> // 12px

// Typography
<Text style={theme.typography.typeScale.headlineSm} />
```

### Spacing Scale (4px grid)

| Token | Value | Context                      |
| ----- | ----- | ---------------------------- |
| `xxs` | 2px   | Icon internal padding        |
| `xs`  | 4px   | Icon ↔ text gaps             |
| `sm`  | 8px   | Compact row padding          |
| `md`  | 12px  | Standard element gap         |
| `lg`  | 16px  | Card padding, screen margins |
| `xl`  | 20px  | Section spacing              |
| `2xl` | 24px  | Large section breaks         |
| `3xl` | 32px  | Hero padding                 |

### Border Radius Tokens

| Token  | Value | Usage          |
| ------ | ----- | -------------- |
| `sm`   | 8px   | Badges, chips  |
| `md`   | 10px  | Input fields   |
| `lg`   | 12px  | Cards          |
| `xl`   | 16px  | Modals         |
| `2xl`  | 20px  | Bottom sheets  |
| `full` | 999px | Pills, buttons |

---

## Commands

```bash
# Development
npm start          # Expo dev server
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator
npm run web        # Run in browser

# Code quality
npm run lint       # ESLint check
npm run lint:fix   # ESLint auto-fix
npm run format     # Prettier format

# Testing
npm test                         # Run all tests
npm run test:watch               # Watch mode
npx jest path/to/file.test.tsx   # Run a single test file
```

Pre-commit hooks (Husky + lint-staged) run ESLint and Prettier automatically.

---

## Testing Requirements

### Coverage Targets

- **`services/topo` and `hooks/topo`:** Tests required for all non-trivial logic
- **UI components:** Test where behavior is non-obvious

### Test Location

- Unit tests: `ComponentName.test.tsx` co-located with the source file
- Service tests: `services/topo/__tests__/`

### Running Tests

```bash
npm test                              # All tests
npm run test:watch                    # Watch mode
npx jest path/to/file.test.tsx        # Single file
```

---

## Code Quality Standards

### Before Finishing a Task

1. ✅ Lint is clean: `npm run lint`
2. ✅ Remove all `console.log`, temporary buttons, demo logic
3. ✅ No hardcoded colors, spacing, or typography literals
4. ✅ TypeScript strict — no `any`
5. ✅ One component per file

### Pre-commit Hooks (Husky + lint-staged)

- ESLint auto-fix on `*.{js,jsx,ts,tsx}`
- Prettier format on all supported files
- commitlint enforces conventional commit format

---

## Platform-Specific Notes

### iOS

- `supportsTablet: true`
- Minimum touch target: 44×44pt (iOS HIG)
- Uses `SafeAreaProvider` globally

### Android

- Edge-to-edge enabled
- Predictive back gesture disabled
- Adaptive icon configured

### Both

- `newArchEnabled: true` (New Architecture)
- `reactCompiler: true` (React Compiler — no manual memoization)
- Dark/light mode: `userInterfaceStyle: "automatic"`

---

## Anti-Patterns to Avoid

❌ **No relative imports** → Always use `@/` alias
❌ **No inline styles for non-trivial styling** → Extract to `*.styles.ts`
❌ **No hardcoded color/spacing/typography values** → Use `src/theme` tokens
❌ **No FlatList or ScrollView for lists** → Use FlashList
❌ **No `useMemo`/`useCallback`** → React Compiler handles it; only add after profiling
❌ **No `runOnJS` in animations** → Keep animations on UI thread via Reanimated worklets
❌ **No barrel-export hubs** → Import directly from source files
❌ **No domain logic in `app/`** → Screens are composition only
❌ **No enums** → Use `const` maps or union types
❌ **No multiple components per file** → One component per file; use `components/` subfolder for screen-local sub-components
❌ **No `console.log` in production** → Remove before finishing

---

## Performance Guidelines

- ✅ Use **FlashList** for all virtualized/scrollable lists
- ✅ Keep animations on the **UI thread** via Reanimated worklets
- ✅ Profile before optimizing — use React DevTools (`j` in Metro)
- ✅ Clamp pan/zoom bounds defensively
- ❌ Don't add `useMemo`/`useCallback` speculatively

For deep performance work see [`skills/react-native-best-practices/POWER.md`](skills/react-native-best-practices/POWER.md).

---

## Security Guidelines

- ✅ Use HTTPS for all API calls
- ✅ Validate user input at system boundaries
- ❌ Never log sensitive data
- ❌ Never commit secrets or API keys

---

## Accessibility Requirements

- ✅ All pressable controls: `accessibilityRole`, `accessibilityLabel`, state where relevant
- ✅ Minimum touch target: 44×44pt
- ✅ Use `SafeAreaProvider` globally; safe-area-aware containers for all screens
- ✅ Preserve dark/light mode support in all visual components

---

## Architecture Boundaries

- `app/` screens are composition only — no XML/SVG parsing, no domain logic
- Do not introduce barrel-export hubs; import directly from source files
- If a change crosses layers, keep all interfaces typed and explicit
- Treat `topo-preview-ui-decision.md` as source of truth for topo flow behavior — update it when changing snap points, fullscreen behavior, loading UX, or sheet flow

---

## GitHub Workflow

Use `gh` CLI for all GitHub operations. For merging stacked PRs see [`skills/github/references/stacked-pr-workflow.md`](skills/github/references/stacked-pr-workflow.md).

---

**Last Updated:** 2026-04-06
**Maintained By:** jakubzielinski
