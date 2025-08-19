import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShoppingBag, Users, Shield, Truck } from "lucide-react";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Bienvenue sur <span className="text-primary">ShopJS</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Découvrez notre sélection de produits de qualité avec une expérience
          d&apos;achat moderne et sécurisée.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products">
            <Button size="lg" className="text-lg px-8">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Découvrir nos produits
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-12">
          Pourquoi choisir ShopJS ?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="text-center">
              <ShoppingBag className="h-12 w-12 mx-auto text-primary" />
              <CardTitle>Large sélection</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Des milliers de produits dans toutes les catégories pour
                répondre à vos besoins.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 mx-auto text-primary" />
              <CardTitle>Paiement sécurisé</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Vos données sont protégées avec nos systèmes de sécurité de
                pointe.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Truck className="h-12 w-12 mx-auto text-primary" />
              <CardTitle>Livraison rapide</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Expédition sous 24h et livraison gratuite dès 50€ d&apos;achat.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Users className="h-12 w-12 mx-auto text-primary" />
              <CardTitle>Support client</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Une équipe dédiée pour vous accompagner dans vos achats 7j/7.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold mb-4">Prêt à commencer ?</h3>
        <p className="text-muted-foreground mb-6">
          Rejoignez des milliers de clients satisfaits et découvrez une nouvelle
          façon de faire du shopping.
        </p>
        <Link href="/products">
          <Button size="lg">Commencer mes achats</Button>
        </Link>
      </section>
    </div>
  );
}
