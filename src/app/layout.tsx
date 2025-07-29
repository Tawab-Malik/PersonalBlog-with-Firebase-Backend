import { Inter, Manrope, Nunito } from "next/font/google";
import "./globals.css";
import { HeroUIProvider } from "@heroui/react";
import LayoutWrapper from "./components/LayoutWrapper";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${manrope.variable} ${nunito.variable} ${inter.variable} antialiased`}>
        <HeroUIProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </HeroUIProvider>
      </body>
    </html>
  );
}
