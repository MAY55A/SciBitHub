import { Orbitron } from "next/font/google";
import "@/src/globals.css";
import Header from "@/src/components/navigation/Header";
import { AuthProvider } from "@/src/contexts/AuthContext";
import { ClientThemeProvider } from "@/src/components/wrappers/client-theme-provider";
import { Toaster } from "@/src/components/ui/toaster";

const orbitron = Orbitron({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={orbitron.className}>
      <body className="bg-background text-foreground">
        <ClientThemeProvider>
          <AuthProvider>
            <main className="min-h-screen flex flex-col items-center">
              <div className="flex-1 w-full flex flex-col items-center">
                <Header />
                <div className="w-full flex-1 flex flex-col gap-20 items-center">
                  {children}
                </div>
              </div>
            </main>
            <Toaster />
          </AuthProvider>
        </ClientThemeProvider>
      </body>
    </html>
  );
}
