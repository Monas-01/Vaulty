import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

import { ProductForm } from "@/components/products/product-form";

export default function NewProductPage() {
  return (
    <div className="w-full space-y-xl max-w-4xl">
      {/* Back Button & Header */}
      <div>
        <Link
          href="/dashboard/products"
          className="inline-flex items-center gap-xs text-body-sm text-mute hover:text-ink transition-colors mb-md"
        >
          <IconArrowLeft size={16} stroke={2} aria-hidden="true" />
          Back to products
        </Link>
        <h1 className="text-display-sm text-ink">Add New Product</h1>
        <p className="mt-xs text-body-md text-body">
          Enter product details, purchase date, and warranty duration to store it in your vault.
        </p>
      </div>

      {/* Form */}
      <ProductForm />
    </div>
  );
}
