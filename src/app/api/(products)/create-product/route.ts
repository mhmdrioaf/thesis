import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  name: string;
  price: number;
  description: string;
  seller: string;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  const newProduct = await db.product.create({
    data: {
      name: body.name,
      description: body.description,
      price: body.price,
      seller: body.seller,
    },
  });

  return new NextResponse(JSON.stringify(newProduct));
}

export { handler as POST };
