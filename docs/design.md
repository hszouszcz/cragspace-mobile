# Design System — Strava-Inspired Visual Language

> **Audience**: Developers & designers building UI components, views, and features.
> **Theme tokens**: All visual values reference `src/theme/` — import from `@/src/theme`.

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Spacing & Layout Grid](#4-spacing--layout-grid)
5. [Elevation & Shadows](#5-elevation--shadows)
6. [Iconography](#6-iconography)
7. [Core Components](#7-core-components)
   - [Buttons](#71-buttons)
   - [Cards](#72-cards)
   - [List Items / Rows](#73-list-items--rows)
   - [Badges & Pills](#74-badges--pills)
   - [Inputs & Search](#75-inputs--search)
   - [Avatars](#76-avatars)
   - [Stat Blocks](#77-stat-blocks)
   - [Tabs & Tab Bar](#78-tabs--tab-bar)
   - [Bottom Sheets](#79-bottom-sheets)
   - [Modals & Dialogs](#710-modals--dialogs)
   - [Navigation Headers](#711-navigation-headers)
   - [Separators & Dividers](#712-separators--dividers)
   - [Empty States](#713-empty-states)
   - [Skeleton Loaders](#714-skeleton-loaders)
   - [Toasts & Snackbars](#715-toasts--snackbars)
   - [Toggle & Switches](#716-toggles--switches)
   - [Floating Action Button (FAB)](#717-floating-action-button-fab)
8. [Interaction & Motion](#8-interaction--motion)
9. [Dark Mode](#9-dark-mode)
10. [Accessibility](#10-accessibility)
11. [Token Quick Reference](#11-token-quick-reference)

---

## 1. Design Philosophy

The visual language draws from Strava's athletic, achievement-driven identity. Every design decision reinforces three principles:

### 1.1 Clarity Over Decoration

Strava strips away ornament. Surfaces are flat. Content does the talking. No gradients on backgrounds, no border treatments on cards unless functionally meaningful. White space is the primary compositional tool.

### 1.2 Bold & Confident

Typography leans heavy — semibold and bold dominate. There are no thin or light weights anywhere in the system. The brand orange (`palette.orange500` / `#FC4C02`) appears in small, high-impact doses: a button, a badge, an active tab dot. It never fills a large surface — its power comes from scarcity.

### 1.3 Data-Forward

Numbers are heroes. Stats are large, prominent, bold. Labels beneath them are tiny uppercase with wide letter-spacing. Strava treats data like a trophy — it's meant to be displayed, compared, and celebrated.

---

## 2. Color System

### 2.1 Brand Color Use

| Usage                      | Token                 | Value                                |
| -------------------------- | --------------------- | ------------------------------------ |
| Primary CTA, active states | `brandPrimary`        | `#FC4C02`                            |
| Pressed primary button     | `brandPrimaryPressed` | `#E04300` (light) / `#FF7A2E` (dark) |
| Muted brand background     | `brandPrimaryMuted`   | `#FFF4EC` (light) / `#5C1D00` (dark) |

**Rule**: Never use `brandPrimary` as a large-area background fill. It's reserved for:

- Primary buttons
- Active tab indicator
- Badge backgrounds (KOM, achievement)
- Inline brand accents (highlighted count, active filter indicator)

### 2.2 Surface Hierarchy

The app communicates depth through layered surfaces, not borders or outlines.

**Light mode** — three layers:

```
┌─── backgroundSecondary (#F7F7FA) ─── screen canvas ───────────────────┐
│                                                                        │
│   ┌─── backgroundPrimary (#FFFFFF) ─── card surface ────────────┐      │
│   │                                                              │      │
│   │   ┌── backgroundTertiary (#F0F0F5) ── inset area ──┐       │      │
│   │   │   Input field, grouped section bg               │       │      │
│   │   └─────────────────────────────────────────────────┘       │      │
│   │                                                              │      │
│   └──────────────────────────────────────────────────────────────┘      │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

**Dark mode** — three layers:

```
┌─── backgroundPrimary (#0A0A0B) ─── deepest layer ─────────────────────┐
│                                                                        │
│   ┌─── backgroundSecondary (#161618) ─── elevated ──────────────┐      │
│   │                                                              │      │
│   │   ┌── backgroundElevated (#1C1C1E) ── cards/sheets ──┐     │      │
│   │   │                                                    │     │      │
│   │   └────────────────────────────────────────────────────┘     │      │
│   │                                                              │      │
│   └──────────────────────────────────────────────────────────────┘      │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

### 2.3 Text Color Hierarchy

| Level     | Light Token     | Dark Token      | Usage                               |
| --------- | --------------- | --------------- | ----------------------------------- |
| Primary   | `textPrimary`   | `textPrimary`   | Headlines, names, titles, body text |
| Secondary | `textSecondary` | `textSecondary` | Timestamps, labels, metadata        |
| Tertiary  | `textTertiary`  | `textTertiary`  | Placeholders, disabled content      |
| Inverse   | `textInverse`   | `textInverse`   | On `brandPrimary` surfaces          |
| Link      | `textLink`      | `textLink`      | Tappable text links                 |

**Rule**: Every text element must use one of these five levels. If you can't decide, it's probably `textSecondary`.

### 2.4 Semantic / Feedback Colors

| State   | Token     | Muted Token    | When to use                                  |
| ------- | --------- | -------------- | -------------------------------------------- |
| Success | `success` | `successMuted` | Completed achievements, confirmed actions    |
| Warning | `warning` | `warningMuted` | Non-blocking caution, expiration notices     |
| Error   | `error`   | `errorMuted`   | Validation errors, destructive action alerts |
| Info    | `info`    | `infoMuted`    | Neutral informational banners, links         |

**Pattern**: Use the muted variant as the background and the base color as the text/icon color within feedback banners.

```
┌──────────────────────────────────────────┐
│  ⚠  warningMuted background              │
│     warning text color                    │
│     "Your subscription expires in 3 days" │
└──────────────────────────────────────────┘
```

---

## 3. Typography

### 3.1 Type Scale Summary

All presets are accessible via `typeScale.*` and include `fontFamily`, `fontSize`, `lineHeight`, `fontWeight`, and `letterSpacing`.

| Token        | Size | Weight | Use Case                               |
| ------------ | ---- | ------ | -------------------------------------- |
| `heroStat`   | 44   | 800    | Profile hero numbers (total km, hours) |
| `displayLg`  | 34   | 700    | Onboarding/welcome headlines           |
| `displaySm`  | 28   | 700    | Screen titles, modal headers           |
| `headlineLg` | 22   | 700    | Section headers on scrollable screens  |
| `headlineSm` | 20   | 600    | Card titles, content block titles      |
| `titleLg`    | 17   | 600    | List row primary text, nav bar title   |
| `titleSm`    | 15   | 600    | Compact list row primary text          |
| `bodyLg`     | 17   | 400    | Paragraph body text, descriptions      |
| `bodySm`     | 15   | 400    | Secondary body, comments               |
| `labelLg`    | 15   | 500    | Button labels, form field labels       |
| `labelSm`    | 13   | 500    | Badges, timestamps, captions           |
| `captionLg`  | 13   | 400    | Small descriptions, helper text        |
| `captionSm`  | 11   | 400    | Legal, footnotes, micro text           |
| `stat`       | 20   | 700    | Inline stat values in cards            |
| `statLabel`  | 11   | 500    | Uppercase stat labels ("DISTANCE")     |
| `mono`       | 17   | 500    | Timer, pace, numeric displays          |
| `monoSm`     | 13   | 500    | Small numeric displays                 |
| `tabLabel`   | 10   | 500    | Tab bar labels                         |

### 3.2 Hierarchy Rules

1. **One `displaySm` or `displayLg` per screen** — never stack two display-level headings.
2. **Section headers use `headlineLg`** with `textPrimary` color.
3. **Card titles use `headlineSm` or `titleLg`** depending on card prominence.
4. **Body text always uses `bodyLg` or `bodySm`** — never repurpose a title style for body.
5. **Stat blocks**: `stat` for the value + `statLabel` for the label below. Always center-aligned within their column.
6. **Timestamps**: `labelSm` + `textSecondary` (e.g., "2h ago", "Yesterday").
7. **All-caps text**: Only for `statLabel` and contextual labels (e.g., filter chip categories). Never for headings or buttons.

### 3.3 Text Truncation

- **Titles in lists**: Single line, ellipsis at end (`numberOfLines={1}`).
- **Descriptions**: Max 2 lines in cards, expandable in detail views.
- **Stat values**: Never truncate — if they don't fit, reduce `fontSize` by one step.

---

## 4. Spacing & Layout Grid

### 4.1 The 4px Grid

Every dimension in the app must be a multiple of 4. The `spacing` scale provides named stops:

| Token | Value | Primary Use                                      |
| ----- | ----- | ------------------------------------------------ |
| `xxs` | 2px   | Hairline adjustments (icon optical alignment)    |
| `xs`  | 4px   | Icon-to-text gap, tight inline pairs             |
| `sm_` | 6px   | Badge internal padding                           |
| `sm`  | 8px   | Compact row padding, tight element gaps          |
| `md`  | 12px  | Standard sibling gap, list item vertical padding |
| `lg`  | 16px  | Card padding, screen horizontal margin           |
| `xl`  | 20px  | Section top margin                               |
| `2xl` | 24px  | Large section breaks, header bottom margins      |
| `3xl` | 32px  | Hero section padding, prominent separations      |
| `4xl` | 40px  | Modal internal top spacing                       |
| `5xl` | 48px  | Empty state illustration gap                     |
| `6xl` | 64px  | Large vertical safe zones                        |

### 4.2 Screen Layout

```
┌──────────────────────────────────────┐
│         ← Safe Area Top →            │
│  ┌──────────────────────────────┐    │
│  │← lg (16) →  CONTENT  ← lg →│    │  ← Screen horizontal padding
│  │                              │    │
│  │  ┌────────────────────────┐  │    │
│  │  │       CARD             │  │    │
│  │  │ ← lg (16) internal →  │  │    │  ← Card internal padding
│  │  └────────────────────────┘  │    │
│  │         ↕ md (12)            │    │  ← Gap between cards
│  │  ┌────────────────────────┐  │    │
│  │  │       CARD             │  │    │
│  │  └────────────────────────┘  │    │
│  │                              │    │
│  └──────────────────────────────┘    │
│         ← Safe Area Bottom →         │
└──────────────────────────────────────┘
```

**Key dimensions**:

- Screen horizontal padding: `spacing.lg` (16px)
- Card internal padding: `spacing.lg` (16px)
- Gap between sibling cards: `spacing.md` (12px)
- Section header top margin: `spacing.xl` (20px)
- Section header bottom margin: `spacing.sm` (8px)
- Bottom safe area + tab bar: `sizes.tabBarHeight` (49px) + safe area inset

### 4.3 Border Radius

| Token  | Value | Where                                          |
| ------ | ----- | ---------------------------------------------- |
| `none` | 0     | Full-bleed images, dividers                    |
| `xs`   | 4     | Inline tags, minor chips                       |
| `sm`   | 8     | Badges, grade pills, image thumbnails in cards |
| `md`   | 10    | Input fields                                   |
| `lg`   | 12    | Cards, activity cards, grouped containers      |
| `xl`   | 16    | Modals, large dialog boxes                     |
| `2xl`  | 20    | Bottom sheets (top corners only)               |
| `3xl`  | 24    | Large onboarding cards                         |
| `full` | 999   | Buttons (pill), avatars, search bars, pills    |

**Rule**: A child element's radius should never exceed its parent's radius. If a card has `radii.lg` (12), a thumbnail inside it should use `radii.sm` (8) or less.

---

## 5. Elevation & Shadows

### 5.1 Light Mode

Use shadows to create physical depth. Strava uses very subtle, cool-toned shadows.

| Token          | Context                                    |
| -------------- | ------------------------------------------ |
| `shadows.none` | Flat elements, dark mode everything        |
| `shadows.sm`   | Subtle: small cards, list group containers |
| `shadows.md`   | Standard: activity cards, content cards    |
| `shadows.lg`   | Elevated: modals, FABs, floating elements  |
| `shadows.xl`   | Prominent: bottom sheets, overlay menus    |

### 5.2 Dark Mode

**No shadows**. Elevation is communicated exclusively through surface color steps:

```
Lowest:    backgroundPrimary   (#0A0A0B)   — screen bg
Middle:    backgroundSecondary (#161618)    — slightly raised
Highest:   backgroundElevated  (#1C1C1E)   — cards, sheets, modals
```

### 5.3 Implementation Rule

```tsx
// Always conditionally apply shadows
const cardShadow = colorScheme === 'dark' ? shadows.none : shadows.md;
```

---

## 6. Iconography

### 6.1 Style

- **Line icons** — consistent 1.5px stroke weight on a 24×24 grid (`sizes.iconLg`).
- **Filled variants** only for active/selected states (e.g., filled heart for kudos given, filled tab icon for active tab).
- Use SF Symbols on iOS and Material Icons on Android for system consistency.

### 6.2 Sizes

| Token    | Size | Usage                                           |
| -------- | ---- | ----------------------------------------------- |
| `iconSm` | 16   | Inline with small text, badge adornments        |
| `iconMd` | 20   | Inline with body text, compact list rows        |
| `iconLg` | 24   | Standard list rows, nav bar buttons, card icons |
| `iconXl` | 28   | Tab bar icons, prominent action icons           |

### 6.3 Colors

| State        | Token           |
| ------------ | --------------- |
| Default      | `iconSecondary` |
| Active/brand | `iconBrand`     |
| On white     | `iconPrimary`   |
| Disabled     | `iconTertiary`  |
| On brand bg  | `iconInverse`   |

---

## 7. Core Components

### 7.1 Buttons

Strava uses two button tiers plus a text-link variant.

#### Primary Button (Pill)

```
┌─────────────────────────────┐
│       Start Activity        │   48px tall, full pill radius
└─────────────────────────────┘
```

| Property           | Value                                        |
| ------------------ | -------------------------------------------- |
| Height             | `sizes.buttonLg` (48px)                      |
| Border radius      | `radii.full` (999px)                         |
| Background         | `brandPrimary`                               |
| Background pressed | `brandPrimaryPressed`                        |
| Text style         | `typeScale.labelLg`                          |
| Text color         | `textInverse` (always white)                 |
| Horizontal padding | `spacing.2xl` (24px)                         |
| Min width          | 120px                                        |
| Shadow             | `shadows.sm` (light) / `shadows.none` (dark) |

**Pressed state**: Background shifts to `brandPrimaryPressed` + scale down to `transform: scale(0.97)` with a 100ms spring animation.

**Disabled**: Reduce entire button opacity to `disabledOpacity` (0.38). Do NOT change colors.

#### Secondary Button (Ghost Pill)

```
┌─────────────────────────────┐
│       Edit Profile          │   36px tall, outlined or transparent
└─────────────────────────────┘
```

| Property           | Value                   |
| ------------------ | ----------------------- |
| Height             | `sizes.buttonSm` (36px) |
| Border radius      | `radii.full`            |
| Background         | transparent             |
| Border             | 1.5px `borderStrong`    |
| Text style         | `typeScale.labelSm`     |
| Text color         | `textPrimary`           |
| Horizontal padding | `spacing.lg` (16px)     |

**Pressed state**: Background fills with `pressedOverlay`.

#### Text Button / Link

No container. Inline text only.

| Property      | Value                 |
| ------------- | --------------------- |
| Text style    | `typeScale.labelLg`   |
| Text color    | `brandPrimary`        |
| Pressed color | `brandPrimaryPressed` |

### 7.2 Cards

Cards are the primary content container. They hold activities, suggestions, challenges, etc.

#### Anatomy

```
┌──────────────────────────────────────────┐
│  ┌──┐                                    │
│  │AV│  Athlete Name            2h ago    │  ← Header row
│  └──┘  Location                          │
│──────────────────────────────────────────│
│                                          │
│  [FULL-WIDTH IMAGE / MAP]                │  ← Media (bleeds to card edges)
│                                          │
│──────────────────────────────────────────│
│  Activity Title                          │  ← Title
│                                          │
│  12.4 km      52 min      120 m         │  ← Stat row
│  DISTANCE     TIME        ELEV GAIN     │
│                                          │
│  ♡ 24    💬 3                            │  ← Social row
└──────────────────────────────────────────┘
```

| Property                | Value                                           |
| ----------------------- | ----------------------------------------------- |
| Background              | `surfaceCard`                                   |
| Border radius           | `radii.lg` (12px)                               |
| Shadow (light)          | `shadows.md`                                    |
| Shadow (dark)           | `shadows.none`                                  |
| Internal padding        | `spacing.lg` (16px) — except media which bleeds |
| Media border radius     | 0 (bleeds) or `radii.sm` (8px) if inset         |
| Header row avatar       | `sizes.avatarMd` (40px)                         |
| Header row gap          | `spacing.md` (12px) between avatar and text     |
| Stat row gap            | `spacing.lg` (16px) between stat groups         |
| Separator between areas | `separator` color, `sizes.separatorHeight`      |
| Card-to-card gap        | `spacing.md` (12px)                             |

#### Card Pressed State

The entire card dims slightly:

```tsx
{
  opacity: 0.92,
  transform: [{ scale: 0.99 }],
}
// Animated with 80ms ease-out
```

### 7.3 List Items / Rows

Two variants: **standard** and **compact**.

#### Standard Row

```
┌──────────────────────────────────────────┐
│  [Icon/Avatar]   Primary text     [>]    │  56px tall
│                  Secondary text          │
└──────────────────────────────────────────┘
```

| Property            | Value                                                    |
| ------------------- | -------------------------------------------------------- |
| Height              | 56px minimum (content-driven)                            |
| Horizontal padding  | `spacing.lg` (16px)                                      |
| Vertical padding    | `spacing.md` (12px)                                      |
| Leading icon/avatar | `sizes.iconLg` (24px) or `sizes.avatarMd` (40px)         |
| Gap: leading → text | `spacing.md` (12px)                                      |
| Primary text        | `typeScale.titleLg` + `textPrimary`                      |
| Secondary text      | `typeScale.bodySm` + `textSecondary`                     |
| Trailing chevron    | `iconSecondary`, `sizes.iconMd` (20px)                   |
| Separator inset     | `spacing.lg` (16px) from left, or 56px if avatar present |
| Separator color     | `separator`                                              |
| Pressed bg          | `pressedOverlay`                                         |

#### Compact Row

```
┌──────────────────────────────────────────┐
│  [#]  Title text    [Badge]   [Chevron]  │  44px tall
└──────────────────────────────────────────┘
```

| Property         | Value                       |
| ---------------- | --------------------------- |
| Height           | `sizes.minTapTarget` (44px) |
| Primary text     | `typeScale.titleSm`         |
| Vertical padding | `spacing.sm` (8px)          |

### 7.4 Badges & Pills

#### Primary Badge (Brand)

```
┌──────────┐
│  KOM     │   Orange bg, white text
└──────────┘
```

| Property      | Value                        |
| ------------- | ---------------------------- |
| Background    | `badgePrimaryBg` (`#FC4C02`) |
| Text color    | `badgePrimaryText` (white)   |
| Text style    | `typeScale.labelSm`          |
| Padding H     | `spacing.sm` (8px)           |
| Padding V     | `spacing.xs` (4px)           |
| Border radius | `radii.sm` (8px)             |
| Min height    | 24px                         |

#### Secondary Badge (Neutral)

```
┌──────────┐
│  5c      │   Gray bg, dark text
└──────────┘
```

| Property      | Value                |
| ------------- | -------------------- |
| Background    | `badgeSecondaryBg`   |
| Text color    | `badgeSecondaryText` |
| Text style    | `typeScale.labelSm`  |
| Padding H     | `spacing.sm` (8px)   |
| Padding V     | `spacing.xs` (4px)   |
| Border radius | `radii.sm` (8px)     |

#### Filter Pill (Toggleable)

```
  Inactive:  ┌──────────┐       Active:  ┌──────────┐
             │ Distance  │                │ Distance  │
             └──────────┘                └──────────┘
             transparent bg               brandPrimaryMuted bg
             borderDefault border         borderBrand border
             textSecondary                brandPrimary text
```

| State    | Background          | Border          | Text            |
| -------- | ------------------- | --------------- | --------------- |
| Inactive | transparent         | `borderDefault` | `textSecondary` |
| Active   | `brandPrimaryMuted` | `borderBrand`   | `brandPrimary`  |

Height: `sizes.buttonSm` (36px). Radius: `radii.full`.

### 7.5 Inputs & Search

#### Text Input

```
┌────────────────────────────────────────┐
│  🔍  Search routes, sectors…          │   44px tall
└────────────────────────────────────────┘
```

| Property           | Value                                    |
| ------------------ | ---------------------------------------- |
| Height             | `sizes.inputHeight` (44px)               |
| Background         | `surfaceInput`                           |
| Background focused | `surfaceInputFocused`                    |
| Border (rest)      | none                                     |
| Border (focused)   | 1.5px `borderBrand`                      |
| Border radius      | `radii.md` (10px)                        |
| Text style         | `typeScale.bodyLg`                       |
| Placeholder color  | `textTertiary`                           |
| Padding H          | `spacing.md` (12px)                      |
| Leading icon       | `iconSecondary`, `sizes.iconMd` (20px)   |
| Clear button       | `iconTertiary`, appears when has content |

#### Search Bar (Pill Variant)

Used in headers and prominent positions. Same specs as input but with `radii.full` (999px) radius and always-visible search icon.

### 7.6 Avatars

Always circular (`radii.full`). White border in contexts where they overlap other content (e.g., on a cover photo).

| Token        | Size  | Usage                                  |
| ------------ | ----- | -------------------------------------- |
| `avatarXs`   | 24px  | Tiny indicator, inline mentions        |
| `avatarSm`   | 32px  | Comments, compact lists                |
| `avatarMd`   | 40px  | Activity card header, standard lists   |
| `avatarLg`   | 56px  | Profile list, follower/following grids |
| `avatarXl`   | 80px  | Profile header, user detail            |
| `avatarHero` | 120px | Own profile hero, onboarding           |

**Border when overlapping**: 2px white (`palette.white`) in light mode, 2px `backgroundElevated` in dark mode.

**Placeholder**: `backgroundTertiary` bg with `iconTertiary` person silhouette icon centered.

### 7.7 Stat Blocks

The signature Strava data display pattern. A vertical stack of value + label, arranged horizontally.

```
    12.4 km          52:30           120 m
    DISTANCE          TIME          ELEV GAIN
```

#### Single Stat Anatomy

```
┌───────────┐
│   12.4    │  ← typeScale.stat / textPrimary
│           │
│ DISTANCE  │  ← typeScale.statLabel / textSecondary
└───────────┘
```

| Property          | Value                                   |
| ----------------- | --------------------------------------- |
| Value text        | `typeScale.stat` + `textPrimary`        |
| Label text        | `typeScale.statLabel` + `textSecondary` |
| Label transform   | `uppercase` (built into statLabel)      |
| Alignment         | Center horizontally within column       |
| Gap (value→label) | `spacing.xs` (4px)                      |

#### Stat Row Layout

| Property       | Value                                 |
| -------------- | ------------------------------------- |
| Horizontal gap | `spacing.lg` (16px)                   |
| Distribution   | `flex: 1` per stat item (equal width) |
| Alignment      | Center all items                      |
| Row padding H  | `spacing.lg` (16px)                   |

#### Hero Stat Variant

For profile pages where stats are the focal point:

```
    1,247           89:12:34
      km               hrs
```

| Property   | Value                                 |
| ---------- | ------------------------------------- |
| Value text | `typeScale.heroStat` + `textPrimary`  |
| Label text | `typeScale.labelSm` + `textSecondary` |

### 7.8 Tabs & Tab Bar

#### Bottom Tab Bar

```
┌──────────────────────────────────────────┐
│                                          │
│   🏠        🔍        👤        ⋯       │
│  Home    Explore    Profile    More      │
│                                          │
│          ● (active dot)                  │
└──────────────────────────────────────────┘
```

| Property            | Value                                                      |
| ------------------- | ---------------------------------------------------------- |
| Background          | `tabBarBackground`                                         |
| Top border          | 0.5px `tabBarBorder`                                       |
| Height              | `sizes.tabBarHeight` (49px) + safe area                    |
| Active icon color   | `tabBarActive` (`#FC4C02`)                                 |
| Inactive icon color | `tabBarInactive`                                           |
| Icon size           | `sizes.iconXl` (28px)                                      |
| Label style         | `typeScale.tabLabel`                                       |
| Active indicator    | 4px diameter dot centered below icon, `tabBarActive` color |

**Rule**: Active state is communicated through both color change AND an indicator dot — not just color alone — for accessibility.

#### Segmented Control / Inline Tabs

For switching between views within a screen (e.g., "Map" / "List" / "Chart").

```
┌────────────────────────────────────────┐
│  [  Map  ]  [  List  ]  [  Chart  ]   │
└────────────────────────────────────────┘
```

| Property          | Value                                               |
| ----------------- | --------------------------------------------------- |
| Active segment bg | `surfaceCard` (light) / `backgroundElevated` (dark) |
| Active text       | `textPrimary`                                       |
| Inactive text     | `textSecondary`                                     |
| Container bg      | `backgroundTertiary`                                |
| Container radius  | `radii.sm` (8px)                                    |
| Segment radius    | `radii.sm_` (6px rounded inside)                    |
| Height            | `sizes.buttonSm` (36px)                             |
| Text style        | `typeScale.labelSm`                                 |
| Animation         | Sliding background, 200ms spring                    |

### 7.9 Bottom Sheets

The primary overlay surface for drill-down content, filters, and detail views.

#### Anatomy

```
┌──────────────────────────────────────────┐  ← radii.2xl (20px) top corners
│                ╌╌╌╌╌╌                    │  ← Handle bar
│                                          │
│  Sheet Title                      Done   │  ← Header (optional)
│─────────────────────────────────────────│
│                                          │
│  Scrollable content area                 │
│                                          │
│                                          │
└──────────────────────────────────────────┘
```

| Property              | Value                                        |
| --------------------- | -------------------------------------------- |
| Background            | `surfaceSheet`                               |
| Top corner radius     | `radii.2xl` (20px)                           |
| Handle bar width      | `sizes.handleWidth` (36px)                   |
| Handle bar height     | `sizes.handleHeight` (4px)                   |
| Handle bar color      | `separatorOpaque`                            |
| Handle bar radius     | `radii.full`                                 |
| Handle bar top margin | `spacing.sm` (8px)                           |
| Shadow                | `shadows.xl` (light) / `shadows.none` (dark) |
| Overlay behind sheet  | `surfaceOverlay`                             |
| Content padding H     | `spacing.lg` (16px)                          |

**Snap points**: Use 3 snap positions (collapsed, half, full). The collapsed state should show just the handle + a peek of the header content.

**Gesture**: Sheet follows finger with 1:1 tracking. Releasing with velocity > threshold snaps to next point. Overdrag has rubber-band resistance.

### 7.10 Modals & Dialogs

#### Full-Screen Modal

Slides up from bottom on iOS, fades in on Android.

| Property        | Value                                                  |
| --------------- | ------------------------------------------------------ |
| Background      | `backgroundPrimary`                                    |
| Corner radius   | `radii.xl` (16px) top only                             |
| Close button    | Top-left or top-right, `iconSecondary`, `sizes.iconLg` |
| Title style     | `typeScale.displaySm`                                  |
| Content padding | `spacing.lg` (16px)                                    |

#### Alert Dialog

```
┌──────────────────────────────┐
│                              │
│   Delete Route?              │  ← displaySm
│                              │
│   This action cannot be      │  ← bodySm + textSecondary
│   undone.                    │
│                              │
│   ┌──────┐    ┌──────────┐  │
│   │Cancel│    │  Delete  │  │  ← Secondary + Destructive
│   └──────┘    └──────────┘  │
│                              │
└──────────────────────────────┘
```

| Property                 | Value                |
| ------------------------ | -------------------- |
| Background               | `surfaceCard`        |
| Radius                   | `radii.xl` (16px)    |
| Overlay                  | `surfaceOverlay`     |
| Shadow                   | `shadows.lg`         |
| Padding                  | `spacing.2xl` (24px) |
| Destructive button color | `error`              |
| Button gap               | `spacing.md` (12px)  |
| Max width                | 320px                |

### 7.11 Navigation Headers

#### Standard Header

```
┌──────────────────────────────────────────┐
│  ←     Screen Title                      │
└──────────────────────────────────────────┘
```

| Property           | Value                                |
| ------------------ | ------------------------------------ |
| Background         | `backgroundPrimary` (opaque)         |
| Bottom border      | `separator`, `sizes.separatorHeight` |
| Title style        | `typeScale.titleLg`                  |
| Title alignment    | Center (iOS) / Left (Android)        |
| Back icon          | `iconPrimary`, `sizes.iconLg`        |
| Height             | 44px (content) + safe area inset     |
| Horizontal padding | `spacing.lg` (16px)                  |

#### Large Title Header (Scrollable)

On scroll, the large title collapses into the standard compact header.

| State     | Title Style           | Position                |
| --------- | --------------------- | ----------------------- |
| Expanded  | `typeScale.displaySm` | Below bar, left-aligned |
| Collapsed | `typeScale.titleLg`   | Center of bar           |

**Transition**: Title cross-fades and translates up during scroll. The threshold is when the large title would scroll under the bar (approximately 44px of scroll offset).

### 7.12 Separators & Dividers

| Variant  | Token                | Height                          | Usage                    |
| -------- | -------------------- | ------------------------------- | ------------------------ |
| Standard | `separator`          | `sizes.separatorHeight` (0.5px) | Between list rows        |
| Opaque   | `separatorOpaque`    | `sizes.separatorHeight`         | When bg is transparent   |
| Section  | `backgroundTertiary` | `spacing.sm` (8px)              | Between content sections |

**Inset rules**:

- Default: Full width
- With leading element: Inset left by leading element width + gap (e.g., 16 + 40 + 12 = 68px for avatar rows)
- Never inset from the right

### 7.13 Empty States

```
┌──────────────────────────────────────────┐
│                                          │
│                                          │
│            [ Illustration ]              │  ← 120×120, centered
│              ↕ spacing.2xl               │
│         No routes found                  │  ← headlineSm + textPrimary
│              ↕ spacing.sm                │
│      Try adjusting your filters          │  ← bodySm + textSecondary
│         or searching again               │
│              ↕ spacing.xl                │
│        ┌─────────────────┐               │
│        │   Clear Filters  │              │  ← Secondary button
│        └─────────────────┘               │
│                                          │
└──────────────────────────────────────────┘
```

| Property          | Value                                  |
| ----------------- | -------------------------------------- |
| Centered in       | Available scrollable area              |
| Illustration size | 120×120 or 160×160                     |
| Title             | `typeScale.headlineSm` + `textPrimary` |
| Description       | `typeScale.bodySm` + `textSecondary`   |
| Gap: illus→title  | `spacing.2xl` (24px)                   |
| Gap: title→desc   | `spacing.sm` (8px)                     |
| Gap: desc→button  | `spacing.xl` (20px)                    |

### 7.14 Skeleton Loaders

Skeleton shapes match the exact dimensions of the content they replace. Use animated shimmer (left→right gradient pulse).

| Property        | Value                                                |
| --------------- | ---------------------------------------------------- |
| Base color      | `skeletonBase`                                       |
| Highlight color | `skeletonHighlight`                                  |
| Border radius   | Same as the replaced element                         |
| Animation       | Shimmer: 1.2s duration, ease-in-out, infinite repeat |
| Pulse direction | Left to right, 30° angle                             |

**Skeleton anatomy should mirror real content exactly**:

```
┌──────────────────────────────────────────┐
│  ┌──┐  ████████████████        ██████    │  ← Avatar + name skeleton + time
│  └──┘  ████████████                      │
│──────────────────────────────────────────│
│  ████████████████████████████████████████│  ← Image skeleton (aspect ratio)
│  ████████████████████████████████████████│
│──────────────────────────────────────────│
│  ████████████████████████████            │  ← Title skeleton
│                                          │
│  ██████      ██████      ██████         │  ← Stat row skeleton
│  ████        ████        ████           │
└──────────────────────────────────────────┘
```

### 7.15 Toasts & Snackbars

Appear from the bottom, above the tab bar. Auto-dismiss after 4 seconds.

```
┌──────────────────────────────────────┐
│  ✓  Route saved to favorites   Undo  │
└──────────────────────────────────────┘
```

| Property        | Value                                        |
| --------------- | -------------------------------------------- |
| Background      | `gray900` (light) / `gray100` (dark)         |
| Text color      | `textInverse` (light) / `textPrimary` (dark) |
| Text style      | `typeScale.labelLg`                          |
| Action text     | `brandPrimary`                               |
| Border radius   | `radii.lg` (12px)                            |
| Padding H       | `spacing.lg` (16px)                          |
| Padding V       | `spacing.md` (12px)                          |
| Shadow          | `shadows.lg`                                 |
| Margin bottom   | `spacing.sm` (8px) above tab bar             |
| Margin H        | `spacing.lg` (16px)                          |
| Entry animation | Slide up + fade in, 250ms spring             |
| Exit animation  | Slide down + fade out, 200ms ease-out        |

### 7.16 Toggles & Switches

Follow platform-native appearance (iOS UISwitch, Android Material Switch).

| State    | Thumb Color     | Track Color                          |
| -------- | --------------- | ------------------------------------ |
| Off      | `palette.white` | `borderDefault`                      |
| On       | `palette.white` | `brandPrimary`                       |
| Disabled | `palette.white` | `borderDefault` at `disabledOpacity` |

### 7.17 Floating Action Button (FAB)

```
     ┌─────┐
     │  +  │   56×56, centered bottom-right
     └─────┘
```

| Property      | Value                               |
| ------------- | ----------------------------------- |
| Size          | 56×56                               |
| Border radius | `radii.full`                        |
| Background    | `brandPrimary`                      |
| Icon          | `iconInverse`, `sizes.iconLg`       |
| Shadow        | `shadows.lg`                        |
| Position      | 16px from right, 16px above tab bar |
| Pressed       | `brandPrimaryPressed` + scale(0.93) |

---

## 8. Interaction & Motion

### 8.1 Animation Principles

1. **Quick & responsive**: Most interactions complete in 150–300ms.
2. **Spring-based**: Use spring physics (not linear easing) for gestures so that elements feel physically weighted.
3. **Meaningful**: Animations communicate state changes — they are not decorative.
4. **Interruptible**: Every animation can be interrupted by a new gesture without jarring.

### 8.2 Specific Timings

| Interaction                        | Duration | Easing / Type                        |
| ---------------------------------- | -------- | ------------------------------------ |
| Button press feedback              | 100ms    | Ease-out                             |
| Card press scale                   | 80ms     | Ease-out                             |
| Card press release                 | 150ms    | Spring (damping: 15)                 |
| Screen push transition             | 350ms    | Spring (damping: 20, stiffness: 100) |
| Modal slide up                     | 350ms    | Spring (damping: 18)                 |
| Bottom sheet snap                  | 300ms    | Spring (damping: 20, stiffness: 120) |
| Tab switch content                 | 200ms    | Ease-in-out                          |
| List item appear (staggered)       | 200ms    | Fade + translateY(8px)               |
| Stagger delay between items        | 40ms     | —                                    |
| Skeleton shimmer cycle             | 1200ms   | Ease-in-out, loop                    |
| Toast enter                        | 250ms    | Spring                               |
| Toast exit                         | 200ms    | Ease-out                             |
| Shared element morph               | 350ms    | Spring (damping: 20)                 |
| Segmented control slide            | 200ms    | Spring                               |
| Pull-to-refresh spinner completion | 400ms    | Ease-out                             |

### 8.3 Gesture Behaviors

#### Scroll

- Standard deceleration rate: `normal` (0.998).
- Rubber-band overscroll on iOS (native). Clamp on Android.
- Content loads ahead of scroll position — no blank areas visible during scroll.

#### Swipe to Go Back

- Native iOS edge swipe. Enable on all stack screens.
- During drag: Previous screen parallaxes behind at 30% of drag distance (iOS default).

#### Pinch to Zoom (images/topos)

- Min scale: 1.0 (no zoom-out beyond original).
- Max scale: 5.0.
- Double-tap: Toggle between 1.0 and 2.5 scale, centered on tap point.
- Snaps back to 1.0 or max with spring when released below/above bounds.

#### Long Press

- Duration: 500ms before activating.
- Haptic: `impactMedium` at activation point.
- Visual: Element subtly lifts (scale 1.02 + shadow increase).

### 8.4 Haptic Feedback

| Action                    | Haptic Type           |
| ------------------------- | --------------------- |
| Tap card / row            | `selection`           |
| Pull-to-refresh trigger   | `impactMedium`        |
| Bottom sheet snap         | `impactLight`         |
| Successful action (save)  | `notificationSuccess` |
| Error action (validation) | `notificationError`   |
| Long press activation     | `impactMedium`        |
| Toggle switch             | `impactLight`         |
| Delete confirmation       | `impactHeavy`         |

---

## 9. Dark Mode

### 9.1 Principles

1. **No shadows in dark mode** — ever. Use surface color stepping only.
2. **Brand orange stays the same** — `#FC4C02` is identical in both modes.
3. **Text adjusts symmetrically** — primary text goes from near-black to near-white, secondary from medium gray to lighter gray.
4. **Images need no adjustment** — photos and topo images render identically. Only UI chrome changes.
5. **Semantic colors shift slightly** — green, red, etc. use the 400-weight variant (lighter) in dark mode for better contrast against dark backgrounds.

### 9.2 Surface Mapping

| Light Mode                       | Dark Mode                              |
| -------------------------------- | -------------------------------------- |
| `backgroundPrimary` #FFFFFF      | `backgroundPrimary` #0A0A0B            |
| `backgroundSecondary` #F7F7FA    | `backgroundSecondary` #161618          |
| `surfaceCard` #FFFFFF            | `surfaceCard` #1C1C1E                  |
| `surfaceSheet` #FFFFFF           | `surfaceSheet` #1C1C1E                 |
| `shadows.md`                     | `shadows.none`                         |
| `borderDefault` rgba(0,0,0,0.06) | `borderDefault` rgba(255,255,255,0.08) |

### 9.3 Implementation

Always resolve colors through the semantic token function:

```tsx
import { getColors } from '@/src/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const colors = getColors(colorScheme ?? 'light');
// Then use: colors.textPrimary, colors.surfaceCard, etc.
```

**Never hardcode hex values in components.** Always use tokens.

---

## 10. Accessibility

### 10.1 Color Contrast

All text/icon + background pairings must meet WCAG AA (4.5:1 for normal text, 3:1 for large text):

| Pairing                                        | Contrast | Passes |
| ---------------------------------------------- | -------- | ------ |
| `textPrimary` on `backgroundPrimary` (light)   | 16.2:1   | AA ✓   |
| `textSecondary` on `backgroundPrimary` (light) | 4.6:1    | AA ✓   |
| `textInverse` on `brandPrimary`                | 4.7:1    | AA ✓   |
| `textPrimary` on `backgroundPrimary` (dark)    | 15.8:1   | AA ✓   |
| `brandPrimary` on `backgroundPrimary` (light)  | 4.6:1    | AA ✓   |

### 10.2 Tap Targets

- Minimum tap target: `sizes.minTapTarget` (44×44px).
- If the visual element is smaller (e.g., 24px icon), extend the hit area with transparent padding.
- Minimum gap between adjacent tap targets: `spacing.sm` (8px).

### 10.3 Screen Reader

- All interactive elements must have an `accessibilityLabel`.
- Stat blocks: Combine value + label into one readable string (e.g., "12.4 kilometers distance").
- Star ratings: Announce "3 out of 5 stars" not just the visual.
- Decorative icons must be marked `accessibilityElementsHidden` / `importantForAccessibility="no"`.

### 10.4 Motion Sensitivity

- Respect `prefers-reduced-motion`. When active: replace spring animations with simple opacity fades (200ms), disable parallax, and reduce stagger effects.
- Skeleton shimmer can continue — it's considered a loading indicator, not decorative animation.

---

## 11. Token Quick Reference

### How to Import

```tsx
// Full theme object
import { theme } from '@/src/theme';
const c = theme.colors('dark');
const s = theme.spacing;

// Direct named imports
import { getColors, spacing, radii, typeScale, shadows } from '@/src/theme';
```

### Color Token Map

```
backgroundPrimary       Main screen background
backgroundSecondary     Canvas behind cards
backgroundTertiary      Inset / grouped areas
backgroundElevated      Cards, sheets, modals
surfaceCard             Card background
surfaceSheet            Bottom sheet background
surfaceInput            Input field background
surfaceOverlay          Overlay behind modals/sheets
textPrimary             Main text
textSecondary           Metadata, timestamps
textTertiary            Placeholders, disabled
textInverse             On brand-colored surfaces
textLink                Tappable links
brandPrimary            Primary CTAs, active states
brandPrimaryPressed     Pressed brand button
brandPrimaryMuted       Light brand tint bg
borderDefault           Standard borders
borderStrong            Emphasized borders
borderBrand             Active/selected borders
separator               List separators
iconPrimary             Default icons
iconSecondary           Secondary icons
iconBrand               Brand-colored icons
iconInverse             On brand surfaces
tabBarActive            Active tab indicator
tabBarInactive          Inactive tab icon
pressedOverlay          Tap feedback overlay
success / error /       Semantic feedback
warning / info
badgePrimaryBg/Text     Orange badge
badgeSecondaryBg/Text   Gray badge
skeletonBase/Highlight  Loading shimmer
```

### Spacing Quick Ref

```
xxs=2  xs=4  sm_=6  sm=8  md=12  lg=16  xl=20  2xl=24  3xl=32  4xl=40  5xl=48  6xl=64
```

### Radii Quick Ref

```
none=0  xs=4  sm=8  md=10  lg=12  xl=16  2xl=20  3xl=24  full=999
```

### Type Scale Quick Ref

```
heroStat(44)  displayLg(34)  displaySm(28)  headlineLg(22)  headlineSm(20)
titleLg(17)   titleSm(15)    bodyLg(17)      bodySm(15)      labelLg(15)
labelSm(13)   captionLg(13)  captionSm(11)   stat(20)        statLabel(11)
mono(17)      monoSm(13)     tabLabel(10)
```

### Sizes Quick Ref

```
Buttons:  buttonLg=48  buttonSm=36
Inputs:   inputHeight=44  minTapTarget=44
Avatars:  Xs=24  Sm=32  Md=40  Lg=56  Xl=80  Hero=120
Icons:    Sm=16  Md=20  Lg=24  Xl=28
Handle:   36×4
Tab bar:  49 + safe area
```

---

_This document is the single source of truth for visual implementation. When in doubt, reference the token values in `src/theme/`. Never hardcode colors, sizes, or font styles — always use tokens._
