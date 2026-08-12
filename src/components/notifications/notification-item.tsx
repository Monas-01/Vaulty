"use client";

import { IconBell, IconCheck, IconExternalLink } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { markNotificationReadAction } from "@/lib/actions/notifications";
import { formatDate } from "@/lib/product-helpers";
import { Button } from "@/components/ui/button";

interface NotificationItemProps {
  notification: {
    id: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: Date;
    product?: {
      id: string;
      name: string;
      brand?: string | null;
    } | null;
  };
}

export function NotificationItem({ notification }: NotificationItemProps) {
  const [isRead, setIsRead] = useState(notification.isRead);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleMarkRead = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsUpdating(true);
    try {
      await markNotificationReadAction(notification.id);
      setIsRead(true);
      toast.success("Notification marked as read");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update notification");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      className={`card-content border transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-md ${
        isRead
          ? "border-border bg-canvas opacity-85"
          : "border-primary bg-primary-pale/20 shadow-xs"
      }`}
    >
      <div className="flex items-start gap-md min-w-0">
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl border ${
            isRead
              ? "bg-canvas-soft border-border text-mute"
              : "bg-primary-pale border-primary text-ink"
          }`}
        >
          <IconBell size={20} stroke={2} />
        </div>

        <div className="min-w-0 space-y-xxs">
          <div className="flex items-center gap-sm flex-wrap">
            <h3 className="text-body-md-strong text-ink">{notification.title}</h3>
            {!isRead && (
              <span className="rounded-pill bg-primary px-sm py-xxs text-caption text-on-primary font-semibold">
                New
              </span>
            )}
          </div>

          <p className="text-body-sm text-body">{notification.message}</p>

          <p className="text-caption text-mute pt-xs">
            {formatDate(notification.createdAt)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-sm shrink-0 pt-sm sm:pt-0 border-t sm:border-t-0 border-border">
        {notification.product && (
          <Link href={`/dashboard/products/${notification.product.id}`}>
            <Button variant="secondary" className="text-body-sm py-xs px-md">
              <IconExternalLink size={16} stroke={2} aria-hidden="true" />
              View Product
            </Button>
          </Link>
        )}

        {!isRead && (
          <Button
            variant="tertiary"
            onClick={handleMarkRead}
            disabled={isUpdating}
            className="text-body-sm py-xs px-md"
          >
            <IconCheck size={16} stroke={2} aria-hidden="true" />
            Mark read
          </Button>
        )}
      </div>
    </div>
  );
}
