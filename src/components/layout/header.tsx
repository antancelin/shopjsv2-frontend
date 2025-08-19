"use client";

import Link from "next/link";
import {
  ShoppingCart,
  User,
  Store,
  Menu,
  X,
  Shield,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/cart-context";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { state } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  // admin check
  const isAdmin = user?.admin === true;

  // logout function
  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* ✅ Container comme le main */}
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Store className="h-6 w-6" />
          <span className="text-lg font-bold">
            ShopJS
            {isAdmin && (
              <Badge
                variant="default"
                className="ml-2 p-1 bg-amber-600 hover:bg-amber-700"
              >
                <Shield className="h-3 w-3" />
              </Badge>
            )}
          </span>
        </Link>

        {/* ✅ Navigation desktop - VRAIMENT centrée */}
        <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
          <Link
            href="/products"
            className="text-md font-medium hover:font-bold cursor-pointer"
          >
            Produits
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="text-md font-medium hover:font-bold cursor-pointer text-amber-600"
            >
              Administration
            </Link>
          )}
        </nav>

        {/* Actions desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Point vert */}
          {isAuthenticated && <span className="text-green-600 text-lg">●</span>}

          {/* Panier */}
          <Link href="/cart">
            <Button
              variant="outline"
              size="sm"
              className="relative cursor-pointer"
            >
              <ShoppingCart className="h-4 w-4" />
              {state.totalItems > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {state.totalItems}
                </Badge>
              )}
              <span className="ml-2 hidden sm:inline">
                {state.totalPrice.toFixed(2)}€
              </span>
            </Button>
          </Link>

          {/* Auth buttons */}
          {isAuthenticated ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="cursor-pointer"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/users/login">
                <Button variant="outline" size="sm" className="cursor-pointer">
                  <User className="h-4 w-4 mr-2" />
                  Connexion
                </Button>
              </Link>
              <Link href="/users/signup">
                <Button size="sm" className="cursor-pointer">
                  S&apos;inscrire
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        <div className="md:hidden flex items-center space-x-2">
          {/* Point vert mobile */}
          {isAuthenticated && <span className="text-green-600 text-lg">●</span>}

          {/* Panier mobile */}
          <Link href="/cart">
            <Button variant="outline" size="sm" className="relative">
              <ShoppingCart className="h-4 w-4" />
              {state.totalItems > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {state.totalItems}
                </Badge>
              )}
            </Button>
          </Link>

          {/* Menu button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* ✅ Menu mobile dropdown avec padding */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link
              href="/products"
              className="block text-m font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Produits
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                className="block text-m font-medium text-amber-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Administration
              </Link>
            )}

            <div className="space-y-2">
              {isAuthenticated ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </Button>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/users/login"
                    className="block"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      Connexion
                    </Button>
                  </Link>
                  <Link
                    href="/users/signup"
                    className="block"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Button size="sm" className="w-full">
                      S&apos;inscrire
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
