export const revalidate = 180;
export const dynamic = "force-static";

import { getProducts } from "@/lib/api/products";
import ProductsClient from "@/components/product/products-client";

export default async function ProductsPage() {
  const initialProducts = await getProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Nos Produits</h1>
        <p className="text-muted-foreground">
          Découvrez notre sélection de {initialProducts.length} produits
        </p>
      </div>

      <ProductsClient initialProducts={initialProducts} />
    </div>
  );
}
