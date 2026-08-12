"use client";

import { IconCheck, IconDeviceDesktop, IconMoon, IconSun } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const THEME_OPTIONS = [
  {
    id: "light",
    label: "Light",
    description: "Clean, bright interface optimized for daylight reading.",
    icon: IconSun,
  },
  {
    id: "dark",
    label: "Dark",
    description: "Deep charcoal canvas for reduced eye strain in low light.",
    icon: IconMoon,
  },
  {
    id: "system",
    label: "System",
    description: "Automatically syncs with your operating system appearance.",
    icon: IconDeviceDesktop,
  },
];

export default function ThemeSettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="card-content border border-border p-xl">
        <p className="text-body-sm text-mute">Loading theme settings…</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-lg max-w-[42rem]">
      <div className="w-full">
        <h2 className="text-body-md-strong text-ink w-full">Appearance & Theme</h2>
        <p className="mt-xxs text-body-sm text-body w-full">
          Choose your preferred theme across all Vaultly pages and dashboard views.
        </p>
      </div>

      <div className="grid w-full gap-md grid-cols-1 sm:grid-cols-3">
        {THEME_OPTIONS.map((option) => {
          const isSelected = theme === option.id;
          const Icon = option.icon;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setTheme(option.id)}
              className={cn(
                "card-content w-full border text-left flex flex-col justify-between p-lg transition-colors cursor-pointer group relative min-w-0 box-border",
                isSelected
                  ? "border-primary bg-primary-pale/20 shadow-xs"
                  : "border-border bg-canvas hover:border-primary/50"
              )}
            >
              <div className="w-full min-w-0 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-md w-full">
                  <div
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-xl border transition-colors",
                      isSelected
                        ? "bg-primary text-on-primary border-primary"
                        : "bg-canvas-soft text-mute border-border group-hover:text-ink"
                    )}
                  >
                    <Icon size={20} stroke={2} />
                  </div>

                  {isSelected && (
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary">
                      <IconCheck size={14} stroke={3} />
                    </span>
                  )}
                </div>

                <h3 className="text-body-md-strong text-ink w-full">{option.label}</h3>
                <p className="mt-xs text-body-sm text-body w-full">{option.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
