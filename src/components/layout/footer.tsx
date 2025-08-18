import Link from "next/link";
import { Github, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Logo/Name */}
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg">ShopJS v2</span>
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

          {/* Copyright */}
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500" />
            <span>by Antoine</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
