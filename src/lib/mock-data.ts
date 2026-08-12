// ---------------------------------------------------------------------------
// Mock / seed data for the dashboard.
// Swap SHOW_EMPTY_STATE to `true` to preview the zero-products empty state.
// ---------------------------------------------------------------------------

export const SHOW_EMPTY_STATE = false;

export type WarrantyStatus = "active" | "expiring" | "expired";

export interface MockProduct {
  id: string;
  name: string;
  brand: string;
  status: WarrantyStatus;
  uploadedAt: string;
}

export interface DashboardStats {
  totalProducts: number;
  activeWarranties: number;
  expiringSoon: number;
}

// ── Stats ───────────────────────────────────────────────────────────────────
export const MOCK_STATS: DashboardStats = {
  totalProducts: 12,
  activeWarranties: 8,
  expiringSoon: 3,
};

// ── Recent products ─────────────────────────────────────────────────────────
export const MOCK_RECENT_PRODUCTS: MockProduct[] = [
  {
    id: "prod_001",
    name: 'MacBook Pro 16"',
    brand: "Apple",
    status: "active",
    uploadedAt: "2026-08-06",
  },
  {
    id: "prod_002",
    name: "WH-1000XM5 Headphones",
    brand: "Sony",
    status: "active",
    uploadedAt: "2026-08-04",
  },
  {
    id: "prod_003",
    name: "Galaxy S25 Ultra",
    brand: "Samsung",
    status: "expiring",
    uploadedAt: "2026-07-29",
  },
  {
    id: "prod_004",
    name: "Dyson V15 Detect",
    brand: "Dyson",
    status: "active",
    uploadedAt: "2026-07-20",
  },
  {
    id: "prod_005",
    name: "KitchenAid Stand Mixer",
    brand: "KitchenAid",
    status: "expired",
    uploadedAt: "2026-06-15",
  },
];

// ── Status → badge class mapping ────────────────────────────────────────────
export const STATUS_BADGE_CLASS: Record<WarrantyStatus, string> = {
  active: "badge-active",
  expiring: "badge-expiring",
  expired: "badge-expired",
};

export const STATUS_LABEL: Record<WarrantyStatus, string> = {
  active: "Active",
  expiring: "Expiring soon",
  expired: "Expired",
};
