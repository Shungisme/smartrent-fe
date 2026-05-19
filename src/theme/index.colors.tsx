// Theme color application.
//
// The design tokens live in `src/styles/globals.css` (`:root` + `.dark`) and
// are toggled by `next-themes` via the `class` attribute on <html>. This module
// used to ALSO inject a separate, flatter grayscale palette as inline styles on
// document.documentElement, which overrode the richer CSS tokens and was the
// main cause of the "flat / inconsistent" look. It is now retired: the function
// is a no-op that additionally strips any inline overrides left over from a
// previous session so the CSS cascade is the single source of truth.

export type ThemeMode = 'light' | 'dark'

// Custom properties that older builds injected inline and that we now want the
// stylesheet to own again.
const LEGACY_INJECTED_VARS = [
  'background',
  'foreground',
  'card',
  'cardForeground',
  'popover',
  'popoverForeground',
  'primary',
  'primaryForeground',
  'secondary',
  'secondaryForeground',
  'muted',
  'mutedForeground',
  'accent',
  'accentForeground',
  'destructive',
  'destructiveForeground',
  'border',
  'input',
  'ring',
  'chart1',
  'chart2',
  'chart3',
  'chart4',
  'chart5',
  'sidebar',
  'sidebarForeground',
  'sidebarPrimary',
  'sidebarPrimaryForeground',
  'sidebarAccent',
  'sidebarAccentForeground',
  'sidebarBorder',
  'sidebarRing',
]

export default function setGlobalColorTheme(themeMode: ThemeMode) {
  // `themeMode` is intentionally unused: light/dark is driven by the `.dark`
  // class (next-themes) + CSS tokens. The param is kept so existing callers
  // (ThemeDataProvider) compile unchanged.
  void themeMode

  if (typeof document === 'undefined') return

  const root = document.documentElement
  for (const key of LEGACY_INJECTED_VARS) {
    root.style.removeProperty(`--${key}`)
  }
}
