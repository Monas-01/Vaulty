# Graph Report - Code  (2026-09-10)

## Corpus Check
- 79 files · ~73,167 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 202 nodes · 237 edges · 34 communities (10 shown, 7 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `52e2df17`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- DashboardUploadReviewPage
- sentry-example-page/page.tsx
- extract/route.ts
- presigned/route.ts
- command-palette.tsx
- layout /
- NotificationSettingsPage
- logo.png
- inngest/route.ts
- Home
- settings/layout.tsx
- proxy.ts
- button.tsx
- /dashboard/settings/profile
- notification-item.tsx
- /dashboard/upload
- warranty-status-filter.tsx

## God Nodes (most connected - your core abstractions)
1. `layout /` - 21 edges
2. `layout /dashboard` - 14 edges
3. `DashboardUploadReviewPage()` - 8 edges
4. `Logo()` - 7 edges
5. `POST()` - 4 edges
6. `NotificationSettingsPage()` - 4 edges
7. `OnboardingPage()` - 4 edges
8. `Home()` - 4 edges
9. `CommandPalette()` - 4 edges
10. `LandingFooterCta()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Home()` --renders--> `LandingFooterCta()`  [EXTRACTED]
  src/app/page.tsx → src/components/landing/landing-footer-cta.tsx
- `DashboardHeader()` --renders--> `Logo()`  [EXTRACTED]
  src/components/dashboard/dashboard-header.tsx → src/components/brand/Logo.tsx
- `LandingNav()` --renders--> `Logo()`  [EXTRACTED]
  src/components/landing/landing-nav.tsx → src/components/brand/Logo.tsx
- `DashboardLayout()` --renders--> `Logo()`  [EXTRACTED]
  src/app/dashboard/layout.tsx → src/components/brand/Logo.tsx
- `HowItWorksPage()` --renders--> `LandingFooterCta()`  [EXTRACTED]
  src/app/how-it-works/page.tsx → src/components/landing/landing-footer-cta.tsx

## Import Cycles
- None detected.

## Communities (34 total, 7 thin omitted)

### Community 1 - "sentry-example-page/page.tsx"
Cohesion: 0.08
Nodes (19): page /how-it-works, page /pricing, page /sentry-example-page, /how-it-works, /pricing, /sentry-example-page, LandingFooterCta(), EditProductPageProps (+11 more)

### Community 2 - "extract/route.ts"
Cohesion: 0.43
Nodes (6): DAILY_EXTRACTION_LIMIT, getUserDailyExtractionLimit(), parseFormattedDate(), parsePriceNumber(), POST(), RATE_LIMIT_WINDOW_HOURS

### Community 3 - "presigned/route.ts"
Cohesion: 0.25
Nodes (6): GET /api/sentry-example-api, POST /api/upload/presigned, Error, GET(), POST(), SentryExampleAPIError

### Community 5 - "layout /"
Cohesion: 0.07
Nodes (36): layout /, layout /dashboard, page /dashboard, page /dashboard/notifications, page /dashboard/products, page /dashboard/products/[id], page /dashboard/products/[id]/edit, page /dashboard/products/new (+28 more)

### Community 6 - "NotificationSettingsPage"
Cohesion: 0.40
Nodes (3): page /dashboard/settings/notifications, /dashboard/settings/notifications, NotificationSettingsPage()

### Community 7 - "logo.png"
Cohesion: 0.10
Nodes (15): page /login/[[...login]], page /onboarding, page /register/[[...register]], /login/[[...login]], /onboarding, /register/[[...register]], DashboardHeader(), LandingNav() (+7 more)

### Community 8 - "inngest/route.ts"
Cohesion: 0.60
Nodes (3): { GET, POST, PUT }, checkWarrantyReminders, keepDatabaseAlive

### Community 9 - "Home"
Cohesion: 0.15
Nodes (7): error /, page /, /, GlobalError(), LandingFeatures(), Home(), ProductStatusMockupProps

### Community 12 - "button.tsx"
Cohesion: 0.09
Nodes (9): ButtonHTMLAttributes, ButtonProps, VariantProps, MarkAllReadButton(), ProductDeleteButton(), ProductDeleteButtonProps, ProductForm(), ProductFormProps (+1 more)

### Community 38 - "notification-item.tsx"
Cohesion: 0.29
Nodes (3): NotificationItem(), NotificationItemProps, NotificationListFilterProps

## Knowledge Gaps
- **27 isolated node(s):** `DAILY_EXTRACTION_LIMIT`, `RATE_LIMIT_WINDOW_HOURS`, `{ GET, POST, PUT }`, `SETTINGS_TABS`, `isProtectedRoute` (+22 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 82 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `layout /` connect `layout /` to `Home`, `sentry-example-page/page.tsx`, `NotificationSettingsPage`, `logo.png`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Why does `DashboardUploadReviewPage()` connect `DashboardUploadReviewPage` to `sentry-example-page/page.tsx`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Why does `NotificationSettingsPage()` connect `NotificationSettingsPage` to `sentry-example-page/page.tsx`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **What connects `DAILY_EXTRACTION_LIMIT`, `RATE_LIMIT_WINDOW_HOURS`, `{ GET, POST, PUT }` to the rest of the system?**
  _27 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sentry-example-page/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08307692307692308 - nodes in this community are weakly interconnected._
- **Should `layout /` be split into smaller, more focused modules?**
  _Cohesion score 0.07301587301587302 - nodes in this community are weakly interconnected._
- **Should `logo.png` be split into smaller, more focused modules?**
  _Cohesion score 0.09666666666666666 - nodes in this community are weakly interconnected._