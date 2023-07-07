import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  name: string;
  price: number;
  description: string;
  seller: string;
  thumbnail?: string;
  stock: number;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  const verifySeller = await db.seller.findFirst({
    where: {
      id: body.seller,
    },
  });

  if (verifySeller) {
    const newProduct = await db.product.create({
      data: {
        name: body.name,
        descriptions: body.description,
        price: body.price,
        sellerId: body.seller,
        thumbnail: body.thumbnail,
        stock: body.stock,
      },
    });

    return new NextResponse(JSON.stringify(newProduct));
  }

  return NextResponse.json({ error: "no-session" }, { status: 500 });
}

export { handler as POST };
