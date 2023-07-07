import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

async function handler(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const customer = await db.customer.findFirst({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      phoneNumber: true,
      addresses: true,
      imageURL: true,
      dateOfBirth: true,
      email: true,
      username: true,
    },
  });

  if (customer) {
    return new NextResponse(
      JSON.stringify(customer, (_, v) =>
        typeof v === "bigint" ? v.toString() : v
      )
    );
  } else {
    return new NextResponse(null);
  }
}

export { handler as GET };
