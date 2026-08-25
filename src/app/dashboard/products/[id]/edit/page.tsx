import { auth } from "@clerk/nextjs/server";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getProductById } from "@/lib/actions/products";
import { ProductForm } from "@/components/products/product-form";

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }

  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="w-full space-y-xl max-w-4xl">
      {/* Back Button & Header */}
      <div>
        <Link
          href={`/dashboard/products/${product.id}`}
          className="inline-flex items-center gap-xs text-body-sm text-mute hover:text-ink transition-colors mb-md"
        >
          <IconArrowLeft size={16} stroke={2} aria-hidden="true" />
          Back to {product.name}
        </Link>
        <h1 className="text-display-sm text-ink">Edit Product</h1>
        <p className="mt-xs text-body-md text-body">
          Update details, purchase date, or warranty information for this product.
        </p>
      </div>

      {/* Form with initial values */}
      <ProductForm
        initialValues={{
          ...product,
          purchaseDate: product.purchaseDate.toISOString().split("T")[0],
        }}
        isEdit={true}
      />
    </div>
  );
}
