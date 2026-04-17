import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AppProvider } from "@/context/app-context";
import { Toaster } from "@/components/ui/toaster";
import AppHeader from "@/components/layout/app-header";
import BottomNav from "@/components/layout/bottom-nav";

const fontBody = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const fontHeadline = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-headline",
});

export const metadata: Metadata = {
  title: "Social-fit",
  description:
    "A fitness-oriented social media platform with a dynamic video feed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body
        className={cn(
          "font-body antialiased",
          fontBody.variable,
          fontHeadline.variable
        )}
      >
        <AppProvider>
          <div className="flex h-screen-dynamic w-full items-center justify-center bg-zinc-100 dark:bg-zinc-900">
            <div className="relative h-full w-full overflow-hidden bg-background md:h-auto md:max-h-[95vh] md:aspect-[9/19.5] md:max-w-[420px] md:rounded-3xl md:shadow-2xl md:border">
              <AppHeader />
              <main className="h-full w-full">
                {children}
              </main>
              <BottomNav />
              <Toaster />
            </div>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
