import * as Sentry from "@sentry/nextjs";
import { createClerkClient } from "@clerk/nextjs/server";
import { Resend } from "resend";

import { prisma } from "@/lib/prisma";
import { calculateWarranty, formatDate } from "@/lib/product-helpers";
import { inngest } from "./client";

const MONITOR_SLUG = "vaultly-warranty-reminders";

export const checkWarrantyReminders = inngest.createFunction(
  {
    id: "check-warranty-reminders",
    triggers: [{ cron: "0 9 * * *" }],
  },
  async ({ step }: { step: any }) => {
    // Sentry Cron Check-In: Start execution
    const checkInId = Sentry.captureCheckIn(
      {
        monitorSlug: MONITOR_SLUG,
        status: "in_progress",
      },
      {
        schedule: {
          type: "crontab",
          value: "0 9 * * *",
        },
        checkinMargin: 15,
        maxRuntime: 30,
        timezone: "Etc/UTC",
      }
    );

    try {
      // Step 1: Fetch all registered products
      const products = await step.run("fetch-all-products", async () => {
        return await prisma.product.findMany();
      });

      let sentCount = 0;

      for (const product of products) {
        const warranty = calculateWarranty(
          product.purchaseDate,
          product.warrantyMonths,
        );
        const days = warranty.daysRemaining;

        let notificationType: string | null = null;
        let title = "";
        let message = "";

        // Fetch user preferences for reminder toggles
        const userPref = await step.run(`fetch-pref-${product.userId}`, async () => {
          return await prisma.userPreferences.findUnique({
            where: { userId: product.userId },
          });
        });

        if (days === 30) {
          if (userPref && !userPref.remind30Days) continue;
          notificationType = "WARRANTY_EXPIRING_30";
          title = `Warranty Expiring Soon: ${product.name}`;
          message = `The warranty for "${product.name}" expires in 30 days on ${formatDate(warranty.expirationDate)}.`;
        } else if (days === 7) {
          if (userPref && !userPref.remind7Days) continue;
          notificationType = "WARRANTY_EXPIRING_7";
          title = `Warranty Expiring in 7 Days: ${product.name}`;
          message = `The warranty for "${product.name}" expires in 7 days on ${formatDate(warranty.expirationDate)}.`;
        } else if (days === 1) {
          if (userPref && !userPref.remind1Day) continue;
          notificationType = "WARRANTY_EXPIRING_1";
          title = `Warranty Expiring Tomorrow: ${product.name}`;
          message = `The warranty for "${product.name}" expires tomorrow (${formatDate(warranty.expirationDate)}).`;
        } else if (days === 0) {
          notificationType = "WARRANTY_EXPIRED";
          title = `Warranty Expired: ${product.name}`;
          message = `The warranty for "${product.name}" has officially expired.`;
        }

        if (!notificationType) continue;

        const typeKey = notificationType;
        const notifTitle = title;
        const notifMessage = message;

        // Step 2: Check for existing notification to avoid duplicate reminders
        const existingNotif = await step.run(
          `check-duplicate-${product.id}-${typeKey}`,
          async () => {
            return await prisma.notification.findFirst({
              where: {
                productId: product.id,
                type: typeKey,
              },
            });
          },
        );

        if (existingNotif) continue;

        // Step 3: Create notification record in database
        await step.run(`create-notification-${product.id}-${typeKey}`, async () => {
          return await prisma.notification.create({
            data: {
              userId: product.userId,
              productId: product.id,
              title: notifTitle,
              message: notifMessage,
              type: typeKey,
            },
          });
        });

        // Step 4: Fetch user email via Clerk Backend SDK & send email via Resend
        await step.run(`send-email-${product.id}-${typeKey}`, async () => {
          try {
            const clerkSecretKey = process.env.CLERK_SECRET_KEY;
            const resendApiKey = process.env.RESEND_API_KEY;

            if (!clerkSecretKey || !resendApiKey) {
              console.log(
                `Skipping email dispatch: CLERK_SECRET_KEY or RESEND_API_KEY not configured. Created in-app notification for product ${product.id}.`,
              );
              return;
            }

            const clerk = createClerkClient({ secretKey: clerkSecretKey });
            const user = await clerk.users.getUser(product.userId);
            const primaryEmail = user?.emailAddresses?.[0]?.emailAddress;

            if (!primaryEmail) {
              console.log(`No primary email address found for user ${product.userId}`);
              return;
            }

            const resendFromEnv = process.env.RESEND_FROM_EMAIL;
            let fromAddress = "Vaultly Reminders <onboarding@resend.dev>";
            if (resendFromEnv) {
              if (resendFromEnv.includes("<")) {
                fromAddress = resendFromEnv;
              } else {
                fromAddress = `Vaultly Reminders <${resendFromEnv}>`;
              }
            }

            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vaulty.site";
            const productUrl = `${baseUrl}/dashboard/products/${product.id}`;
            const settingsUrl = `${baseUrl}/dashboard/settings/notifications`;

            let headlineText = "";
            if (days === 0) {
              headlineText = `Your ${product.name} warranty has officially expired`;
            } else if (days === 1) {
              headlineText = `Your ${product.name} warranty expires tomorrow`;
            } else {
              headlineText = `Your ${product.name} warranty expires in ${days} days`;
            }

            const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${notifTitle}</title>
</head>
<body style="margin:0; padding:0; background-color:#09090b; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing:antialiased; color:#f4f4f5;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#09090b; padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:560px; background-color:#18181b; border:1px solid #27272a; border-radius:16px; overflow:hidden; text-align:left;">

          <!-- Header -->
          <tr>
            <td style="padding:24px 32px; border-bottom:1px solid #27272a; background-color:#09090b;">
              <span style="font-size:24px; font-weight:800; color:#a3e635; letter-spacing:-0.5px;">Vaultly</span>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 12px 0; font-size:13px; font-weight:700; color:#a3e635; text-transform:uppercase; letter-spacing:0.75px;">Warranty Notice</p>
              <h1 style="margin:0 0 16px 0; font-size:22px; font-weight:700; line-height:1.3; color:#ffffff;">
                ${headlineText}
              </h1>
              <p style="margin:0 0 24px 0; font-size:15px; line-height:1.5; color:#a1a1aa;">
                Hello ${user.firstName || "there"}, here are the product and warranty details recorded in your Vaultly vault:
              </p>

              <!-- Details Block -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#09090b; border:1px solid #27272a; border-radius:12px; margin-bottom:28px; border-collapse:separate; border-spacing:0;">
                <tr>
                  <td style="padding:14px 20px; border-bottom:1px solid #27272a;">
                    <span style="font-size:11px; color:#71717a; text-transform:uppercase; letter-spacing:0.5px; display:block; margin-bottom:4px;">Product Name</span>
                    <strong style="font-size:15px; color:#ffffff;">${product.name}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 20px; border-bottom:1px solid #27272a;">
                    <span style="font-size:11px; color:#71717a; text-transform:uppercase; letter-spacing:0.5px; display:block; margin-bottom:4px;">Brand / Manufacturer</span>
                    <span style="font-size:15px; color:#f4f4f5;">${product.brand || "N/A"}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 20px; border-bottom:1px solid #27272a;">
                    <span style="font-size:11px; color:#71717a; text-transform:uppercase; letter-spacing:0.5px; display:block; margin-bottom:4px;">Store / Retailer</span>
                    <span style="font-size:15px; color:#f4f4f5;">${product.store || "N/A"}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 20px; border-bottom:1px solid #27272a;">
                    <span style="font-size:11px; color:#71717a; text-transform:uppercase; letter-spacing:0.5px; display:block; margin-bottom:4px;">Purchase Date</span>
                    <span style="font-size:15px; color:#f4f4f5;">${formatDate(product.purchaseDate)}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 20px;">
                    <span style="font-size:11px; color:#71717a; text-transform:uppercase; letter-spacing:0.5px; display:block; margin-bottom:4px;">Warranty Expiration</span>
                    <strong style="font-size:15px; color:${days <= 7 ? "#f87171" : "#a3e635"};">${formatDate(warranty.expirationDate)}</strong>
                  </td>
                </tr>
              </table>

              <!-- Call to Action Button -->
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin:0 auto 12px 0;">
                <tr>
                  <td align="center" bgcolor="#a3e635" style="border-radius:9999px;">
                    <a href="${productUrl}" target="_blank" style="font-size:15px; font-weight:700; color:#09090b; text-decoration:none; display:inline-block; padding:14px 28px; border-radius:9999px; border:1px solid #a3e635;">
                      View Product &amp; Receipt &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px; border-top:1px solid #27272a; background-color:#09090b; text-align:center;">
              <p style="margin:0 0 8px 0; font-size:13px; color:#a1a1aa;">
                <a href="${settingsUrl}" target="_blank" style="color:#a3e635; text-decoration:underline;">Manage reminder preferences</a>
              </p>
              <p style="margin:0; font-size:12px; color:#71717a;">
                Sent automatically by Vaultly Warranty Assistant. Never lose a receipt or warranty again.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

            const resend = new Resend(resendApiKey);
            await resend.emails.send({
              from: fromAddress,
              to: [primaryEmail],
              subject: notifTitle,
              html: htmlContent,
            });
            sentCount++;
          } catch (emailErr) {
            console.error(`Failed to send email for product ${product.id}:`, emailErr);
          }
        });
      }

      // Sentry Cron Check-In: Success
      Sentry.captureCheckIn({
        monitorSlug: MONITOR_SLUG,
        status: "ok",
        checkInId,
      });

      return { processedProducts: products.length, sentCount };
    } catch (err: any) {
      // Sentry Cron Check-In: Error
      Sentry.captureCheckIn({
        monitorSlug: MONITOR_SLUG,
        status: "error",
        checkInId,
      });
      Sentry.captureException(err);
      throw err;
    }
  },
);
