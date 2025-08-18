import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Eye } from "lucide-react";
import { Product } from "@/schemas/product";
import QuantityControls from "@/components/product/quantity-controls";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Calcul du prix avec remise
  const originalPrice = product.price;
  const discountedPrice =
    originalPrice * (1 - product.discountPercentage / 100);

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader className="p-4">
        {/* Image produit */}
        <div className="relative aspect-square w-full mb-4">
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            className="object-cover rounded-md"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {product.discountPercentage > 0 && (
            <Badge variant="destructive" className="absolute top-2 right-2">
              -{product.discountPercentage.toFixed(0)}%
            </Badge>
          )}
        </div>

        {/* Titre et marque */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg line-clamp-2">
            {product.title}
          </h3>
          <p className="text-sm text-muted-foreground">{product.brand}</p>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0 flex-1">
        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-4">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">
            {product.rating.toFixed(1)}
          </span>
          <span className="text-xs text-muted-foreground">
            ({product.reviews.length} avis)
          </span>
        </div>

        {/* Prix */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold">
              {discountedPrice.toFixed(2)}€
            </span>
            {product.discountPercentage > 0 && (
              <span className="text-sm text-muted-foreground line-through">
                {originalPrice.toFixed(2)}€
              </span>
            )}
          </div>
        </div>

        {/* Stock */}
        <div className="mt-2">
          {product.stock > 0 ? (
            <Badge variant="secondary" className="text-xs">
              {product.stock} en stock
            </Badge>
          ) : (
            <Badge variant="destructive" className="text-xs">
              Rupture de stock
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 space-y-3">
        {/* Contrôles de quantité */}
        <QuantityControls
          product={product}
          variant="compact"
          className="w-full justify-center"
        />

        {/* Bouton voir détails */}
        <Link href={`/products/${product._id}`} className="w-full">
          <Button variant="outline" size="sm" className="w-full">
            <Eye className="h-4 w-4 mr-2" />
            Voir détails
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
