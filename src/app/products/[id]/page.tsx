import { getProductById } from "@/lib/api/products";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star } from "lucide-react";
import QuantityControls from "@/components/product/quantity-controls";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  try {
    const product = await getProductById(id);

    // calculate discounted price
    const discountedPrice =
      product.price * (1 - product.discountPercentage / 100);

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/products">
            <Button variant="ghost" size="sm" className="cursor-pointer">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux produits
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="aspect-square relative">
              <Image
                src={product.thumbnail}
                alt={product.title}
                fill
                className="object-cover rounded-lg"
                priority
              />
              {product.discountPercentage > 0 && (
                <Badge variant="destructive" className="absolute top-4 right-4">
                  -{product.discountPercentage.toFixed(0)}%
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(0, 4).map((image, index) => (
                <div key={index} className="aspect-square relative">
                  <Image
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground">{product.brand}</p>
              <h1 className="text-3xl font-bold">{product.title}</h1>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-2xl font-bold">
                  {discountedPrice.toFixed(2)}€
                </span>
                {product.discountPercentage > 0 && (
                  <span className="text-lg text-muted-foreground line-through">
                    {product.price.toFixed(2)}€
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{product.rating.toFixed(1)}</span>
              <span className="text-muted-foreground">
                ({product.reviews.length} avis)
              </span>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            <div>
              {product.stock > 0 ? (
                <Badge variant="secondary">{product.stock} en stock</Badge>
              ) : (
                <Badge variant="destructive">Rupture de stock</Badge>
              )}
            </div>

            <div className="py-4">
              <QuantityControls product={product} />
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• {product.warrantyInformation}</p>
              <p>• {product.shippingInformation}</p>
              <p>• {product.returnPolicy}</p>
            </div>
          </div>
        </div>

        {/* reviews */}
        {product.reviews.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Avis clients</h2>
            <div className="grid gap-4">
              {product.reviews.slice(0, 3).map((review, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        {review.reviewerName}
                      </CardTitle>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{review.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  } catch (error: unknown) {
    console.error(error);
    notFound();
  }
}
