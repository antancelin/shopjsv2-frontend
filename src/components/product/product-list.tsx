import ProductCard from "@/components/product/product-card";
import { Product } from "@/schemas/product";

interface ProductListProps {
  products: Product[];
  isLoading?: boolean;
  error?: string;
}

export default function ProductList({
  products,
  isLoading,
  error,
}: ProductListProps) {
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive text-lg">Erreur : {error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-muted rounded-lg h-96 animate-pulse" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">Aucun produit trouvé.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
