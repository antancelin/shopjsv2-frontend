"use client";

import { useState } from "react";
import { Product } from "@/schemas/product";
import SearchBar from "@/components/product/search-bar";
import ProductList from "@/components/product/product-list";

interface ProductsClientProps {
  initialProducts: Product[];
}

export default function ProductsClient({
  initialProducts,
}: ProductsClientProps) {
  const [filteredProducts, setFilteredProducts] = useState(initialProducts);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredProducts(initialProducts);
    } else {
      const filtered = initialProducts.filter(
        (product) =>
          product.title.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()) ||
          (product.brand?.toLowerCase().includes(query.toLowerCase()) ??
            false) ||
          product.category.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  return (
    <>
      <SearchBar onSearch={handleSearch} />
      <ProductList products={filteredProducts} />
    </>
  );
}
