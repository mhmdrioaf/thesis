import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET(request: NextRequest) {
  const products = await db.product.findMany();
  const headersList = headers();
  const date = headersList.get("date");

  if (products) {
    return NextResponse.json(
      {
        ok: true,
        products: JSON.stringify(products, (_, v) =>
          typeof v === "bigint" ? v.toString() : v
        ),
      },
      {
        headers: { date: date ?? Date.now().toLocaleString() },
      }
    );
  } else {
    return NextResponse.json({ ok: false, products: null });
  }
}
