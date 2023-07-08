import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

async function handler(
  request: NextRequest,
  { params }: { params: { sellerId: string } }
) {
  try {
    const sellerProducts = await db.product.findMany({
      where: {
        sellerId: params.sellerId,
      },
    });

    if (sellerProducts) {
      return NextResponse.json({
        ok: true,
        products: JSON.stringify(sellerProducts, (_, v) =>
          typeof v === "bigint" ? v.toString() : v
        ),
      });
    } else {
      return NextResponse.json({ ok: false, products: [] });
    }
  } catch (err) {
    return NextResponse.json({ ok: false, cause: err });
  }
}

export { handler as GET };
