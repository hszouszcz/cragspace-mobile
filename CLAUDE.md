# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

## Architecture

Rock-World is a React Native + Expo climbing route discovery app. Core stack: **Expo Router** (file-based routing), **React Native Reanimated** (animations), **Gesture Handler** (pinch/pan), **FlashList** (lists), **@gorhom/bottom-sheet**, **react-native-svg**.

### Layer Structure

| Layer                               | Responsibility                                                   |
| ----------------------------------- | ---------------------------------------------------------------- |
| `app/`                              | Expo Router screens and route composition only — no domain logic |
| `features/<Name>/`                  | Feature-scoped UI, hooks, and types                              |
| `components/ui/`                    | Shared design-system primitives                                  |
| `hooks/`                            | Cross-feature reusable state and interaction logic               |
| `services/`                         | Data loading, parsing, and integration utilities                 |
| `src/theme/` + `constants/theme.ts` | Design tokens and style system                                   |

Key screens: `app/(tabs)/` tab nav, `app/search/index.tsx` (generic search, receives `SearchContextConfig` via route params), `app/TopoView.tsx` (main topo viewer).

Key features: `SearchBar/` (animated header, filter chips, `useSearchFiltersState`), `TopoPreview/` (SVG path loading, animations), `TopoBottomSheet/` (sheet navigator, route list).

### File Placement

| Creating                         | Put it in                    |
| -------------------------------- | ---------------------------- |
| New screen route                 | `app/...`                    |
| Reusable UI primitive            | `components/ui/...`          |
| Feature-specific view or state   | `features/<FeatureName>/...` |
| Data transform / loader / parser | `services/...`               |
| Cross-screen reusable logic      | `hooks/...`                  |

### Key Patterns

- **State management:** Custom React hooks only (no Redux/Zustand). Reanimated `useSharedValue` for animation state.
- **Search configuration:** The search screen is generic — callers pass `SearchContextConfig` via route params to define which filters appear.
- **Topo rendering:** SVG paths are parsed from XML at runtime via `fast-xml-parser` and rendered as `react-native-svg` overlays on top of topo images.
- **Path alias:** `@/*` maps to the repo root (e.g., `@/components/ui/Button`).

## Coding Standards

### Delivery

- Preserve existing behavior unless the task explicitly asks for changes.
- Prefer small, focused edits over broad refactors.
- Use `@/` alias for all local module imports — never relative `../../` paths.
- Remove all debug artifacts before finishing: `console.log`, temporary buttons, demo/random generators.
- Do not add placeholder or demo logic in production code paths.
- When behavior changes, update nearby docs in the same change set.

### Quality Gates

- Keep TypeScript strictness intact — do not introduce `any` without strong justification.
- Avoid enums; prefer `const` maps or union types.
- Ensure lint is clean for all touched files before finishing (`npm run lint`).
- Add or update tests for non-trivial logic in `services/topo` and `hooks/topo`.
- Keep error handling explicit with actionable messages.
- Prefer early returns over nested conditionals; avoid unnecessary `else`.
- Respect commit conventions and hooks (Husky + commitlint).

### Architecture Boundaries

- `app/` screens are composition only — no XML/SVG parsing, no domain logic.
- Do not introduce barrel-export hubs; import directly from source files.
- If a change crosses layers, keep all interfaces typed and explicit.

### Theme & Styling

- Use tokens from `src/theme` / `constants/theme.ts` — never hardcode color, spacing, or typography literals.
- Extract non-trivial inline styles into a co-located `*.styles.ts` file.
- Do not add new theme entrypoints; reuse existing canonical imports.
- Always preserve dark/light mode support when editing visual components.
- Inline styles are acceptable only for minimal, obvious one-off layout wrappers.

### Components & Accessibility

- Use functional components with explicitly typed props interfaces (`interface`, not `type` alias).
- Favor named exports.
- For pressable controls, include `accessibilityRole`, `accessibilityLabel`, and state where relevant.
- Use `SafeAreaProvider` globally; use safe-area-aware containers for all screens.
- Prefer composition and small helpers over monolithic components.
- Remove dead code, temporary UI, and unused styles in the same change.

### Routing & Navigation

- Use Expo Router file-based routes for app-level navigation in `app/`.
- Keep `app/_layout.tsx` as global provider / root-stack wiring only.
- Nested React Navigation is allowed only for isolated feature flows (e.g. bottom-sheet internal stack).
- Keep route params typed and stable; avoid ad-hoc string keys.

### Topo, Gestures & Animations

- Keep SVG/XML parsing deterministic in `services/topo` — no random IDs or attributes in production paths.
- Keep gesture and zoom behavior predictable; do not auto-reset after a manual user interaction.
- Clamp transforms and pan/zoom bounds defensively.
- Use `react-native-reanimated` and Gesture Handler patterns already in the project; do not use deprecated `runOnJS`.
- Do not add `useMemo` or `useCallback` — React Compiler handles memoization automatically; only add if profiling proves necessity.
- When changing interaction semantics, update `topo-preview-ui-decision.md` and related tests.

### Lists & Performance

- Use **FlashList** (not FlatList/ScrollView) for all virtualized or scrollable lists.
- Keep animations on the **UI thread** via Reanimated worklets — never run animation logic on the JS thread.
- **Profile before optimizing** — use React DevTools (`j` in Metro) and Xcode/Android Studio profilers.

For deep performance work see [`skills/react-native-best-practices/POWER.md`](skills/react-native-best-practices/POWER.md).

### Documentation Sync

- Treat `topo-preview-ui-decision.md` as source of truth for topo flow behavior.
- If code changes snap points, fullscreen behavior, loading UX, or sheet flow — update decision docs in the same task.
- Use concrete behavioral language; call out intentional deviations from prior decisions explicitly.

## GitHub Workflow

Use `gh` CLI for all GitHub operations. For merging stacked PRs see [`skills/github/references/stacked-pr-workflow.md`](skills/github/references/stacked-pr-workflow.md).
