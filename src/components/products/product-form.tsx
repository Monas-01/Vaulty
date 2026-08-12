"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createProductAction, updateProductAction } from "@/lib/actions/products";
import { productSchema, type ProductFormValues } from "@/lib/validations/product";
import { Button } from "@/components/ui/button";

interface ProductFormProps {
  initialValues?: Partial<ProductFormValues> & { id?: string };
  isEdit?: boolean;
}

const CATEGORIES = [
  "Electronics",
  "Appliances",
  "Home & Kitchen",
  "Vehicles",
  "Fitness",
  "Tools",
  "Other",
];

export function ProductForm({ initialValues, isEdit = false }: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultPurchaseDate = initialValues?.purchaseDate
    ? new Date(initialValues.purchaseDate).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialValues?.name || "",
      brand: initialValues?.brand || "",
      category: initialValues?.category || "Electronics",
      purchaseDate: defaultPurchaseDate,
      warrantyMonths: initialValues?.warrantyMonths ?? 12,
      store: initialValues?.store || "",
      notes: initialValues?.notes || "",
      purchasePrice: initialValues?.purchasePrice ?? undefined,
      receiptUrl: initialValues?.receiptUrl || "",
    },
  });

  const onSubmit = async (values: ProductFormValues) => {
    setIsSubmitting(true);
    try {
      if (isEdit && initialValues?.id) {
        await updateProductAction(initialValues.id, values);
        toast.success("Product updated successfully");
        router.push(`/dashboard/products/${initialValues.id}`);
      } else {
        const result = await createProductAction(values);
        toast.success("Product created successfully");
        router.push(`/dashboard/products/${result.id}`);
      }
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save product",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelHref = isEdit && initialValues?.id
    ? `/dashboard/products/${initialValues.id}`
    : "/dashboard/products";

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-xl pb-24">
      {/* ── Section 1: Product Details ──────────────────────────────── */}
      <div className="card-content border border-border">
        <h2 className="text-display-sm text-ink mb-lg">Product Details</h2>

        <div className="grid gap-lg md:grid-cols-2">
          {/* Name */}
          <div className="flex flex-col gap-xs md:col-span-2">
            <label htmlFor="name" className="text-body-sm-strong text-ink">
              Product Name <span className="text-status-expired">*</span>
            </label>
            <input
              id="name"
              type="text"
              placeholder="e.g. MacBook Pro 16-inch"
              className="text-input w-full"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-body-sm text-status-expired mt-xxs">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          {/* Brand */}
          <div className="flex flex-col gap-xs">
            <label htmlFor="brand" className="text-body-sm-strong text-ink">
              Brand / Manufacturer
            </label>
            <input
              id="brand"
              type="text"
              placeholder="e.g. Apple"
              className="text-input w-full"
              {...form.register("brand")}
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-xs">
            <label htmlFor="category" className="text-body-sm-strong text-ink">
              Category
            </label>
            <select
              id="category"
              className="text-input w-full bg-canvas cursor-pointer"
              {...form.register("category")}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Section 2: Purchase Info ────────────────────────────────── */}
      <div className="card-content border border-border">
        <h2 className="text-display-sm text-ink mb-lg">Purchase Information</h2>

        <div className="grid gap-lg md:grid-cols-3">
          {/* Purchase Date */}
          <div className="flex flex-col gap-xs">
            <label htmlFor="purchaseDate" className="text-body-sm-strong text-ink">
              Purchase Date <span className="text-status-expired">*</span>
            </label>
            <input
              id="purchaseDate"
              type="date"
              className="text-input w-full"
              {...form.register("purchaseDate")}
            />
            {form.formState.errors.purchaseDate && (
              <p className="text-body-sm text-status-expired mt-xxs">
                {form.formState.errors.purchaseDate.message}
              </p>
            )}
          </div>

          {/* Store */}
          <div className="flex flex-col gap-xs">
            <label htmlFor="store" className="text-body-sm-strong text-ink">
              Store / Retailer
            </label>
            <input
              id="store"
              type="text"
              placeholder="e.g. Apple Store, Amazon"
              className="text-input w-full"
              {...form.register("store")}
            />
          </div>

          {/* Purchase Price */}
          <div className="flex flex-col gap-xs">
            <label htmlFor="purchasePrice" className="text-body-sm-strong text-ink">
              Purchase Price ($)
            </label>
            <input
              id="purchasePrice"
              type="number"
              step="0.01"
              placeholder="e.g. 2499.00"
              className="text-input w-full"
              {...form.register("purchasePrice", { valueAsNumber: true })}
            />
            {form.formState.errors.purchasePrice && (
              <p className="text-body-sm text-status-expired mt-xxs">
                {form.formState.errors.purchasePrice.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Section 3: Warranty & Documentation ─────────────────────── */}
      <div className="card-content border border-border">
        <h2 className="text-display-sm text-ink mb-lg">
          Warranty & Documentation
        </h2>

        <div className="grid gap-lg md:grid-cols-2">
          {/* Warranty Months */}
          <div className="flex flex-col gap-xs">
            <label
              htmlFor="warrantyMonths"
              className="text-body-sm-strong text-ink"
            >
              Warranty Duration (Months) <span className="text-status-expired">*</span>
            </label>
            <input
              id="warrantyMonths"
              type="number"
              min="0"
              placeholder="e.g. 12 or 24"
              className="text-input w-full"
              {...form.register("warrantyMonths", { valueAsNumber: true })}
            />
            {form.formState.errors.warrantyMonths && (
              <p className="text-body-sm text-status-expired mt-xxs">
                {form.formState.errors.warrantyMonths.message}
              </p>
            )}
          </div>

          {/* Receipt URL */}
          <div className="flex flex-col gap-xs">
            <label htmlFor="receiptUrl" className="text-body-sm-strong text-ink">
              Receipt / Document URL
            </label>
            <input
              id="receiptUrl"
              type="text"
              placeholder="e.g. https://example.com/receipt.pdf"
              className="text-input w-full"
              {...form.register("receiptUrl")}
            />
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-xs md:col-span-2">
            <label htmlFor="notes" className="text-body-sm-strong text-ink">
              Notes & Serial Numbers
            </label>
            <textarea
              id="notes"
              rows={3}
              placeholder="e.g. Serial # C02X12345678, includes AppleCare+"
              className="text-input w-full resize-y"
              {...form.register("notes")}
            />
          </div>
        </div>
      </div>

      {/* ── Sticky Save Bar ─────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-[240px] right-0 z-30 flex items-center justify-between border-t border-border bg-canvas/95 px-xl py-lg backdrop-blur-md">
        <Link href={cancelHref}>
          <Button variant="tertiary">Cancel</Button>
        </Link>

        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : isEdit
              ? "Update product"
              : "Save product"}
        </Button>
      </div>
    </form>
  );
}
