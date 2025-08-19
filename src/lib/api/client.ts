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

  // log cache info in development
  if (process.env.NODE_ENV === "development") {
    const cacheInfo = cacheOptions?.revalidate
      ? `Cache: ${cacheOptions.revalidate}s`
      : "No cache";
    console.log(`🌐 API ${options.method || "GET"} ${endpoint} - ${cacheInfo}`);
    console.log(`⏰ ${new Date().toLocaleTimeString()}`);
  }

  async function fetchWithRetry(
    url: string,
    options: RequestInit,
    retries = 2
  ): Promise<Response> {
    for (let i = 0; i <= retries; i++) {
      try {
        const response = await fetch(url, options);
        if (response.status >= 500 && i < retries) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
          continue;
        }
        return response;
      } catch (error) {
        if (i === retries) throw error;
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
    throw new Error("Impossible de contacter le serveur");
  }

  // build response
  const response = await fetchWithRetry(`${API_BASE_URL}${endpoint}`, {
    ...options,
    ...nextConfig,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  // check if response is ok
  if (!response.ok) {
    // unify error response
    const errorData = await response.json().catch(() => ({}));

    // specific error messages by status code + endpoint
    let message = "";

    switch (response.status) {
      case 400:
        if (endpoint.includes("/user/signup")) {
          message = "Veuillez remplir tous les champs requis";
        } else if (endpoint.includes("/orders")) {
          message = "Données de commande invalides";
        } else {
          message = "Données invalides";
        }
        break;

      case 401:
        if (endpoint.includes("/user/login")) {
          message = "Email ou mot de passe incorrect";
        } else {
          message = "Session expirée, veuillez vous reconnecter";
        }
        break;

      case 403:
        message = "Accès refusé - droits administrateur requis";
        break;

      case 404:
        if (endpoint.includes("/products/")) {
          message = "Ce produit n'existe pas ou a été supprimé";
        } else {
          message = "Page ou ressource non trouvée";
        }
        break;

      case 409:
        message = "Cette adresse email est déjà utilisée";
        break;

      case 500:
        message =
          "Erreur serveur temporaire - veuillez réessayer dans quelques instants";
        break;

      default:
        message =
          errorData.message ||
          `Erreur ${response.status} - ${response.statusText}`;
    }

    throw new Error(message);
  }

  const data = await response.json();

  // auto zod validation if schema is provided
  if (schema) {
    try {
      return schema.parse(data);
    } catch (zodError) {
      console.error("Zod validation error:", zodError);
      throw new Error(
        "Données reçues du serveur invalides - veuillez réessayer"
      );
    }
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
