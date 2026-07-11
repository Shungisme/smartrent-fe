# Admin sidebar visual redesign

**Date:** 2026-07-11
**Status:** Approved (design)

## Goal
Redesign the Admin Console sidebar for a clearer visual hierarchy and faster
scanning — **without changing menu structure, routes, labels, i18n, or the
collapse / language features.** Visual-only, one component.

## Non-goals
- **No label renames.** Original labels stay (duplicate names like "Người
  dùng" / "Tin đăng" / "Báo cáo" remain — the group header + hierarchy give
  context). `navigation.ts` is untouched. *(User dropped the rename idea:
  prefixes felt cluttered.)*
- No route / structure / i18n changes.
- Collapsed (icon-rail) behavior, the always-open default, and the collapse
  toggle stay exactly as today.

## Design — expanded mode
1. **Group header = plain section label.** Drop the group icon in **expanded**
   mode so a group reads as an uppercase text label (icon-vs-no-icon instantly
   separates Group from Item). Keep `text-[11px] font-semibold uppercase
   tracking-wider`, muted color. Bigger gap **above** each group (`mt-6`, first
   group none) so each group is its own block. Chevron stays (collapse), quiet
   on the right. **The group icon is still rendered in the collapsed icon rail**
   (that mode is unchanged).
2. **Active-group highlight.** When a child is active, its group header turns
   `text-sidebar-foreground font-bold` (from muted) so you see which area
   you're in.
3. **Menu items — clear indent + scannable.** Indented deeper than the group
   label; height ~`py-2.5`, `gap-2.5` icon↔text, `space-y-1` between items.
4. **Active item — multi-signal.** `bg-sidebar-primary/12` +
   `text-sidebar-primary` + icon in primary + `font-semibold` + a left accent
   bar `w-1 rounded-full` (near full item height; thicker than today's `w-0.5`).
5. **Inactive item.** `text-sidebar-foreground/70`, icon `text-muted-foreground`,
   hover `bg-sidebar-accent`.

## Scope
- `src/components/organisms/adminSidebar.tsx` only:
  - `SidebarItem`: height / gap / active styling + thicker accent bar +
    `font-semibold` when active + primary icon when active.
  - `SidebarSection`: expanded header = text label only (no icon), bigger top
    gap, `isActiveGroup` prop → bold/foreground when active; keep the group icon
    for collapsed mode and the chevron for the toggle.
  - `AdminSidebar`: pass `isActiveGroup={activeGroupKey === group.key}` to each
    section (activeGroupKey already computed).

## Acceptance
- Expanded: groups clearly distinct from items (text label vs icon+label),
  visible indent, generous inter-group spacing.
- Active item stands out (bg + text + icon + weight + accent bar); its group
  header is highlighted.
- Collapse toggle, language switcher, routes, and all labels unchanged.
- `tsc --noEmit`, ESLint, Prettier clean; dev server boots and serves.
