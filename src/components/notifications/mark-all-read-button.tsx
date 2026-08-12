"use client";

import { IconCheck } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { markAllNotificationsReadAction } from "@/lib/actions/notifications";
import { Button } from "@/components/ui/button";

export function MarkAllReadButton({ unreadCount }: { unreadCount: number }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (unreadCount === 0) return null;

  const handleMarkAllRead = async () => {
    setIsSubmitting(true);
    try {
      await markAllNotificationsReadAction();
      toast.success("All notifications marked as read");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark all as read");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Button
      variant="secondary"
      onClick={handleMarkAllRead}
      disabled={isSubmitting}
    >
      <IconCheck size={18} stroke={2} aria-hidden="true" />
      {isSubmitting ? "Updating…" : "Mark all as read"}
    </Button>
  );
}
