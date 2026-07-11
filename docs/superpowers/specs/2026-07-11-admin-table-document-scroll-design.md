# Admin data tables — document-scroll layout

**Date:** 2026-07-11
**Status:** Approved (design)

## Problem

The admin list pages currently use a `fillHeight` approach: the shared
`DataTable` body flex-fills exactly one viewport and scrolls **internally**,
with pagination pinned to the bottom of that fixed frame. This constrains how
many rows are visible (~8–10), adds a nested scrollbar, and limits the user's
view of the data ("chỉ 1 màn hình, cuộn trong khung"). We want the standard
modern SaaS pattern (Stripe / GitHub / Vercel): the page scrolls as one
document and the table shows all rows of the current page at natural height,
with sticky column headers.

## Goal

Replace the fixed-viewport internal-scroll model with **document-scroll** for
all paginated admin list pages. Net result should be *less* code than today and
no viewport-fraction (`vh`) sizing.

## Design

### 1. Scroll model
- `main` (in `AppAdminLayout`) stays the single scroll container
  (`overflow-y-auto`) but reverts to plain block flow — remove the
  `flex flex-col` on `main` and the `lg:min-h-0 lg:flex-1 flex flex-col` on the
  `.app-container` wrapper that were added for `fillHeight`.
- The `DataTable` body renders at **natural height**: remove the `fillHeight`
  prop and its branch logic, remove the inner `overflow-y-auto` wrapper and the
  `h-[50vh] xl:h-[56vh] 2xl:h-[60vh]` / `flex-1 min-h-0` height rules. The rows
  determine the table's height; the page scrolls.
- Pagination sits at the natural end of the list.
- Remove the `fillHeight` opt-in from every list page + table organism and
  revert their wrappers (`flex flex-col lg:min-h-0 lg:flex-1` → the original
  simple wrappers, e.g. `space-y-6`).

### 2. Sticky column header (the UX highlight)
- `<thead>` is `sticky top-0 z-10` relative to the page scroll (`main`), with a
  solid background + a bottom hairline so column names stay visible while
  scrolling rows. (`<thead>` already has `sticky top-0`; today it sticks inside
  the nested scroll div — after removing that div it must stick to `main`.)
- **Constraint:** `position: sticky` is disabled by an ancestor with
  `overflow: hidden/clip/auto`. The `.table-surface` card uses `overflow-hidden`
  for rounded corners, which sits between `<thead>` and `main`. The
  implementation must preserve the rounded card while letting the sticky work —
  e.g. drop the clip and round the first/last header cells, or clip only the
  x-axis. (Exact CSS technique decided in the plan.)
- No manual `top` offset needed: the app topbar is fixed **outside** `main`, so
  `top-0` sticks just beneath it.
- The page title + Filter/Views toolbar **scroll away naturally** (not sticky).

### 3. Density & page size
- Keep default page size **20** and the **10 / 20 / 50** options (users who want
  to see more pick 50).
- Keep current row density.

## Scope (files)
- `src/components/layouts/AppAdminLayout.tsx` — revert `main` / `.app-container`
  flex-fill.
- `src/components/organisms/DataTable/{types.ts,index.tsx,TableDesktop.tsx}` —
  remove `fillHeight`; natural-height body; sticky `<thead>`; fix
  `.table-surface` overflow so sticky works.
- List pages + their table organisms — remove `fillHeight` and revert flex-fill
  wrappers: **users, admins, roles, reports, posts, news, transactions,
  broker-pending** (page + organism where applicable).
- `src/styles/globals.css` — `.table-surface` overflow handling if changed
  there.

## Non-goals
- Sticky filter/toolbar bar (deferred enhancement).
- Infinite scroll / row virtualization.
- Changing the pagination component or the page-size options.
- Premium / config tables (already excluded from `fillHeight`; untouched).
- Mobile card view (unchanged).

## Acceptance criteria
- On a list page (e.g. Users) at 16:9, the table shows all 20 rows at natural
  height; scrolling the page reveals the rows then pagination at the end — **no
  nested scrollbar inside the table**.
- Column headers stay visible (sticky) while scrolling rows.
- No leftover `fillHeight` prop, no `h-[..vh]` on the table body, no
  `lg:min-h-0 lg:flex-1` fill chain on list pages.
- `tsc --noEmit`, ESLint, Prettier all clean.
- Mobile card view unaffected.
