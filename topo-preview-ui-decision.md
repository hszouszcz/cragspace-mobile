# Topo preview UI/UX decisions

Date: 2026-02-07

## Bottom sheet behavior

- Use 3 snap points:
  - Collapsed: 18-24% screen height (header + 1-2 rows).
  - Half: 45-55% screen height (comfortable list browsing).
  - Full: 85-90% screen height (filters + details).
- Collapsed state keeps topo as the primary focus.

## Topo visibility and scaling

- Default view: fit the entire sector on screen.
- Do not auto-reset after the user zooms or pans.
- If a route is selected from the list and the current scale is near 1x (<~1.3x), gently center toward the route area.

## Fullscreen mode

- Enter via tap on the topo or a dedicated fullscreen button in the toolbar.
- Fullscreen layout:
  - Topo fills the entire screen.
  - Minimal UI: close button and a small reset-zoom control.
  - Gestures: pinch to zoom, pan to move, double-tap to reset or jump to ~2-3x.
- Exit via close button or swipe-down.
- On fullscreen entry after selecting a route, optionally center and zoom to the route (2-3x).

## Notes

- Keep behavior predictable and avoid sudden automatic zoom resets.
- Preserve user intent after any manual interaction.

## Loading and remote image UX

- Progressive loading over blank screens: show layout skeletons immediately.
- Load order: layout -> route list -> low-res/blurred topo -> overlay -> full-res.
- Keep the list usable even when the image is still loading.
- Show a small, local loading indicator on the topo area (not full-screen blocking).
- Provide retry and offline-friendly states (cached image + message + retry button).

## Logbook flow inside bottom sheet

- Use a single bottom sheet and switch internal views, avoid stacking sheets.
- Sheet states: list -> details -> add-log (all within the same sheet).
- Main CTA for logging lives in route details to reduce accidental taps.
- Optional quick action in list (small + icon or swipe), but still confirm in add-log view.
- Provide clear back navigation within the sheet (header back button).
