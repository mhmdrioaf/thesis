import { db } from "@/lib/db";
import * as bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  username: string;
  password: string;
}

const handler = async (request: NextRequest) => {
  const body: RequestBody = await request.json();

  const customer = await db.customer.findFirst({
    where: {
      OR: [
        {
          email: body.username,
        },
        {
          username: body.username,
        },
      ],
    },
  });

  const seller = await db.seller.findFirst({
    where: {
      OR: [
        {
          email: body.username,
        },
        {
          username: body.username,
        },
      ],
    },
  });

  if (customer && (await bcrypt.compare(body.password, customer.password!))) {
    const { password, ...result } = customer;
    return new NextResponse(
      JSON.stringify(result, (_, v) =>
        typeof v === "bigint" ? v.toString() : v
      )
    );
  } else if (seller && (await bcrypt.compare(body.password, seller.password))) {
    const { password, ...result } = seller;
    return new NextResponse(
      JSON.stringify(result, (_, v) =>
        typeof v === "bigint" ? v.toString() : v
      )
    );
  }
  return new NextResponse(JSON.stringify(null));
};

export { handler as POST };
