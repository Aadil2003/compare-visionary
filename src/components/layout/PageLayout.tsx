
import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export function PageLayout({ children, className, fullWidth = false }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={cn(
        "flex-1 pt-16 animate-fade-in", 
        fullWidth ? "" : "container px-4 md:px-6 py-8 md:py-12",
        className
      )}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
