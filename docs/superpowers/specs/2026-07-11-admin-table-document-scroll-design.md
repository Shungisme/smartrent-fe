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
all paginated admin list pages. Net result should be _less_ code than today and
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

### 2. Wide-table horizontal scroll (no sticky header)

- **No sticky `<thead>`.** During planning we confirmed a hard CSS conflict:
  wide tables need horizontal scroll (`overflow-x: auto`), which per spec
  promotes the container to a y-scroll context too — making a _page-relative_
  `sticky` header impossible without reintroducing a bounded-height inner frame
  (the very thing we're removing). GitHub / Stripe lists scroll their headers
  with content; we follow that.
- Wide tables (e.g. posts, transactions, `min-w-[800px]`) scroll **horizontally**
  inside their card via an inner `overflow-x-auto` wrapper. The `.table-surface`
  card keeps its rounded corners (`overflow-hidden` unchanged) — the _inner_
  wrapper owns the horizontal scroll, so there is no clip-vs-sticky conflict.
- Vertically the table is natural height; the page (`main`) scrolls. The
  existing `sticky top-0` class on `<thead>` becomes inert (no bounded scroll
  parent) and is left as-is — harmless, avoids churn.
- The page title + Filter/Views toolbar scroll naturally.

### 3. Density & page size

- Keep default page size **20** and the **10 / 20 / 50** options (users who want
  to see more pick 50).
- Keep current row density.

## Scope (files)

- `src/components/layouts/AppAdminLayout.tsx` — revert `main` / `.app-container`
  flex-fill.
- `src/components/organisms/DataTable/{types.ts,index.tsx,TableDesktop.tsx}` —
  remove `fillHeight` (and the now-obsolete `tableClassName`/`maxHeightClassName`
  height override); table body renders at natural height inside an inner
  `overflow-x-auto` wrapper (horizontal scroll for wide tables).
- List pages + their table organisms — remove `fillHeight` and revert flex-fill
  wrappers: **users, admins, roles, reports, posts, news, transactions,
  broker-pending** (page + organism where applicable).
- `src/styles/globals.css` — **no change**; `.table-surface` keeps
  `overflow-hidden` (rounded corners). Horizontal scroll lives on the inner
  wrapper, so no sticky conflict.

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
- Wide tables scroll horizontally inside their card; there is **no nested
  vertical scrollbar** inside the table.
- No leftover `fillHeight` prop, no `h-[..vh]` on the table body, no
  `lg:min-h-0 lg:flex-1` fill chain on list pages.
- `tsc --noEmit`, ESLint, Prettier all clean.
- Mobile card view unaffected.
