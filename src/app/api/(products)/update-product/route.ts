import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  productId: number;
  name: string;
  price: number;
  descriptions: string;
  stock: number;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  try {
    const updatedProduct = await db.product.update({
      where: {
        id: body.productId,
      },
      data: {
        name: body.name,
        descriptions: body.descriptions,
        price: body.price,
        stock: body.stock,
      },
    });

    if (updatedProduct) {
      return NextResponse.json({
        ok: true,
        message: "The product has been edited successfully.",
      });
    } else {
      return NextResponse.json({
        ok: false,
        message: "An error occured when editing the product.",
      });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, message: err });
  }
}

export { handler as POST };
