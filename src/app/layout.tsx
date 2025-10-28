import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "./context/AuthProvider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  icons: "https://img.icons8.com/?size=100&id=78406&format=png&color=000000",
  title: "Mystry Message",
  description: "A secure messaging platform with end-to-end encryption.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
