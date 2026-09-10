# Graph Report - D:\\VS Code\\Vaulty\\Code  (2026-09-10)

## Corpus Check
- Corpus is ~15,972 words - fits in a single context window. You may not need a graph.

## Summary
- 195 nodes · 246 edges · 72 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Structure Signals
- Entity graph basis: 131 non-file, non-concept node(s)
- Weakly connected components: 59
- Singleton components: 25
- Isolated nodes: 25
- Largest component: 12 node(s) (9% of the entity graph basis)
- Low-cohesion communities: 0
- Largest low-cohesion community: none on the entity graph basis

## Workspace Bridges
1. `Logo\(\)` - connects `App Layout — Layout`, `App Page — Login`, `App Page — Onboarding`, `App Page — Register`, `Components Dashboard Header`; home: `Components Landing Nav`; degree 6; score 380.7
  source files: `D:/VS Code/Vaulty/Code/src/app/dashboard/layout.tsx`, `D:/VS Code/Vaulty/Code/src/app/login/\[\[...login\]\]/page.tsx`, `D:/VS Code/Vaulty/Code/src/app/onboarding/page.tsx`, `D:/VS Code/Vaulty/Code/src/app/register/\[\[...register\]\]/page.tsx`, `D:/VS Code/Vaulty/Code/src/components/brand/Logo.tsx`, `D:/VS Code/Vaulty/Code/src/components/dashboard/dashboard-header.tsx`, `D:/VS Code/Vaulty/Code/src/components/landing/landing-nav.tsx`
2. `LandingFooterCta\(\)` - connects `App Page — Features`, `App Page — How`, `App Page — Pricing`; home: `Components Landing Footer Cta`; degree 3; score 48.28
  source files: `D:/VS Code/Vaulty/Code/src/app/how-it-works/page.tsx`, `D:/VS Code/Vaulty/Code/src/app/page.tsx`, `D:/VS Code/Vaulty/Code/src/app/pricing/page.tsx`, `D:/VS Code/Vaulty/Code/src/components/landing/landing-footer-cta.tsx`
3. `DashboardLayout\(\)` - connects `App`, `Components Landing Nav`; home: `App Layout — Layout`; degree 2; score 269.53
  source files: `D:/VS Code/Vaulty/Code/src/app/dashboard/layout.tsx`, `D:/VS Code/Vaulty/Code/src/components/brand/Logo.tsx`, `D:\\VS Code\\Vaulty\\Code\\src\\app\\dashboard\\layout.tsx`
4. `OnboardingPage\(\)` - connects `Components Landing Nav`; home: `App Page — Onboarding`; degree 3; score 449.22
  source files: `D:/VS Code/Vaulty/Code/src/app/onboarding/page.tsx`, `D:/VS Code/Vaulty/Code/src/components/brand/Logo.tsx`, `D:\\VS Code\\Vaulty\\Code\\src\\app\\onboarding\\page.tsx`
5. `Home\(\)` - connects `Components Landing Footer Cta`; home: `App Page — Features`; degree 3; score 380.29
  source files: `D:/VS Code/Vaulty/Code/src/app/page.tsx`, `D:/VS Code/Vaulty/Code/src/components/landing/landing-features.tsx`, `D:/VS Code/Vaulty/Code/src/components/landing/landing-footer-cta.tsx`, `D:\\VS Code\\Vaulty\\Code\\src\\app\\page.tsx`
6. `LoginPage\(\)` - connects `Components Landing Nav`; home: `App Page — Login`; degree 2; score 284.89
  source files: `D:/VS Code/Vaulty/Code/src/app/login/\[\[...login\]\]/page.tsx`, `D:/VS Code/Vaulty/Code/src/components/brand/Logo.tsx`, `D:\\VS Code\\Vaulty\\Code\\src\\app\\login\\\[\[...login\]\]\\page.tsx`

## God Nodes
1. `layout /` - 23 edges
2. `layout /dashboard` - 16 edges
3. `DashboardUploadReviewPage\(\)` - 8 edges
4. `Logo\(\)` - 7 edges
5. `DashboardUploadPage\(\)` - 6 edges
6. `layout /dashboard/settings` - 5 edges
7. `POST\(\)` - 5 edges
8. `CommandPalette\(\)` - 4 edges
9. `Home\(\)` - 4 edges
10. `LandingFooterCta\(\)` - 4 edges

## Surprising Connections
- `layout /` --renders--> `RootLayout\(\)`  [EXTRACTED]
  D:\\VS Code\\Vaulty\\Code\\src\\app\\layout.tsx → D:/VS Code/Vaulty/Code/src/app/layout.tsx  _connects across different repos/directories; bridges separate communities; peripheral node \`RootLayout\(\)\` unexpectedly reaches hub \`layout /\`_
- `layout /dashboard` --renders--> `DashboardLayout\(\)`  [EXTRACTED]
  D:\\VS Code\\Vaulty\\Code\\src\\app\\dashboard\\layout.tsx → D:/VS Code/Vaulty/Code/src/app/dashboard/layout.tsx  _connects across different repos/directories; bridges separate communities_
- `layout /dashboard/settings` --renders--> `SettingsLayout\(\)`  [EXTRACTED]
  D:\\VS Code\\Vaulty\\Code\\src\\app\\dashboard\\settings\\layout.tsx → D:/VS Code/Vaulty/Code/src/app/dashboard/settings/layout.tsx  _connects across different repos/directories; peripheral node \`SettingsLayout\(\)\` unexpectedly reaches hub \`layout /dashboard/settings\`_
- `page /dashboard/upload` --renders--> `DashboardUploadPage\(\)`  [EXTRACTED]
  D:\\VS Code\\Vaulty\\Code\\src\\app\\dashboard\\upload\\page.tsx → D:/VS Code/Vaulty/Code/src/app/dashboard/upload/page.tsx  _connects across different repos/directories; peripheral node \`page /dashboard/upload\` unexpectedly reaches hub \`DashboardUploadPage\(\)\`_
- `page /dashboard/upload/review` --renders--> `DashboardUploadReviewPage\(\)`  [EXTRACTED]
  D:\\VS Code\\Vaulty\\Code\\src\\app\\dashboard\\upload\\review\\page.tsx → D:/VS Code/Vaulty/Code/src/app/dashboard/upload/review/page.tsx  _connects across different repos/directories; peripheral node \`page /dashboard/upload/review\` unexpectedly reaches hub \`DashboardUploadReviewPage\(\)\`_

## Semantic Anomalies
- **[HIGH] Bridge node** - layout / bridges App Page — Notifications and App Page — Dashboard, App Page — Edit, App Page — Dashboard \(2\), App Page — New, App Page — Products, App Page — Receipts, App Page — Search, App Layout, App Page — Settings, App Page — Profile, App Page — Settings \(2\), App, App Page, App Page — Warranties, App Page — How, App Error, App Layout — Layout, App Page — Login, App Page — Onboarding, App Page — Pricing, App Page — Register, App Page — Page \(3\).
  _High betweenness centrality \(1534.434\) across 23 communities makes this node a likely dependency chokepoint._
- **[HIGH] Bridge node** - layout /dashboard bridges App and App Page — Dashboard, App Layout — Layout, App Page — Notifications, App Page — Edit, App Page — Dashboard \(2\), App Page — New, App Page — Products, App Page — Receipts, App Page — Search, App Layout, App Page — Settings, App Page — Profile, App Page — Settings \(2\), App Page, App Page — Warranties.
  _High betweenness centrality \(579.197\) across 16 communities makes this node a likely dependency chokepoint._
- **[HIGH] Bridge node** - DashboardUploadReviewPage\(\) bridges App Page and App Page — Page.
  _High betweenness centrality \(1161.450\) across 2 communities makes this node a likely dependency chokepoint._
- **[HIGH] Cross-boundary edge** - layout / → RootLayout\(\) crosses graph boundaries in an unexpected way.
  _connects across different repos/directories; bridges separate communities; peripheral node \`RootLayout\(\)\` unexpectedly reaches hub \`layout /\`_
- **[HIGH] Cross-boundary edge** - layout /dashboard → DashboardLayout\(\) crosses graph boundaries in an unexpected way.
  _connects across different repos/directories; bridges separate communities_

## Communities

### Community 0 - "App Page"
Cohesion (entity basis within full-graph community): 0.25
Nodes (8): page /dashboard/upload/review, DashboardUploadReviewPage\(\), onSubmitAll\(\), renderBadge\(\), toggleCollapse\(\), toggleSelect\(\), toggleSelectAll\(\), updateItemField\(\)

### Community 1 - "App Page — Page"
Cohesion (entity basis within full-graph community): 0
Nodes (6): EditProductPageProps, ExtractedItemState, ProductDetailPageProps, ProductsPageProps, SearchPageProps, WarrantiesPageProps

### Community 2 - "App Page — Upload"
Cohesion (entity basis within full-graph community): 0.47
Nodes (6): page /dashboard/upload, DashboardUploadPage\(\), handleDrop\(\), handleFileInput\(\), processFile\(\), resetUpload\(\)

### Community 3 - "App Route"
Cohesion (entity basis within full-graph community): 0.4
Nodes (5): POST /api/ai/extract, POST /api/upload/presigned, parseFormattedDate\(\), parsePriceNumber\(\), POST\(\)

### Community 4 - "Components Command Palette"
Cohesion (entity basis within full-graph community): 0.5
Nodes (4): CommandPalette\(\), handleFullSearch\(\), handleKeyDown\(\), handleSelect\(\)

### Community 5 - "App Page — Notifications"
Cohesion (entity basis within full-graph community): 0.33
Nodes (3): layout /, page /dashboard/notifications, NotificationsPage\(\)

### Community 6 - "App Page — Page \(2\)"
Cohesion (entity basis within full-graph community): 0.5
Nodes (4): page /dashboard/settings/notifications, NotificationSettingsPage\(\), handleSave\(\), loadPrefs\(\)

### Community 7 - "App Page — Onboarding"
Cohesion (entity basis within full-graph community): 0.67
Nodes (3): page /onboarding, OnboardingPage\(\), handleSubmit\(\)

### Community 8 - "App Page — Page \(3\)"
Cohesion (entity basis within full-graph community): 0.67
Nodes (3): page /sentry-example-page, Page\(\), checkConnectivity\(\)

### Community 9 - "Components Product Status Mockup"
Cohesion (entity basis within full-graph community): 0
Nodes (2): ProductStatusMockup\(\), ProductStatusMockupProps

### Community 10 - "Components Product Filters"
Cohesion (entity basis within full-graph community): 0.67
Nodes (3): ProductFilters\(\), handleCategorySelect\(\), handleSearchChange\(\)

### Community 11 - "Components Command Palette — Command"
Cohesion (entity basis within full-graph community): 1
Nodes (1): CommandPaletteProps

### Community 12 - "Components Button"
Cohesion (entity basis within full-graph community): 0.67
Nodes (3): ButtonHTMLAttributes, ButtonProps, VariantProps

### Community 13 - "App Error"
Cohesion (entity basis within full-graph community): 1
Nodes (2): error /, GlobalError\(\)

### Community 14 - "App Layout"
Cohesion (entity basis within full-graph community): 1
Nodes (2): layout /dashboard/settings, SettingsLayout\(\)

### Community 15 - "App Not Found"
Cohesion (entity basis within full-graph community): 1
Nodes (2): not-found /, NotFound\(\)

### Community 16 - "App Page — Features"
Cohesion (entity basis within full-graph community): 0.67
Nodes (3): page /, LandingFeatures\(\), Home\(\)

### Community 17 - "App Page — Dashboard"
Cohesion (entity basis within full-graph community): 1
Nodes (2): page /dashboard, DashboardPage\(\)

### Community 18 - "App Page — Products"
Cohesion (entity basis within full-graph community): 1
Nodes (2): page /dashboard/products, ProductsPage\(\)

### Community 19 - "App Page — Dashboard \(2\)"
Cohesion (entity basis within full-graph community): 1
Nodes (2): page /dashboard/products/\[id\], ProductDetailPage\(\)

### Community 20 - "App Page — Edit"
Cohesion (entity basis within full-graph community): 1
Nodes (2): page /dashboard/products/\[id\]/edit, EditProductPage\(\)

### Community 21 - "App Page — New"
Cohesion (entity basis within full-graph community): 1
Nodes (2): page /dashboard/products/new, NewProductPage\(\)

### Community 22 - "App Page — Receipts"
Cohesion (entity basis within full-graph community): 1
Nodes (2): page /dashboard/receipts, ReceiptsPage\(\)

### Community 23 - "App Page — Search"
Cohesion (entity basis within full-graph community): 1
Nodes (2): page /dashboard/search, SearchResultsPage\(\)

### Community 24 - "App Page — Settings"
Cohesion (entity basis within full-graph community): 1
Nodes (2): page /dashboard/settings, SettingsPage\(\)

### Community 25 - "App Page — Profile"
Cohesion (entity basis within full-graph community): 1
Nodes (2): page /dashboard/settings/profile, ProfileSettingsPage\(\)

### Community 26 - "App Page — Settings \(2\)"
Cohesion (entity basis within full-graph community): 1
Nodes (2): page /dashboard/settings/theme, ThemeSettingsPage\(\)

### Community 27 - "App Page — Warranties"
Cohesion (entity basis within full-graph community): 1
Nodes (2): page /dashboard/warranties, WarrantiesPage\(\)

### Community 28 - "App Page — How"
Cohesion (entity basis within full-graph community): 1
Nodes (2): page /how-it-works, HowItWorksPage\(\)

### Community 29 - "App Page — Login"
Cohesion (entity basis within full-graph community): 1
Nodes (2): page /login/\[\[...login\]\], LoginPage\(\)

### Community 30 - "App Page — Pricing"
Cohesion (entity basis within full-graph community): 1
Nodes (2): page /pricing, PricingPage\(\)

### Community 31 - "App Page — Register"
Cohesion (entity basis within full-graph community): 1
Nodes (2): page /register/\[\[...register\]\], RegisterPage\(\)

### Community 32 - "App Global Error"
Cohesion (entity basis within full-graph community): 1
Nodes (1): GlobalError\(\)

### Community 33 - "Src Instrumentation"
Cohesion (entity basis within full-graph community): 0
Nodes (2): onRequestError\(\), register\(\)

### Community 34 - "Components Landing Nav"
Cohesion (entity basis within full-graph community): 1
Nodes (2): LandingNav\(\), Logo\(\)

### Community 35 - "App Layout — Layout"
Cohesion (entity basis within full-graph community): 0
Nodes (2): DashboardLayout\(\), RootLayout\(\)

### Community 36 - "Components Logo"
Cohesion (entity basis within full-graph community): 1
Nodes (1): LogoProps

### Community 37 - "Components Mark All Read Button"
Cohesion (entity basis within full-graph community): 1
Nodes (2): MarkAllReadButton\(\), handleMarkAllRead\(\)

### Community 38 - "Components Notification List Filter"
Cohesion (entity basis within full-graph community): 0
Nodes (2): NotificationListFilter\(\), NotificationListFilterProps

### Community 39 - "App Page — Error"
Cohesion (entity basis within full-graph community): 0.67
Nodes (3): Error, SentryExampleFrontendError, .constructor\(\)

### Community 40 - "Components Receipt Dropzone"
Cohesion (entity basis within full-graph community): 0
Nodes (2): ReceiptDropzone\(\), ReceiptDropzoneProps

### Community 41 - "App Route — Error"
Cohesion (entity basis within full-graph community): 0.67
Nodes (3): Error, SentryExampleAPIError, .constructor\(\)

### Community 42 - "App"
Cohesion (entity basis within full-graph community): 1
Nodes (1): layout /dashboard

### Community 43 - "App Route — API"
Cohesion (entity basis within full-graph community): 1
Nodes (2): GET /api/sentry-example-api, GET\(\)

### Community 44 - "Components Dashboard Header"
Cohesion (entity basis within full-graph community): 1
Nodes (1): DashboardHeader\(\)

### Community 45 - "Components Landing Footer Cta"
Cohesion (entity basis within full-graph community): 1
Nodes (1): LandingFooterCta\(\)

### Community 46 - "Components Landing Hero"
Cohesion (entity basis within full-graph community): 1
Nodes (1): LandingHero\(\)

### Community 47 - "Components Notification Item"
Cohesion (entity basis within full-graph community): 1
Nodes (1): NotificationItemProps

### Community 48 - "Components Notification Item — Handle"
Cohesion (entity basis within full-graph community): 1
Nodes (2): NotificationItem\(\), handleMarkRead\(\)

### Community 49 - "Components Product Delete Button"
Cohesion (entity basis within full-graph community): 1
Nodes (1): ProductDeleteButtonProps

### Community 50 - "Components Product Delete Button — Delete"
Cohesion (entity basis within full-graph community): 1
Nodes (2): ProductDeleteButton\(\), handleDelete\(\)

### Community 51 - "Components Product Form"
Cohesion (entity basis within full-graph community): 1
Nodes (1): ProductFormProps

### Community 52 - "Components Product Form — Form"
Cohesion (entity basis within full-graph community): 1
Nodes (2): ProductForm\(\), onSubmit\(\)

### Community 53 - "Components Sidebar Nav"
Cohesion (entity basis within full-graph community): 1
Nodes (1): SidebarNav\(\)

### Community 54 - "Components Theme Provider"
Cohesion (entity basis within full-graph community): 1
Nodes (1): ThemeProvider\(\)

### Community 55 - "Components Typewriter Headline"
Cohesion (entity basis within full-graph community): 1
Nodes (1): TypewriterHeadline\(\)

### Community 56 - "Components Warranty Status Filter"
Cohesion (entity basis within full-graph community): 1
Nodes (1): WarrantyStatusFilterProps

### Community 57 - "Components Warranty Status Filter — Status"
Cohesion (entity basis within full-graph community): 1
Nodes (2): WarrantyStatusFilter\(\), handleStatusSelect\(\)

### Community 58 - "Android Chrome 192x192 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 59 - "Android Chrome 512x512 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 60 - "Apple Icon Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 61 - "Apple Touch Icon Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 62 - "Favicon 16x16 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 63 - "Favicon 32x32 Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 64 - "Icon Png"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 65 - "Instrumentation Client TypeScript"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 66 - "Next Env D TypeScript"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 67 - "Prisma Config TypeScript"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 68 - "Proxy TypeScript"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 69 - "Sentry Edge Config TypeScript"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 70 - "Sentry Server Config TypeScript"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

### Community 71 - "Tailwind Config TypeScript"
Cohesion (entity basis within full-graph community): n/a
Nodes (0): 

## Knowledge Gaps
- **109 weakly connected node(s):** `parsePriceNumber\(\)`, `parseFormattedDate\(\)`, `POST /api/ai/extract`, `Error`, `.constructor\(\)` (+104 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `App`** (2 nodes): `layout /dashboard`, `/dashboard/upload`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `App Route — API`** (2 nodes): `GET /api/sentry-example-api`, `GET\(\)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Components Dashboard Header`** (2 nodes): `dashboard-header.tsx`, `DashboardHeader\(\)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Components Landing Footer Cta`** (2 nodes): `landing-footer-cta.tsx`, `LandingFooterCta\(\)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Components Landing Hero`** (2 nodes): `landing-hero.tsx`, `LandingHero\(\)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Components Notification Item`** (2 nodes): `notification-item.tsx`, `NotificationItemProps`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Components Notification Item — Handle`** (2 nodes): `NotificationItem\(\)`, `handleMarkRead\(\)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Components Product Delete Button`** (2 nodes): `product-delete-button.tsx`, `ProductDeleteButtonProps`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Components Product Delete Button — Delete`** (2 nodes): `ProductDeleteButton\(\)`, `handleDelete\(\)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Components Product Form`** (2 nodes): `product-form.tsx`, `ProductFormProps`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Components Product Form — Form`** (2 nodes): `ProductForm\(\)`, `onSubmit\(\)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Components Sidebar Nav`** (2 nodes): `sidebar-nav.tsx`, `SidebarNav\(\)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Components Theme Provider`** (2 nodes): `theme-provider.tsx`, `ThemeProvider\(\)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Components Typewriter Headline`** (2 nodes): `typewriter-headline.tsx`, `TypewriterHeadline\(\)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Components Warranty Status Filter`** (2 nodes): `warranty-status-filter.tsx`, `WarrantyStatusFilterProps`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Components Warranty Status Filter — Status`** (2 nodes): `WarrantyStatusFilter\(\)`, `handleStatusSelect\(\)`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Android Chrome 192x192 Png`** (1 nodes): `android-chrome-192x192.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Android Chrome 512x512 Png`** (1 nodes): `android-chrome-512x512.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Apple Icon Png`** (1 nodes): `apple-icon.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Apple Touch Icon Png`** (1 nodes): `apple-touch-icon.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Favicon 16x16 Png`** (1 nodes): `favicon-16x16.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Favicon 32x32 Png`** (1 nodes): `favicon-32x32.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Icon Png`** (1 nodes): `icon.png`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Instrumentation Client TypeScript`** (1 nodes): `instrumentation-client.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Next Env D TypeScript`** (1 nodes): `next-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Prisma Config TypeScript`** (1 nodes): `prisma.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Proxy TypeScript`** (1 nodes): `proxy.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Sentry Edge Config TypeScript`** (1 nodes): `sentry.edge.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Sentry Server Config TypeScript`** (1 nodes): `sentry.server.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Tailwind Config TypeScript`** (1 nodes): `tailwind.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does \`layout /\` connect \`App Page — Notifications\` to \`App Page — Dashboard\`, \`App Page — Edit\`, \`App Page — Dashboard \(2\)\`, \`App Page — New\`, \`App Page — Products\`, \`App Page — Receipts\`, \`App Page — Search\`, \`App Layout\`, \`App Page — Settings\`, \`App Page — Profile\`, \`App Page — Settings \(2\)\`, \`App\`, \`App Page\`, \`App Page — Warranties\`, \`App Page — How\`, \`App Error\`, \`App Layout — Layout\`, \`App Page — Login\`, \`App Page — Onboarding\`, \`App Page — Pricing\`, \`App Page — Register\`, \`App Page — Page \(3\)\`?**
  _High betweenness centrality \(1534.434\) - this node is a cross-community bridge._
- **Why does \`DashboardUploadReviewPage\(\)\` connect \`App Page\` to \`App Page — Page\`?**
  _High betweenness centrality \(1161.450\) - this node is a cross-community bridge._
- **Why does \`DashboardUploadPage\(\)\` connect \`App Page — Upload\` to \`App Page — Page\`?**
  _High betweenness centrality \(840.617\) - this node is a cross-community bridge._
- **What connects \`parsePriceNumber\(\)\`, \`parseFormattedDate\(\)\`, \`POST /api/ai/extract\` to the rest of the system?**
  _109 weakly-connected nodes found - possible documentation gaps or missing edges._
