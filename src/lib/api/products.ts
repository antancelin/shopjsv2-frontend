import { apiGet, apiGetNoCache, apiPost } from "./client";
import { ProductSchema, ProductsSchema, Product } from "@/schemas/product";

// === SERVER COMPONENTS (3min cache) ===

/**
 * get all products
 * cache: 3min
 */
export async function getProducts(search?: string): Promise<Product[]> {
  const endpoint = search
    ? `/products?search=${encodeURIComponent(search)}`
    : "/products";

  return apiGet<Product[]>(endpoint, ProductsSchema, 3);
}

/**
 * get product by id
 * cache: 3min
 */
export async function getProductById(id: string): Promise<Product> {
  return apiGet<Product>(`/products/${id}`, ProductSchema, 3);
}

// === CLIENT COMPONENTS (no cache) ===

/**
 * get all products
 * no cache
 */
export async function fetchProducts(search?: string): Promise<Product[]> {
  const endpoint = search
    ? `/products?search=${encodeURIComponent(search)}`
    : "/products";

  return apiGetNoCache<Product[]>(endpoint, ProductsSchema);
}

/**
 * get product by id
 * no cache
 */
export async function fetchProductById(id: string): Promise<Product> {
  return apiGetNoCache<Product>(`/products/${id}`, ProductSchema);
}

// === ADMIN FUNCTIONS (1min cache) ===

/**
 * initialize db w/ products by default
 * only dev mode
 */
export async function initializeDb(): Promise<{ message: string }> {
  return apiPost<{ message: string }>("/create-db");
}
