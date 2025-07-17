import { Orbitron } from "next/font/google";
import "@/src/globals.css";
import Header from "@/src/components/navigation/Header";
import { AuthProvider } from "@/src/contexts/AuthContext";
import { ClientThemeProvider } from "@/src/components/wrappers/client-theme-provider";
import { Toaster } from "@/src/components/ui/toaster";
import { NotificationProvider } from "@/src/contexts/notification-context";
import { Analytics } from '@vercel/analytics/next';
import Head from "next/head";
import { Metadata } from "next";
import { siteMetadata } from "@/src/data/siteMetadata";

const orbitron = Orbitron({
  display: "swap",
  subsets: ["latin"],
});
export const metadata: Metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={orbitron.className}>
      <Head>
        {/* Google Site Verification */}
        <meta name="google-site-verification" content="VKAQGan9q_6iEKNQLdrPNHMacZ2_0LzQBs2hB5i88v0" />
      </Head>
      <body className="h-full bg-background text-foreground">
        <ClientThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <main className="min-h-screen w-full flex flex-col items-center">
                <Header />
                <div className="w-full flex flex-col gap-20 items-center">
                  {children}
                </div>
              </main>
              <Toaster />
            </NotificationProvider>
          </AuthProvider>
        </ClientThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
