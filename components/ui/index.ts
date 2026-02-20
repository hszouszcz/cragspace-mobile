/**
 * UI Component Library — Barrel Export
 * ─────────────────────────────────────
 *
 * All design-system-aligned UI primitives.
 * Import from `@/components/ui` for clean access.
 *
 * ```ts
 * import { Button, Card, Badge, Typography } from '@/components/ui';
 * ```
 */

// Theme hook
export { useCurrentScheme, useThemeColors } from './use-theme-colors';

// Core components
export { Avatar } from './avatar/avatar';
export { Badge } from './badge/badge';
export { Button } from './button/button';
export { Card, CardSeparator } from './card/card';
export { EmptyState } from './empty-state/empty-state';
export { FAB } from './fab/fab';
export { FilterPill } from './filter-pill/filter-pill';
export { ListItem, ListSeparator } from './list-item/list-item';
export { SegmentedControl } from './segmented-control/segmented-control';
export { Separator } from './separator/separator';
export { StatBlock } from './stat-block/stat-block';
export { TextInput } from './text-input/text-input';
export { Toast } from './toast/toast';
export { Typography } from './typography/typography';

// Existing components
export { Collapsible } from './collapsible';
export { IconSymbol } from './icon-symbol';
