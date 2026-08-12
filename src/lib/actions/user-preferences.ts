"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";

export async function getUserPreferences() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const prefs = await prisma.userPreferences.findUnique({
    where: { userId },
  });

  if (!prefs) {
    return {
      remind30Days: true,
      remind7Days: true,
      remind1Day: true,
    };
  }

  return {
    remind30Days: prefs.remind30Days,
    remind7Days: prefs.remind7Days,
    remind1Day: prefs.remind1Day,
  };
}

export async function updateUserPreferencesAction(data: {
  remind30Days: boolean;
  remind7Days: boolean;
  remind1Day: boolean;
}) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  await prisma.userPreferences.upsert({
    where: { userId },
    update: {
      remind30Days: data.remind30Days,
      remind7Days: data.remind7Days,
      remind1Day: data.remind1Day,
    },
    create: {
      userId,
      remind30Days: data.remind30Days,
      remind7Days: data.remind7Days,
      remind1Day: data.remind1Day,
    },
  });

  revalidatePath("/dashboard/settings/notifications");
  return { success: true };
}
