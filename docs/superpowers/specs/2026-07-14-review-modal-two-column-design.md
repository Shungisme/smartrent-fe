# Post Review Modal — Two-Column Layout

**Date:** 2026-07-14
**Repo:** `admin/smartrent-fe`
**Status:** Design approved, pending implementation

## Problem

The admin listing-review dialog (`PostReviewModal`) is a single tall scroll column
inside a 1200px-wide dialog. The AI analysis panel (`PostAiAnalysis`, now including
the duplicate-check card) sits near the bottom, after Hero → Images → Details →
Location → Description → Amenities → Poster. To read the AI feedback the admin
scrolls all the way down, then scrolls back up to re-check the listing while
deciding — a lot of up/down. The dialog's horizontal space is wasted.

## Goal / Non-goals

**Goal:** stop the up/down scrolling by showing the AI feedback beside the listing.
**Non-goals:** changing any section's content/logic, the image lightbox, the
`PostAiAnalysis` component itself, or the action buttons. This is layout-only.

## Design

Restructure only the body of `PostReviewModal.tsx` (header + sticky footer
unchanged). Content splits into two columns for pending listings:

- **`lg` and up (desktop):** two independently-scrolling columns. Outer container
  `overflow-hidden`; each column `lg:overflow-y-auto`.
  - Left `lg:flex-1` + right border: Hero, Images, Property details, Location,
    Description, Amenities, Poster.
  - Right `lg:w-[440px] lg:shrink-0`: `PostAiAnalysis` then the two moderation
    textareas (verification notes + rejection reason).
  - Scrolling the AI panel never moves the listing, and vice versa.
- **Below `lg` (mobile/tablet):** single vertical scroll (columns stack: listing,
  then AI, then form) — the current behavior. Admin review is desktop-first.

Container pattern:

```
<div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
  <div className="... lg:flex-1 lg:overflow-y-auto lg:border-r border-border/60"> {/* listing */}
  <div className="... lg:w-[440px] lg:shrink-0 lg:overflow-y-auto">              {/* AI + form */}
</div>
```

**Reviewed (not pending):** no AI panel and no moderation form, so keep the current
single-column view (read-only verification notes / rejection reason below the
listing). Avoids an empty right column.

## Error handling / edge cases

- Description keeps its own `max-h-60` inner scroll — nested inside the left
  column's scroll, which is fine.
- Empty AI/form states already handled by `PostAiAnalysis` and the existing
  conditionals; no new states.

## Verification

- `tsc --noEmit` + `eslint` on the changed file.
- Manual: open a pending listing, confirm two panes scroll independently on
  desktop and stack on mobile.

## Files touched

`src/components/organisms/posts/PostReviewModal.tsx` (layout only).
