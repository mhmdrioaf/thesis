import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

async function handler(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  const product = await db.product.findFirst({
    where: {
      id: parseInt(id),
    },
    include: {
      seller: true,
    },
  });

  if (product) {
    return NextResponse.json({
      ok: true,
      product: JSON.stringify(product, (_, v) =>
        typeof v === "bigint" ? v.toString() : v
      ),
    });
  } else {
    return NextResponse.json({ ok: false, product: null });
  }
}

export { handler as GET };
