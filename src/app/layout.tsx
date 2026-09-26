import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";

import { ThemeProvider } from "@/components/providers/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

const siteUrl = "https://vaulty.site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  title: {
    default: "Vaultly | Never Lose a Receipt or Warranty Again",
    template: "%s | Vaultly",
  },
  description:
    "Store receipts, invoices, and warranty documents in one secure vault. AI extracts the details, tracks warranty expiry, and reminds you before it runs out.",
  keywords: [
    "receipt tracker",
    "warranty tracker",
    "digital receipt storage",
    "invoice organizer",
    "warranty expiration reminder",
  ],
  openGraph: {
    title: "Vaultly: Never Lose a Receipt Again",
    description:
      "Store receipts, invoices, and warranty documents. AI extracts the details, tracks your warranty, and reminds you before it expires.",
    url: siteUrl,
    siteName: "Vaultly",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vaultly receipt and warranty tracker",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vaultly: Never Lose a Receipt Again",
    description:
      "Store receipts, invoices, and warranty documents. AI extracts the details, tracks your warranty, and reminds you before it expires.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: ["/favicon-32x32.png", "/favicon-16x16.png"],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${ibmPlexMono.variable} antialiased bg-canvas text-ink`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ClerkProvider
            appearance={{
              elements: {
                card: "bg-transparent shadow-none p-0 w-full",
                headerTitle: "text-ink font-bold text-display-sm text-center",
                headerSubtitle: "text-mute text-body-sm text-center",
                socialButtonsBlockButton:
                  "rounded-xl border border-border bg-canvas text-ink hover:bg-primary-pale text-button font-semibold transition-colors h-11",
                socialButtonsBlockButtonText: "text-ink font-semibold",
                formButtonPrimary:
                  "rounded-xl bg-primary px-xl py-md text-on-primary hover:bg-primary-active text-button font-semibold transition-colors shadow-none h-11",
                formFieldInput:
                  "rounded-md border border-border bg-canvas text-ink text-body-md focus:border-primary focus:ring-2 focus:ring-primary h-11",
                footerActionLink: "text-ink font-semibold hover:underline",
                dividerLine: "bg-border",
                dividerText: "text-mute text-caption uppercase",
                identityPreviewText: "text-ink font-semibold",
                identityPreviewEditButtonIcon: "text-mute",
              },
              variables: {
                colorPrimary: "#a3e635",
                colorBackground: "var(--canvas)",
                borderRadius: "12px",
              },
            }}
          >
            {children}
            <Toaster richColors position="bottom-right" />
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

