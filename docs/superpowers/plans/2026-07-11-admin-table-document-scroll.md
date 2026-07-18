# Admin Table Document-Scroll — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the `fillHeight` fixed-viewport internal-scroll model on admin list pages with document-scroll (the page scrolls; the table renders at natural height; wide tables scroll horizontally inside their card).

**Architecture:** Revert the flex-fill plumbing (layout `main`/`.app-container`, `DataTable` `fillHeight`, per-page `lg:min-h-0 lg:flex-1` wrappers) and replace the table body's viewport-fraction height + inner vertical scroll with a single inner `overflow-x-auto` wrapper. No sticky header (a wide table's horizontal-scroll container also captures the vertical axis, so page-relative sticky is impossible).

**Tech Stack:** Next.js App Router, React, Tailwind, TypeScript. Package manager: **Yarn 4 via Corepack** — run every tooling command as `corepack yarn <cmd>` (global `yarn` is 1.x and fails). No unit-test harness for layout/CSS (`test` script is a no-op), so per-task verification is **static** (grep assertions + `tsc` + ESLint) plus a final visual check.

## Global Constraints

- Run tooling as `corepack yarn tsc --noEmit` / `corepack yarn eslint <files>`; format with `npx prettier --write <files>`.
- After every task: `corepack yarn tsc --noEmit` must report **0 errors** project-wide, and ESLint must be clean on the changed files.
- Do not touch `src/styles/globals.css` (`.table-surface` keeps `overflow-hidden`).
- Do not touch premium tables, mobile card view (`TableMobile`), or the pagination component.
- Branch: `refactor/admin-table-document-scroll` (already created off `origin/main`).

---

### Task 1: Revert layout scroll container

**Files:**

- Modify: `src/components/layouts/AppAdminLayout.tsx`

**Interfaces:**

- Consumes: nothing.
- Produces: `main` is a plain block scroll container; `.app-container` is a plain block. No flex-fill for descendants to hook into.

- [ ] **Step 1: Edit the layout**

Replace:

```tsx
<div className='flex-1 overflow-hidden'>
  <main className='flex h-full w-full flex-col overflow-y-auto'>
    <div className='app-container flex flex-col lg:min-h-0 lg:flex-1'>
      {children}
    </div>
  </main>
</div>
```

with:

```tsx
<div className='flex-1 overflow-hidden'>
  <main className='h-full w-full overflow-y-auto'>
    <div className='app-container'>{children}</div>
  </main>
</div>
```

- [ ] **Step 2: Verify + format**

Run:

```bash
grep -n "lg:min-h-0\|flex flex-col overflow-y-auto" src/components/layouts/AppAdminLayout.tsx || echo "OK: flex-fill removed"
npx prettier --write src/components/layouts/AppAdminLayout.tsx
corepack yarn tsc --noEmit 2>&1 | grep -cE 'error TS'
```

Expected: "OK: flex-fill removed" and tsc count `0`.

- [ ] **Step 3: Commit**

```bash
git add src/components/layouts/AppAdminLayout.tsx
git commit -m "refactor(admin): revert layout to plain document scroll"
```

---

### Task 2: Remove `fillHeight` usage from table organisms + roles inline table

**Files:**

- Modify: `src/components/organisms/users/UserTable.tsx`
- Modify: `src/components/organisms/admins/AdminTable.tsx`
- Modify: `src/components/organisms/reports/ReportTable.tsx`
- Modify: `src/components/organisms/news/NewsTable.tsx`
- Modify: `src/components/organisms/posts/PostTable.tsx`
- Modify: `src/components/organisms/brokers/BrokerPendingTable.tsx`
- Modify: `src/components/organisms/transactions/AdminTransactionTable.tsx`
- Modify: `src/components/features/roles/roles-page.tsx`

**Interfaces:**

- Consumes: `DataTable` still declares `fillHeight` (removed later in Task 4).
- Produces: no component passes `fillHeight` any more.

- [ ] **Step 1: Remove the `fillHeight` line in each `<DataTable>` call**

In each of the 7 organism files, delete the standalone `fillHeight` prop line (it sits right after `<DataTable` / `<DataTable<AdminTransaction>`):

```tsx
fillHeight
```

In `ReportTable.tsx` it is inline — change:

```tsx
<DataTable fillHeight columns={columns} data={data} loading={loading} />
```

to:

```tsx
<DataTable columns={columns} data={data} loading={loading} />
```

In `roles-page.tsx` delete the `fillHeight` line inside its `<DataTable>` (after `<DataTable`):

```tsx
fillHeight
```

- [ ] **Step 2: Verify no `fillHeight` usage remains outside DataTable internals**

Run:

```bash
grep -rn "fillHeight" src --include=*.tsx | grep -v "DataTable/index.tsx\|DataTable/TableDesktop.tsx\|DataTable/types.ts"
```

Expected: **no output** (all call-site usages gone).

- [ ] **Step 3: Format + typecheck**

```bash
npx prettier --write src/components/organisms/*/[A-Z]*Table.tsx src/components/features/roles/roles-page.tsx
corepack yarn tsc --noEmit 2>&1 | grep -cE 'error TS'
```

Expected: `0`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "refactor(admin): stop passing fillHeight from list tables"
```

---

### Task 3: Revert flex-fill wrappers on the list pages

**Files:**

- Modify: `src/components/features/users/users-page.tsx`
- Modify: `src/components/features/admins/admins-page.tsx`
- Modify: `src/components/features/roles/roles-page.tsx`
- Modify: `src/components/features/reports/reports-page.tsx`
- Modify: `src/components/features/brokers/broker-pending-page.tsx`
- Modify: `src/components/features/posts/posts-page.tsx`
- Modify: `src/components/features/news/news-page.tsx`
- Modify: `src/components/features/transactions/transactions-page.tsx`

**Interfaces:**

- Consumes: nothing.
- Produces: pages use plain block wrappers; content flows for document scroll.

- [ ] **Step 1: Root + inner wrapper pattern (users, admins, roles, reports, broker-pending)**

In each, replace the two fill wrappers:

```tsx
    <div className='flex flex-col lg:min-h-0 lg:flex-1'>
      <div className='flex flex-col gap-6 lg:min-h-0 lg:flex-1'>
```

with:

```tsx
    <div>
      <div className='space-y-6'>
```

(These files' closing `</div></div>` stay unchanged.)

- [ ] **Step 2: Single-root pattern (transactions)**

In `transactions-page.tsx` replace:

```tsx
    <div className='flex flex-col gap-6 lg:min-h-0 lg:flex-1'>
```

with:

```tsx
    <div className='space-y-6'>
```

- [ ] **Step 3: Loader-conditional pattern (posts, news)**

In `posts-page.tsx` and `news-page.tsx` replace the root:

```tsx
    <div className='flex flex-col lg:min-h-0 lg:flex-1'>
```

with:

```tsx
    <div>
```

and the loaded branch:

```tsx
        <div className='flex flex-col gap-6 lg:min-h-0 lg:flex-1'>
```

with:

```tsx
        <div className='space-y-6'>
```

- [ ] **Step 4: Verify no fill chain remains on pages, format, typecheck**

```bash
grep -rn "lg:min-h-0\|lg:flex-1" src/components/features || echo "OK: no fill chain on pages"
npx prettier --write src/components/features/*/*-page.tsx
corepack yarn eslint src/components/features/*/*-page.tsx; echo "ESLINT $?"
corepack yarn tsc --noEmit 2>&1 | grep -cE 'error TS'
```

Expected: "OK: no fill chain on pages", ESLINT `0`, tsc `0`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor(admin): revert list-page wrappers to plain document flow"
```

---

### Task 4: Simplify DataTable core (natural-height body + horizontal scroll)

**Files:**

- Modify: `src/components/organisms/DataTable/types.ts`
- Modify: `src/components/organisms/DataTable/index.tsx`
- Modify: `src/components/organisms/DataTable/TableDesktop.tsx`

**Interfaces:**

- Consumes: no call site passes `fillHeight` or `tableClassName` (verified in Task 2; `tableClassName` was never passed by any caller).
- Produces: `DataTable`/`TableDesktop` no longer accept `fillHeight`, `tableClassName`, or `maxHeightClassName`; the desktop table renders at natural height inside an `overflow-x-auto` wrapper.

- [ ] **Step 1: `types.ts` — drop `fillHeight`, `tableClassName`, `maxHeightClassName`**

In `DataTableProps`, delete the `fillHeight` doc-comment + field and the `tableClassName?: string` line:

```tsx
  // Styling
  className?: string

  // Key extractor
  getRowKey?: (row: T, index: number) => string | number
```

(i.e. remove `tableClassName?: string` and the whole `/** Fill the available… */ fillHeight?: boolean` block, keeping `className?`.)

In `TableDesktopProps`, delete these two lines:

```tsx
  maxHeightClassName?: string
  fillHeight?: boolean
```

- [ ] **Step 2: `index.tsx` — remove `fillHeight` plumbing, root back to `space-y-4`**

Remove `fillHeight = false,` from the `DataTableContent` destructure. Replace the root element:

```tsx
    <div
      className={
        fillHeight ? 'flex flex-col gap-4 lg:min-h-0 lg:flex-1' : 'space-y-4'
      }
    >
```

with:

```tsx
    <div className='space-y-4'>
```

Remove the `maxHeightClassName={tableClassName}` and `fillHeight={fillHeight}` props from the `<TableDesktop … />` call (delete both lines). Also remove `tableClassName,` from the `DataTableContent` destructure list.

- [ ] **Step 3: `TableDesktop.tsx` — natural height + inner `overflow-x-auto`**

Remove `maxHeightClassName,` and `fillHeight,` from the `TableDesktop` destructure. Replace the wrapper block:

```tsx
  return (
    <div
      className={
        fillHeight
          ? 'table-surface hidden lg:flex lg:min-h-0 lg:flex-1 lg:flex-col'
          : 'table-surface hidden lg:block'
      }
    >
      <div
        className={
          fillHeight
            ? 'min-h-0 flex-1 overflow-y-auto'
            : `overflow-y-auto ${
                maxHeightClassName || 'h-[50vh] xl:h-[56vh] 2xl:h-[60vh]'
              }`
        }
      >
```

with:

```tsx
  return (
    <div className='table-surface hidden lg:block'>
      <div className='overflow-x-auto'>
```

(The `<table>` and everything below is unchanged. The existing `sticky top-0` on `<thead>` is left as-is — inert without a bounded scroll parent.)

- [ ] **Step 4: Verify, format, typecheck, lint**

```bash
grep -rn "fillHeight\|maxHeightClassName\|tableClassName\|h-\[50vh\]" src/components/organisms/DataTable || echo "OK: fillHeight/height override fully removed"
npx prettier --write src/components/organisms/DataTable/types.ts src/components/organisms/DataTable/index.tsx src/components/organisms/DataTable/TableDesktop.tsx
corepack yarn eslint src/components/organisms/DataTable/*.ts src/components/organisms/DataTable/*.tsx; echo "ESLINT $?"
corepack yarn tsc --noEmit 2>&1 | grep -cE 'error TS'
```

Expected: "OK: fillHeight/height override fully removed", ESLINT `0`, tsc `0`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor(admin): DataTable renders at natural height with horizontal scroll"
```

---

### Task 5: Full verification + visual check

**Files:** none (verification only).

- [ ] **Step 1: Project-wide static gate**

```bash
corepack yarn tsc --noEmit 2>&1 | grep -cE 'error TS'   # expect 0
corepack yarn eslint src 2>&1 | tail -5                 # expect clean
grep -rn "fillHeight" src || echo "OK: no fillHeight anywhere"
```

Expected: tsc `0`, ESLint clean, "OK: no fillHeight anywhere".

- [ ] **Step 2: Visual check (requires running app)**

```bash
corepack yarn dev
```

Open a list page (e.g. `/management/users`) at a 16:9 window and confirm the acceptance criteria:

- Table shows all 20 rows at natural height; scrolling the **page** reveals rows then pagination at the end — no nested vertical scrollbar inside the table.
- A wide table (`/management/transactions` or `/content/posts`) scrolls **horizontally** inside its card on a narrower desktop width; no page-level horizontal scroll.
- Mobile width (< lg) still shows the card list, unchanged.

- [ ] **Step 3: Push + open PR**

```bash
git push -u origin HEAD
gh pr create --base main --title "refactor(admin): document-scroll for list tables" --body "See docs/superpowers/specs/2026-07-11-admin-table-document-scroll-design.md"
```

---

## Self-Review

**Spec coverage:** Scroll model → Tasks 1,3,4. Natural-height body + horizontal scroll → Task 4. Remove `fillHeight` everywhere → Tasks 2,4. Revert flex-fill wrappers → Tasks 1,3. Density/page-size unchanged → no task needed (nothing touches pagination options). Acceptance criteria → Task 5. No sticky header → Task 4 (inner `overflow-x-auto`, thead left inert). All spec sections covered.

**Placeholder scan:** none — every step has exact paths, code, and commands.

**Type consistency:** `fillHeight`, `tableClassName`, `maxHeightClassName` are removed in the same task (4) across `types.ts`/`index.tsx`/`TableDesktop.tsx`; call sites are cleared first (Task 2) so no reference outlives its declaration.
