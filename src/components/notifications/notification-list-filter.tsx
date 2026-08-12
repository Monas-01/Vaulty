"use client";

import { IconBell } from "@tabler/icons-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { NotificationItem } from "@/components/notifications/notification-item";

interface NotificationListFilterProps {
  notifications: any[];
}

export function NotificationListFilter({ notifications }: NotificationListFilterProps) {
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const filteredNotifications = filter === "unread"
    ? notifications.filter((n) => !n.isRead)
    : notifications;

  if (notifications.length === 0) {
    return (
      <div className="card-content flex flex-col items-center justify-center border border-border py-3xl text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-primary-pale">
          <IconBell size={32} stroke={1.5} className="text-ink" />
        </div>
        <h2 className="mt-xl text-display-sm text-ink">No notifications yet</h2>
        <p className="mt-xs text-body-md text-body max-w-[420px]">
          When your registered product warranties approach 30 days, 7 days, or 1 day before expiration, reminders will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-lg">
      {/* Status Filter Pills */}
      <div className="flex items-center gap-sm border-b border-border pb-md">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={cn(
            "rounded-pill border border-border px-lg py-xs text-body-sm-strong transition-colors cursor-pointer",
            filter === "all"
              ? "border-primary bg-primary-pale text-ink shadow-xs"
              : "bg-canvas text-mute hover:bg-primary-pale hover:text-ink"
          )}
        >
          All ({notifications.length})
        </button>

        <button
          type="button"
          onClick={() => setFilter("unread")}
          className={cn(
            "rounded-pill border border-border px-lg py-xs text-body-sm-strong transition-colors cursor-pointer flex items-center gap-xs",
            filter === "unread"
              ? "border-primary bg-primary-pale text-ink shadow-xs"
              : "bg-canvas text-mute hover:bg-primary-pale hover:text-ink"
          )}
        >
          Unread
          {unreadCount > 0 && (
            <span className="rounded-pill bg-primary px-xs py-[1px] text-caption text-on-primary font-bold">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Filtered Notification Cards */}
      {filteredNotifications.length === 0 ? (
        <div className="card-content flex flex-col items-center justify-center border border-border py-2xl text-center">
          <h3 className="text-body-md-strong text-ink">No unread notifications</h3>
          <p className="mt-xs text-body-sm text-mute max-w-[360px]">
            You have read all your notifications. Switch back to &quot;All&quot; to view previously read notices.
          </p>
        </div>
      ) : (
        <div className="space-y-md">
          {filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
          ))}
        </div>
      )}
    </div>
  );
}
