import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

async function handler(
  request: NextRequest,
  { params }: { params: { productId: string } }
) {
  try {
    const deletedProduct = await db.product.delete({
      where: {
        id: Number(params.productId),
      },
    });

    if (deletedProduct) {
      return NextResponse.json({ ok: true });
    } else {
      return NextResponse.json({ ok: false });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false });
  }
}

export { handler as DELETE };
