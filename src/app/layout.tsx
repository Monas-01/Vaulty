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

export const metadata: Metadata = {
  title: "Vaultly — Never lose a receipt again",
  description:
    "Store receipts, invoices, and warranty documents. AI extracts the details, tracks your warranty, and reminds you before it expires.",
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
