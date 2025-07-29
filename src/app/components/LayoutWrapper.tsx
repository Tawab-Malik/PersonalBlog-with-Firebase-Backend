'use client';

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const hiddenPaths = ["/dashboard", "/dashboard/add", "/dashboard/edit", "/profile"];
  const hideHeaderFooter = hiddenPaths.some(path => pathname?.startsWith(path));

  return (
    <>
      {!hideHeaderFooter && <Header />}
      {children}
      {!hideHeaderFooter && <Footer />}
    </>
  );
} 