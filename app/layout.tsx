import { Orbitron } from "next/font/google";
import "@/src//globals.css";
import Header from "@/src/components/navigation/Header";
import { AuthProvider } from "@/src/contexts/AuthContext";
import { ClientThemeProvider } from "@/src/components/wrappers/client-theme-provider";

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
        <ClientThemeProvider        >
          <AuthProvider>
            <main className="min-h-screen flex flex-col items-center">
              <div className="flex-1 w-full flex flex-col items-center">
                <Header />
                <div className="w-full flex-1 flex flex-col gap-20 items-center">
                  {children}
                </div>

                <footer className="w-full h-14 flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
                  <p>
                    Made by{" "}
                    <a
                      href="https://may55a.github.io/Social-links-profile/"
                      target="_blank"
                      className="font-bold hover:underline"
                      rel="noreferrer"
                    >
                      MAY55A
                    </a>
                  </p>
                </footer>
              </div>
            </main>
          </AuthProvider>
        </ClientThemeProvider>
      </body>
    </html>
  );
}
