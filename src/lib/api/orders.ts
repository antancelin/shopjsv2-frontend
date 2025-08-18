import { authenticatedRequest, adminRequest } from "./client";
import {
  OrderSchema,
  CreateOrderSchema,
  Order,
  CreateOrderData,
} from "@/schemas/order";
import { z } from "zod";

// === USER FUNCTIONS (authenticated) ===

/**
 * create a new order
 * need authentication
 */
export async function createOrder(
  data: CreateOrderData,
  token: string
): Promise<{ message: string }> {
  // validate data client side
  const validatedData = CreateOrderSchema.parse(data);

  return authenticatedRequest<{ message: string }>("/orders", token, {
    method: "POST",
    body: JSON.stringify(validatedData),
  });
}

// === ADMIN FUNCTIONS (authenticated as admin + 1min cache) ===

/**
 * get all orders (admin only)
 * cache: 1min
 */
export async function getOrders(token: string): Promise<Order[]> {
  return adminRequest<Order[]>(
    "/orders",
    token,
    { method: "GET" },
    z.array(OrderSchema)
  );
}

/**
 * mark an order as delivered (admin only
 */
export async function markOrderAsDelivered(
  orderId: string,
  token: string
): Promise<{ message: string }> {
  return authenticatedRequest<{ message: string }>(
    `/orders/mark-delivered/${orderId}`,
    token,
    {
      method: "PUT",
    }
  );
}
