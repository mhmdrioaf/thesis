import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  name: string;
  price: number;
  description: string;
  seller: string;
  thumbnail?: string;
  stock: number;
  token: string;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  if (body.token === process.env.SELLER_TOKEN) {
    const verifySeller = await db.seller.findFirst({
      where: {
        id: body.seller,
      },
    });

    if (verifySeller) {
      await db.product.create({
        data: {
          name: body.name,
          descriptions: body.description,
          price: body.price,
          sellerId: body.seller,
          thumbnail: body.thumbnail,
          stock: body.stock,
        },
      });

      return NextResponse.json({
        ok: true,
        error: { code: null, message: null },
        message: "The product has been created successfully.",
      });
    }
  } else {
    return NextResponse.json({
      ok: false,
      error: {
        code: "no-access",
        message:
          "You have no access to create products. Either your token is invalid, or your account id is not recognized.",
      },
      message: null,
    });
  }
}

export { handler as POST };
