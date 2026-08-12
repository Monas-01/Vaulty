"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { productSchema, type ProductFormValues } from "@/lib/validations/product";

export async function getProducts(search?: string, category?: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const whereClause: Prisma.ProductWhereInput = { userId };

  if (search && search.trim() !== "") {
    whereClause.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { brand: { contains: search, mode: "insensitive" } },
      { store: { contains: search, mode: "insensitive" } },
    ];
  }

  if (category && category !== "All" && category !== "all") {
    whereClause.category = { equals: category, mode: "insensitive" };
  }

  const products = await prisma.product.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
  });

  return products;
}

export async function getProductById(id: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const product = await prisma.product.findFirst({
    where: { id, userId },
  });

  return product;
}

export async function createProductAction(data: ProductFormValues) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const validated = productSchema.parse(data);

  const product = await prisma.product.create({
    data: {
      userId,
      name: validated.name,
      brand: validated.brand || null,
      category: validated.category || null,
      purchaseDate: new Date(validated.purchaseDate),
      warrantyMonths: validated.warrantyMonths,
      store: validated.store || null,
      notes: validated.notes || null,
      purchasePrice: validated.purchasePrice ?? null,
      receiptUrl: validated.receiptUrl || null,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/products");
  return { success: true, id: product.id };
}

export async function createMultipleProductsAction(items: ProductFormValues[]) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const createdIds: string[] = [];

  for (const item of items) {
    const validated = productSchema.parse(item);
    const product = await prisma.product.create({
      data: {
        userId,
        name: validated.name,
        brand: validated.brand || null,
        category: validated.category || null,
        purchaseDate: new Date(validated.purchaseDate),
        warrantyMonths: validated.warrantyMonths,
        store: validated.store || null,
        notes: validated.notes || null,
        purchasePrice: validated.purchasePrice ?? null,
        receiptUrl: validated.receiptUrl || null,
      },
    });
    createdIds.push(product.id);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/products");
  return { success: true, count: createdIds.length, ids: createdIds };
}

export async function updateProductAction(id: string, data: ProductFormValues) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const validated = productSchema.parse(data);

  // Check ownership
  const existing = await prisma.product.findFirst({
    where: { id, userId },
  });

  if (!existing) {
    throw new Error("Product not found or access denied");
  }

  await prisma.product.update({
    where: { id },
    data: {
      name: validated.name,
      brand: validated.brand || null,
      category: validated.category || null,
      purchaseDate: new Date(validated.purchaseDate),
      warrantyMonths: validated.warrantyMonths,
      store: validated.store || null,
      notes: validated.notes || null,
      purchasePrice: validated.purchasePrice ?? null,
      receiptUrl: validated.receiptUrl || null,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/products");
  revalidatePath(`/dashboard/products/${id}`);
  return { success: true };
}

export async function deleteProductAction(id: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const existing = await prisma.product.findFirst({
    where: { id, userId },
  });

  if (!existing) {
    throw new Error("Product not found or access denied");
  }

  await prisma.product.delete({
    where: { id },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/products");
  return { success: true };
}
