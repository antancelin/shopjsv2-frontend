"use client";

import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartClient() {
  const { state, updateQuantity, removeItem, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Panier vide
  if (state.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-3xl font-bold mb-2">Votre panier est vide</h1>
            <p className="text-muted-foreground mb-6">
              Découvrez nos produits et ajoutez-les à votre panier !
            </p>
            <Link href="/products">
              <Button size="lg" className="cursor-pointer">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Découvrir nos produits
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mon Panier</h1>
            <p className="text-muted-foreground">
              {state.totalItems} article{state.totalItems > 1 ? "s" : ""} dans
              votre panier
            </p>
          </div>
          <Button
            variant="outline"
            onClick={clearCart}
            className="cursor-pointer"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Vider le panier
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des produits */}
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item) => (
              <Card key={item.product._id}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:grid sm:grid-cols-[80px_1fr_120px_80px_40px] sm:gap-4 sm:items-center gap-4">
                    {/* Mobile: structure actuelle */}
                    <div className="flex items-start gap-3 sm:contents">
                      {/* Image */}
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                        <Image
                          src={item.product.thumbnail}
                          alt={item.product.title}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>

                      {/* Infos - limitées sur desktop avec sm:contents */}
                      <div className="flex-1 min-w-0 sm:min-w-0">
                        <Link
                          href={`/products/${item.product._id}`}
                          className="cursor-pointer hover:underline"
                        >
                          <h3 className="font-semibold text-base sm:text-lg truncate">
                            {item.product.title}
                          </h3>
                        </Link>
                        {item.product.brand && (
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">
                            {item.product.brand}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1 sm:mt-2">
                          <span className="font-bold text-base sm:text-lg">
                            {item.product.price.toFixed(2)}€
                          </span>
                          {item.product.discountPercentage > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              -{item.product.discountPercentage}%
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Contrôles - séparés sur desktop */}
                    <div className="flex items-center justify-between sm:contents">
                      <div className="flex items-center gap-3 sm:gap-2 sm:justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateQuantity(
                              item.product._id,
                              Math.max(1, item.quantity - 1)
                            )
                          }
                          className="cursor-pointer h-8 w-8 p-0"
                        >
                          <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>

                        <span className="font-semibold min-w-[2rem] text-center text-sm sm:text-base">
                          {item.quantity}
                        </span>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.product._id, item.quantity + 1)
                          }
                          className="cursor-pointer h-8 w-8 p-0"
                        >
                          <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>

                      {/* Prix total */}
                      <div className="text-right">
                        <p className="font-bold text-base sm:text-lg">
                          {(item.product.price * item.quantity).toFixed(2)}€
                        </p>
                      </div>

                      {/* Supprimer */}
                      <div className="flex justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(item.product._id)}
                          className="cursor-pointer text-destructive hover:text-destructive h-8 w-8 p-0"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Résumé de commande */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Résumé de la commande</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Sous-total ({state.totalItems} articles)</span>
                  <span className="font-semibold">
                    {state.totalPrice.toFixed(2)}€
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Livraison</span>
                  <span className="text-green-600 font-semibold">Gratuite</span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-xl font-bold">
                      {state.totalPrice.toFixed(2)}€
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button
                    size="lg"
                    className="w-full cursor-pointer"
                    onClick={() => {
                      if (isAuthenticated) {
                        router.push("/payment");
                      } else {
                        router.push("/users/login");
                      }
                    }}
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    {isAuthenticated
                      ? "Passer la commande"
                      : "Se connecter pour commander"}
                  </Button>

                  <Link href="/products">
                    <Button variant="outline" className="w-full cursor-pointer">
                      Continuer mes achats
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
