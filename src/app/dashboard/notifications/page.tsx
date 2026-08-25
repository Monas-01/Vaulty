import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { getNotifications } from "@/lib/actions/notifications";
import { MarkAllReadButton } from "@/components/notifications/mark-all-read-button";
import { NotificationListFilter } from "@/components/notifications/notification-list-filter";

export default async function NotificationsPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/login");
  }

  const notifications = await getNotifications();
  const unreadCount = notifications.filter((n: { isRead: boolean }) => !n.isRead).length;

  return (
    <div className="w-full space-y-xl max-w-4xl">
      {/* Header */}
      <div className="flex flex-col gap-md md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-display-sm text-ink">Notifications</h1>
          <p className="mt-xs text-body-md text-body">
            Warranty expiration reminders and system notices, newest first.
          </p>
        </div>

        <MarkAllReadButton unreadCount={unreadCount} />
      </div>

      {/* Notifications List Filtered Component */}
      <NotificationListFilter notifications={notifications} />
    </div>
  );
}
