import type { Metadata } from "next";
import { ThemeProvider } from "@/components/app/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tugas - Task Management",
  description: "Tugas is a self-hostable task management app built with Next.js",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="Tugas" />
      </head>
      <body
        className={`antialiased text-zinc-900 dark:text-zinc-50 text-base`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
