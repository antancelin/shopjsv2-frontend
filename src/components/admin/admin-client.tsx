"use client";

import { useAuth } from "@/context/auth-context";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { markOrderAsDelivered } from "@/lib/api/orders";
import { Order } from "@/schemas/order";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Package, CheckCircle, Clock, User } from "lucide-react";

export default function AdminClient() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // admin check (redirect if not admin)
  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push("/users/login");
      return;
    }

    if (!user?.admin) {
      router.push("/");
      return;
    }
  }, [isAuthenticated, user, router, isLoading]);

  // fetch orders (with cache)
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.token || !user?.admin) return;

      try {
        setLoading(true);
        const res = await fetch(
          `/api/admin/orders?token=${encodeURIComponent(user.token)}`
        );
        if (!res.ok) throw new Error("Erreur lors du chargement");
        const ordersData: Order[] = await res.json();
        setOrders(ordersData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erreur lors du chargement"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // mark as delivered (update locally)
  const handleMarkDelivered = async (orderId: string) => {
    if (!user?.token) return;

    try {
      await markOrderAsDelivered(orderId, user.token);
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, delivered: true } : order
        )
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la mise à jour"
      );
    }
  };

  // loading
  if (!isAuthenticated || !user?.admin) {
    return <div>Chargement...</div>;
  }

  // loading
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Chargement des commandes...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Shield className="h-8 w-8 text-amber-600" />
          <div>
            <h1 className="text-3xl font-bold">Administration</h1>
            <p className="text-muted-foreground">
              Gestion des commandes - {orders.length} commande
              {orders.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          {orders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Aucune commande trouvée</p>
              </CardContent>
            </Card>
          ) : (
            orders.map((order) => (
              <Card
                key={order._id}
                className={
                  order.delivered ? "bg-green-50 border-green-200" : ""
                }
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Commande #{order._id.slice(-8)}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={order.delivered ? "default" : "secondary"}
                      >
                        {order.delivered ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Livrée
                          </>
                        ) : (
                          <>
                            <Clock className="h-3 w-3 mr-1" />
                            En cours
                          </>
                        )}
                      </Badge>
                      <span className="font-bold text-lg">
                        {order.price.toFixed(2)}€
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium">Adresse de livraison :</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {order.address}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium mb-2">Produits commandés :</p>
                    <div className="space-y-2">
                      {order.products.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm"
                        >
                          <span>{item.quantity}x Produit</span>
                          <span className="text-muted-foreground">
                            ID: {item.product}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {!order.delivered && (
                    <div className="pt-2">
                      <Button
                        onClick={() => handleMarkDelivered(order._id)}
                        className="cursor-pointer"
                        size="sm"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Marquer comme livrée
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
