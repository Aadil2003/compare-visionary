
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { PlusCircle, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toast } = useToast();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const handleNewProject = () => {
    toast({
      title: "Coming soon",
      description: "Project creation will be available in the next update."
    });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <span className="text-xl font-medium tracking-tight">Visually</span>
          </Link>
        </div>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex space-x-6 items-center">
          <Link to="/" className="text-sm font-medium hover:text-black/70 transition">Dashboard</Link>
          <Link to="/projects" className="text-sm font-medium hover:text-black/70 transition">Projects</Link>
          <Link to="/docs" className="text-sm font-medium hover:text-black/70 transition">Documentation</Link>
          <Button 
            onClick={handleNewProject} 
            size="sm" 
            className="rounded-full gap-1.5 transition-all duration-200 ease-in-out"
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Project</span>
          </Button>
        </nav>
        
        {/* Mobile menu button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden" 
          onClick={toggleMenu}
        >
          {isMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>
      
      {/* Mobile menu */}
      <div className={cn(
        "md:hidden fixed inset-0 z-40 bg-background pt-16 px-4 transition-all duration-300 ease-in-out transform",
        isMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      )}>
        <nav className="flex flex-col space-y-4 py-8">
          <Link 
            to="/" 
            className="text-lg font-medium py-2 hover:bg-secondary rounded-md px-3 transition"
            onClick={() => setIsMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link 
            to="/projects" 
            className="text-lg font-medium py-2 hover:bg-secondary rounded-md px-3 transition"
            onClick={() => setIsMenuOpen(false)}
          >
            Projects
          </Link>
          <Link 
            to="/docs" 
            className="text-lg font-medium py-2 hover:bg-secondary rounded-md px-3 transition"
            onClick={() => setIsMenuOpen(false)}
          >
            Documentation
          </Link>
          <Button 
            onClick={() => {
              handleNewProject();
              setIsMenuOpen(false);
            }} 
            className="mt-4 w-full rounded-full"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            <span>New Project</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}
