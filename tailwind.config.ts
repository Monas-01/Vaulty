import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        "on-primary": "var(--on-primary)",
        "primary-active": "var(--primary-active)",
        "primary-pale": "var(--primary-pale)",
        ink: "var(--ink)",
        body: "var(--body)",
        mute: "var(--mute)",
        canvas: "var(--canvas)",
        "canvas-soft": "var(--canvas-soft)",
        "surface-muted": "var(--surface-muted)",
        border: "var(--border-ink)",
        "status-active": "var(--status-active)",
        "status-active-pale": "var(--status-active-pale)",
        "status-expiring": "var(--status-expiring)",
        "status-expiring-pale": "var(--status-expiring-pale)",
        "status-expired": "var(--status-expired)",
        "status-expired-pale": "var(--status-expired-pale)",
        "accent-orange": "var(--accent-orange)",
        "accent-orange-pale": "var(--accent-orange-pale)",
        "accent-cyan": "var(--accent-cyan)",
        "accent-cyan-pale": "var(--accent-cyan-pale)",
        "accent-pink": "var(--accent-pink)",
        "accent-pink-pale": "var(--accent-pink-pale)",
        "accent-emerald": "var(--accent-emerald)",
        "accent-emerald-pale": "var(--accent-emerald-pale)",
      },
      spacing: {
        xxs: "var(--spacing-xxs)",
        xs: "var(--spacing-xs)",
        sm: "var(--spacing-sm)",
        md: "var(--spacing-md)",
        lg: "var(--spacing-lg)",
        xl: "var(--spacing-xl)",
        "2xl": "var(--spacing-2xl)",
        "3xl": "var(--spacing-3xl)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        pill: "var(--radius-pill)",
      },
      boxShadow: {
        overlay: "var(--shadow-overlay)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-mega": [
          "var(--text-display-mega-size)",
          {
            lineHeight: "var(--text-display-mega-leading)",
            fontWeight: "900",
          },
        ],
        "display-xl": [
          "var(--text-display-xl-size)",
          {
            lineHeight: "var(--text-display-xl-leading)",
            fontWeight: "900",
          },
        ],
        "display-md": [
          "var(--text-display-md-size)",
          {
            lineHeight: "var(--text-display-md-leading)",
            fontWeight: "800",
          },
        ],
        "display-sm": [
          "var(--text-display-sm-size)",
          {
            lineHeight: "var(--text-display-sm-leading)",
            fontWeight: "700",
          },
        ],
        "body-lg": [
          "var(--text-body-lg-size)",
          {
            lineHeight: "var(--text-body-lg-leading)",
            fontWeight: "400",
          },
        ],
        "body-md": [
          "var(--text-body-md-size)",
          {
            lineHeight: "var(--text-body-md-leading)",
            fontWeight: "400",
          },
        ],
        "body-md-strong": [
          "var(--text-body-md-size)",
          {
            lineHeight: "var(--text-body-md-leading)",
            fontWeight: "600",
          },
        ],
        "body-sm": [
          "var(--text-body-sm-size)",
          {
            lineHeight: "var(--text-body-sm-leading)",
            fontWeight: "400",
          },
        ],
        "body-sm-strong": [
          "var(--text-body-sm-size)",
          {
            lineHeight: "var(--text-body-sm-leading)",
            fontWeight: "600",
          },
        ],
        caption: [
          "var(--text-caption-size)",
          {
            lineHeight: "var(--text-caption-leading)",
            fontWeight: "500",
          },
        ],
        button: [
          "var(--text-button-size)",
          {
            lineHeight: "var(--text-button-leading)",
            fontWeight: "600",
          },
        ],
        "stat-number": [
          "var(--text-stat-number-size)",
          {
            lineHeight: "var(--text-stat-number-leading)",
            fontWeight: "700",
          },
        ],
      },
    },
  },
};

export default config;
