import { getProducts } from "@/lib/api/products";
import ProductsClient from "@/components/product/products-client";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { search?: string };
}) {
  const params = await searchParams;
  const initialProducts = await getProducts(params.search);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Nos Produits</h1>
        <p className="text-muted-foreground">
          Découvrez notre sélection de {initialProducts.length} produits
        </p>
      </div>

      {/* Client Component pour l'interactivité */}
      <ProductsClient initialProducts={initialProducts} />
    </div>
  );
}
