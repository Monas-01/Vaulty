"use client";

import { IconBell, IconCheck } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  getUserPreferences,
  updateUserPreferencesAction,
} from "@/lib/actions/user-preferences";
import { Button } from "@/components/ui/button";

export default function NotificationSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [remind30Days, setRemind30Days] = useState(true);
  const [remind7Days, setRemind7Days] = useState(true);
  const [remind1Day, setRemind1Day] = useState(true);

  useEffect(() => {
    async function loadPrefs() {
      try {
        const prefs = await getUserPreferences();
        setRemind30Days(prefs.remind30Days);
        setRemind7Days(prefs.remind7Days);
        setRemind1Day(prefs.remind1Day);
      } catch (err) {
        console.error("Failed to load user preferences:", err);
      } finally {
        setLoading(false);
      }
    }

    loadPrefs();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUserPreferencesAction({
        remind30Days,
        remind7Days,
        remind1Day,
      });
      toast.success("Notification preferences saved");
    } catch (err) {
      console.error("Save preferences error:", err);
      toast.error("Failed to save notification preferences");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="card-content border border-border p-xl">
        <p className="text-body-sm text-mute">Loading notification preferences…</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-lg max-w-[42rem]">
      <div className="w-full">
        <h2 className="text-body-md-strong text-ink w-full">Email Reminder Thresholds</h2>
        <p className="mt-xxs text-body-sm text-body w-full">
          Configure when Vaultly sends automated email alerts before your product warranties expire.
        </p>
      </div>

      <div className="card-content w-full border border-border space-y-lg divide-y divide-border">
        {/* 30 Days Toggle */}
        <div className="flex items-center justify-between gap-md pt-md first:pt-0 w-full">
          <div className="flex-1 min-w-0 space-y-xxs max-w-[420px]">
            <span className="block text-body-md-strong text-ink w-full">30 Days Before Expiry</span>
            <p className="text-body-sm text-mute w-full">
              Receive an advance heads-up 1 month before your product warranty coverage ends.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={remind30Days}
              onChange={(e) => setRemind30Days(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-surface-muted border border-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-canvas after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
          </label>
        </div>

        {/* 7 Days Toggle */}
        <div className="flex items-center justify-between gap-md pt-md w-full">
          <div className="flex-1 min-w-0 space-y-xxs max-w-[420px]">
            <span className="block text-body-md-strong text-ink w-full">7 Days Before Expiry</span>
            <p className="text-body-sm text-mute w-full">
              Receive an urgent notice 1 week before warranty expiration.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={remind7Days}
              onChange={(e) => setRemind7Days(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-surface-muted border border-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-canvas after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
          </label>
        </div>

        {/* 1 Day Toggle */}
        <div className="flex items-center justify-between gap-md pt-md w-full">
          <div className="flex-1 min-w-0 space-y-xxs max-w-[420px]">
            <span className="block text-body-md-strong text-ink w-full">1 Day Before Expiry</span>
            <p className="text-body-sm text-mute w-full">
              Receive a final reminder the day before your warranty officially ends.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={remind1Day}
              onChange={(e) => setRemind1Day(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-surface-muted border border-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-canvas after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
          </label>
        </div>
      </div>

      <div className="flex justify-end pt-sm w-full">
        <Button variant="primary" onClick={handleSave} disabled={saving}>
          <IconCheck size={18} stroke={2} aria-hidden="true" />
          {saving ? "Saving preferences…" : "Save Preferences"}
        </Button>
      </div>
    </div>
  );
}
