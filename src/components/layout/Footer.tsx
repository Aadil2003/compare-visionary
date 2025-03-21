
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border py-6 md:py-8">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Visually</h4>
            <p className="text-sm text-muted-foreground">
              A sophisticated visual testing and comparison tool. Perfect for designers and QA teams.
            </p>
          </div>
          <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Product</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/projects" className="text-sm text-muted-foreground hover:text-foreground transition">
                    Projects
                  </Link>
                </li>
                <li>
                  <Link to="/docs" className="text-sm text-muted-foreground hover:text-foreground transition">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Resources</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/docs/api" className="text-sm text-muted-foreground hover:text-foreground transition">
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link to="/docs/help" className="text-sm text-muted-foreground hover:text-foreground transition">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/docs/guides" className="text-sm text-muted-foreground hover:text-foreground transition">
                    Guides
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Visually. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition">
              Twitter
            </a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition">
              GitHub
            </a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
