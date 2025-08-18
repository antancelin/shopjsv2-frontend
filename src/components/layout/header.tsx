"use client";

import Link from "next/link";
import { ShoppingCart, User, Crown, Store, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/cart-context";
import { useState } from "react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { state } = useCart();

  // TODO: add auth state later
  const isAuthenticated = false;
  const isAdmin = false;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* logo / site name */}
        <Link href="/" className="flex items-center space-x-2">
          <Store className="h-6 w-6" />
          <span className="text-lg font-bold">ShopJS</span>
        </Link>

        {/* desktop navigation (hidden on mobile) */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/products"
            className="text-sm font-medium hover:underline"
          >
            Produits
          </Link>
        </nav>

        {/* actions */}
        <div className="hidden md:flex items-center space-x-4">
          {/* cart */}
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
              <span className="ml-2 hidden sm:inline">
                {state.totalPrice.toFixed(2)}€
              </span>
            </Button>
          </Link>

          {/* authentication */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              {isAdmin && (
                <Link href="/admin">
                  <Button variant="outline" size="sm">
                    <Crown className="h-4 w-4 mr-2" />
                    Admin
                  </Button>
                </Link>
              )}
              <Button variant="outline" size="sm">
                Déconnexion
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/users/login">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Connexion
                </Button>
              </Link>
              <Link href="/users/signup">
                <Button size="sm">S&apos;inscrire</Button>
              </Link>
            </div>
          )}

          {/* burger mobile menu */}
          <div className="md:hidden flex items-center space-x-2">
            {/* cart mobile (simplified) */}
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

            {/* menu button */}
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
      </div>

      {/* mobile menu dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur">
          <div className="container py-4 space-y-4">
            <Link
              href="/products"
              className="block text-sm font-medium hover:underline"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Produits
            </Link>
            {/* authentication mobile */}
            <div className="space-y-2">
              <Link
                href="/users/login"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Button variant="outline" size="sm" className="w-full">
                  Connexion
                </Button>
              </Link>
              <Link
                href="/users/signup"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Button size="sm" className="w-full">
                  S&apos;inscrire
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
