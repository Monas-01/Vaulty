"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

export async function getNotifications() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const notifications = await prisma.notification.findMany({
    where: { userId },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          brand: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return notifications;
}

export async function markNotificationReadAction(id: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const existing = await prisma.notification.findFirst({
    where: { id, userId },
  });

  if (!existing) {
    throw new Error("Notification not found");
  }

  await prisma.notification.update({
    where: { id },
    data: { isRead: true },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/notifications");
  return { success: true };
}

export async function markAllNotificationsReadAction() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/notifications");
  return { success: true };
}
