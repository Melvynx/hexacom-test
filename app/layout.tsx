import { Header } from "@/components/Header";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Geist_Mono as GeistMono, Geist as GeistSans } from "next/font/google";
import "./globals.css";

const geistSans = GeistSans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = GeistMono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Test HEXACOMM - Découvrez votre profil de personnalité",
  description:
    "Test complet du modèle HEXACOMM pour découvrir votre profil de personnalité en 108 questions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          "min-h-screen bg-background font-sans antialiased"
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
