"use client";

import { UserProfile } from "@clerk/nextjs";

export default function ProfileSettingsPage() {
  return (
    <div className="space-y-lg">
      <div className="card-content border border-border overflow-hidden">
        <UserProfile
          path="/dashboard/settings/profile"
          appearance={{
            elements: {
              rootBox: "w-full shadow-none",
              cardBox: "w-full shadow-none border-none bg-transparent p-0",
              navbar: "hidden",
              navbarMobileMenuButton: "hidden",
              pageScrollBox: "p-0 w-full",
              headerTitle: "text-body-md-strong text-ink",
              headerSubtitle: "text-body-sm text-mute",
              profileSectionTitleText: "text-body-sm-strong text-ink border-b border-border pb-xs",
              formButtonPrimary: "bg-primary text-on-primary hover:bg-primary-active rounded-xl text-button font-semibold shadow-none",
              formFieldInput: "bg-canvas text-ink border border-border rounded-md text-body-md focus:border-primary",
              badge: "bg-primary-pale text-ink border border-border rounded-pill text-caption",
            },
          }}
        />
      </div>
    </div>
  );
}
