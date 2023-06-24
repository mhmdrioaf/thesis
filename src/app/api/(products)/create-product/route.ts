import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  name: string;
  price: number;
  description: string;
  seller: string;
  thumbnail?: string;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  const verifySeller = await db.user.findFirst({
    where: {
      id: body.seller,
    },
  });

  if (verifySeller) {
    const newProduct = await db.product.create({
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        seller: body.seller,
        thumbnail: body.thumbnail,
      },
    });

    return new NextResponse(JSON.stringify(newProduct));
  }

  return NextResponse.json({ error: "no-session" }, { status: 500 });
}

export { handler as POST };
