import Link from "next/link";
import { Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center space-y-4 md:flex-row md:justify-between md:space-y-0">
          {/* Logo/Name */}
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg">ShopJS</span>
          </div>

          {/* Links */}
          <div className="flex items-center space-x-6">
            <Link
              href="https://github.com/antancelin"
              target="_blank"
              className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
