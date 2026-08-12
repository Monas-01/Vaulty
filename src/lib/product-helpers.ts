export type WarrantyStatus = "active" | "expiring" | "expired";

export interface WarrantyCalculation {
  status: WarrantyStatus;
  expirationDate: Date;
  daysRemaining: number;
  progressPercent: number;
  statusLabel: string;
  badgeClass: string;
}

export function calculateWarranty(
  purchaseDateInput: Date | string,
  warrantyMonths: number,
): WarrantyCalculation {
  const purchaseDate = new Date(purchaseDateInput);
  const now = new Date();
  
  // Calculate expiration date by adding months
  const expirationDate = new Date(purchaseDate);
  expirationDate.setMonth(expirationDate.getMonth() + warrantyMonths);

  const msPerDay = 1000 * 60 * 60 * 24;
  const daysRemaining = Math.ceil(
    (expirationDate.getTime() - now.getTime()) / msPerDay,
  );
  
  const totalDays = Math.max(
    1,
    Math.ceil((expirationDate.getTime() - purchaseDate.getTime()) / msPerDay),
  );
  const daysPassed = Math.max(
    0,
    Math.ceil((now.getTime() - purchaseDate.getTime()) / msPerDay),
  );

  let status: WarrantyStatus = "active";
  let statusLabel = "Active Warranty";
  let badgeClass = "badge-active";

  if (daysRemaining < 0) {
    status = "expired";
    statusLabel = "Warranty Expired";
    badgeClass = "badge-expired";
  } else if (daysRemaining <= 30) {
    status = "expiring";
    statusLabel = `Expiring Soon (${daysRemaining} ${daysRemaining === 1 ? "day" : "days"} left)`;
    badgeClass = "badge-expiring";
  } else {
    status = "active";
    statusLabel = "Active Warranty";
    badgeClass = "badge-active";
  }

  const rawPercent = Math.round((daysPassed / totalDays) * 100);
  const progressPercent = Math.min(100, Math.max(0, rawPercent));

  return {
    status,
    expirationDate,
    daysRemaining,
    progressPercent,
    statusLabel,
    badgeClass,
  };
}

export function formatCurrency(amount: number | null | undefined): string {
  if (amount == null || isNaN(amount)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDate(dateInput: Date | string | null | undefined): string {
  if (!dateInput) return "—";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}
