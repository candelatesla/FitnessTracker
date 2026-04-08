import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const bebas = Bebas_Neue({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Yash's Personal Fitness Tracker",
  description: "A personal fitness, diet, and rewards dashboard for Yash Doshi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${bebas.variable} dark h-full`}>
      <body className="min-h-full bg-background font-sans text-foreground antialiased">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            classNames: {
              toast:
                "border border-white/10 bg-[#111111] text-[#F5F5F5] shadow-panel",
              title: "font-display text-xl tracking-wide text-accent",
              description: "text-sm text-[#D0D0D0]",
            },
          }}
        />
      </body>
    </html>
  );
}
