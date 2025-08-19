export const revalidate = 0;

import { NextResponse } from "next/server";
import { getOrders } from "@/lib/api/orders";

const cache = new Map<string, { data: unknown; expiresAt: number }>();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const key = `orders:${token}`;
  const now = Date.now();
  const hit = cache.get(key);
  if (hit && hit.expiresAt > now) {
    return NextResponse.json(hit.data);
  }

  const data = await getOrders(token);
  cache.set(key, { data, expiresAt: now + 60_000 }); // 1 minute
  return NextResponse.json(data);
}
