"use client";

import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CreditCard, MapPin, Check } from "lucide-react";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createOrder } from "@/lib/api/orders";
import { CartItem, CartState } from "@/types/cart";

// type for the form state
interface FormState {
  success: boolean;
  error?: string;
  message?: string;
}

// action to create an order
async function createOrderAction(
  _prevState: FormState, // not used
  formData: FormData
): Promise<FormState> {
  // get data from form
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const address1 = formData.get("address1") as string;
  const address2 = formData.get("address2") as string;
  const postalCode = formData.get("postalCode") as string;
  const city = formData.get("city") as string;
  const phone = formData.get("phone") as string;

  const token = (formData.get("token") as string) || undefined;
  const cartRaw = formData.get("cart") as string;
  const cartData = cartRaw ? (JSON.parse(cartRaw) as CartState) : undefined;

  if (!firstName || firstName.trim().length < 2) {
    return {
      success: false,
      error: "Le prénom doit contenir au moins 2 caractères",
    };
  }

  if (!lastName || lastName.trim().length < 2) {
    return {
      success: false,
      error: "Le nom doit contenir au moins 2 caractères",
    };
  }

  if (!address1 || address1.trim().length < 5) {
    return {
      success: false,
      error: "L'adresse doit contenir au moins 5 caractères",
    };
  }

  if (!postalCode || !/^[0-9]{5}$/.test(postalCode)) {
    return {
      success: false,
      error: "Le code postal doit contenir 5 chiffres",
    };
  }

  if (!city || city.trim().length < 2) {
    return {
      success: false,
      error: "La ville doit contenir au moins 2 caractères",
    };
  }

  if (!phone || !/^[0-9\s\-\+\.]{10,}$/.test(phone)) {
    return {
      success: false,
      error: "Le numéro de téléphone n'est pas valide",
    };
  }

  if (!token) {
    return {
      success: false,
      error: "Session expirée, veuillez vous reconnecter",
    };
  }

  if (!cartData?.items || cartData.items.length === 0) {
    return {
      success: false,
      error: "Votre panier est vide",
    };
  }

  try {
    // create address with the correct format
    const fullAddress = [
      `${firstName.trim()} ${lastName.trim()}`,
      address1.trim(),
      address2?.trim() || "",
      `${postalCode} ${city.trim()}`,
      `Tél: ${phone.trim()}`,
    ]
      .filter(Boolean)
      .join("\n");

    const orderData = {
      address: fullAddress,
      price: cartData.totalPrice,
      products: cartData.items.map((item: CartItem) => ({
        product: item.product._id.toString(),
        quantity: Number(item.quantity),
      })),
    };

    await createOrder(orderData, token);

    return {
      success: true,
      message: "Commande passée avec succès !",
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Erreur lors de la création de la commande";
    return {
      success: false,
      error: errorMessage,
    };
  }
}

export default function PaymentClient() {
  const { state, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  const [formState, formAction, isPending] = useActionState(createOrderAction, {
    success: false,
    error: undefined,
    message: undefined,
  });

  // redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/users/login");
    }
  }, [isAuthenticated, router]);

  // redirect if cart is empty
  useEffect(() => {
    if (!formState.success && state.items.length === 0) {
      router.push("/cart");
    }
  }, [state.items.length, formState.success, router]);

  // redirect after success + clear cart
  useEffect(() => {
    if (formState.success) {
      clearCart();
    }
  }, [formState.success, clearCart]);

  if (!isAuthenticated || (state.items.length === 0 && !formState.success)) {
    return <div>Chargement...</div>;
  }

  // success
  if (formState.success) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-green-600">
              Commande confirmée !
            </h1>
            <p className="text-muted-foreground mb-4">{formState.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/cart">
            <Button variant="outline" size="sm" className="cursor-pointer">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour au panier
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Finaliser ma commande</h1>
            <p className="text-muted-foreground">
              Vérifiez vos articles et renseignez votre adresse de livraison
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* order summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Récapitulatif de votre commande
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* list of products */}
                <div className="space-y-3">
                  {state.items.map((item) => (
                    <div
                      key={item.product._id}
                      className="flex items-center gap-3 py-3 border-b"
                    >
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <Image
                          src={item.product.thumbnail}
                          alt={item.product.title}
                          fill
                          className="object-cover rounded"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate text-sm">
                          {item.product.title}
                        </h4>
                        {item.product.brand && (
                          <p className="text-xs text-muted-foreground">
                            {item.product.brand}
                          </p>
                        )}
                      </div>

                      <div className="text-center">
                        <div className="flex items-center gap-1">
                          <span className="text-sm">{item.quantity}</span>
                          <span className="text-xs text-muted-foreground">
                            ×
                          </span>
                          <span className="text-sm font-medium">
                            {item.product.price.toFixed(2)}€
                          </span>
                        </div>
                      </div>

                      <div className="text-right font-semibold">
                        {(item.product.price * item.quantity).toFixed(2)}€
                      </div>
                    </div>
                  ))}
                </div>

                {/* totals */}
                <div className="space-y-2 pt-4">
                  <div className="flex justify-between">
                    <span>Sous-total ({state.totalItems} articles)</span>
                    <span className="font-semibold">
                      {state.totalPrice.toFixed(2)}€
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Livraison</span>
                    <span className="text-green-600 font-semibold">
                      Gratuite
                    </span>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">Total</span>
                      <span className="text-xl font-bold text-primary">
                        {state.totalPrice.toFixed(2)}€
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* address form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Adresse de livraison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form action={formAction} className="space-y-4">
                  <input type="hidden" name="token" value={user?.token ?? ""} />
                  <input
                    type="hidden"
                    name="cart"
                    value={JSON.stringify(state)}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Prénom */}
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="Jean"
                        required
                        disabled={isPending}
                      />
                    </div>

                    {/* Nom */}
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Dupont"
                        required
                        disabled={isPending}
                      />
                    </div>
                  </div>

                  {/* Adresse ligne 1 */}
                  <div className="space-y-2">
                    <Label htmlFor="address1">Adresse *</Label>
                    <Input
                      id="address1"
                      name="address1"
                      placeholder="123 Rue de la Paix"
                      required
                      disabled={isPending}
                    />
                  </div>

                  {/* Adresse ligne 2 (optionnel) */}
                  <div className="space-y-2">
                    <Label htmlFor="address2">Complément d&apos;adresse</Label>
                    <Input
                      id="address2"
                      name="address2"
                      placeholder="Appartement, étage, bâtiment..."
                      disabled={isPending}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Code postal */}
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Code postal *</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        placeholder="75001"
                        required
                        disabled={isPending}
                      />
                    </div>

                    {/* Ville */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="city">Ville *</Label>
                      <Input
                        id="city"
                        name="city"
                        placeholder="Paris"
                        required
                        disabled={isPending}
                      />
                    </div>
                  </div>

                  {/* Téléphone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="06 12 34 56 78"
                      required
                      disabled={isPending}
                    />
                  </div>

                  {formState.error && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                      <p className="text-sm text-destructive">
                        {formState.error}
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full cursor-pointer"
                    disabled={isPending}
                  >
                    {isPending ? (
                      "Création en cours..."
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Confirmer ma commande ({state.totalPrice.toFixed(2)}€)
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    En confirmant, vous acceptez nos conditions de vente
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
