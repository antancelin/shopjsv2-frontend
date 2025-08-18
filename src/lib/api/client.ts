import { z } from "zod";

// base url
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// cache options interface
interface CacheOptions {
  // cache in ms (server components)
  revalidate?: number;
  // no cache (client components)
  noCache?: boolean;
}

// main helper for all requests
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  schema?: z.ZodSchema<T>,
  cacheOptions: CacheOptions = {}
): Promise<T> {
  // cache options
  let nextConfig = {};
  if (cacheOptions?.revalidate) {
    nextConfig = {
      next: {
        revalidate: cacheOptions.revalidate,
      },
    };
  } else if (cacheOptions?.noCache) {
    nextConfig = { cache: "no-store" };
  }

  // build response
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...nextConfig,
    ...options,
  });

  // check if response is ok
  if (!response.ok) {
    // unify error response
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }

  const data = await response.json();

  // auto zod validation if schema is provided
  if (schema) {
    return schema.parse(data);
  }

  // return data
  return data;
}

// GET requests helper w/ cache (server components)
export async function apiGet<T>(
  endpoint: string,
  schema?: z.ZodSchema<T>,
  cacheMinutes: number = 3 // default 3 minutes
): Promise<T> {
  return apiRequest<T>(endpoint, { method: "GET" }, schema, {
    revalidate: cacheMinutes * 60,
  });
}

// GET requests helper w/ no cache (client components)
export async function apiGetNoCache<T>(
  endpoint: string,
  schema?: z.ZodSchema<T>
): Promise<T> {
  return apiRequest<T>(endpoint, { method: "GET" }, schema, { noCache: true });
}

// POST requests helper
export async function apiPost<T>(
  endpoint: string,
  data?: unknown,
  schema?: z.ZodSchema<T>
): Promise<T> {
  return apiRequest<T>(
    endpoint,
    { method: "POST", body: data ? JSON.stringify(data) : undefined },
    schema,
    { noCache: true }
  );
}

// PUT requests helper
export async function apiPut<T>(
  endpoint: string,
  data?: unknown,
  schema?: z.ZodSchema<T>
): Promise<T> {
  return apiRequest<T>(
    endpoint,
    { method: "PUT", body: data ? JSON.stringify(data) : undefined },
    schema,
    { noCache: true }
  );
}

// authenticated requests helper
export async function authenticatedRequest<T>(
  endpoint: string,
  token: string,
  options: RequestInit = {},
  schema?: z.ZodSchema<T>,
  cacheOptions?: CacheOptions
): Promise<T> {
  return apiRequest<T>(
    endpoint,
    {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    },
    schema,
    cacheOptions
  );
}

// admin requests helper (1min cache)
export async function adminRequest<T>(
  endpoint: string,
  token: string,
  options: RequestInit = {},
  schema?: z.ZodSchema<T>
): Promise<T> {
  return authenticatedRequest<T>(endpoint, token, options, schema, {
    revalidate: 60,
  });
}
