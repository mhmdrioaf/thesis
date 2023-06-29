import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

async function handler(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const user = await db.user.findFirst({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      phoneNumber: true,
      addresses: true,
      image: true,
      birthdate: true,
      email: true,
      username: true,
      mainAddress: true,
    },
  });

  if (user) {
    return new NextResponse(
      JSON.stringify(user, (_, v) => (typeof v === "bigint" ? v.toString() : v))
    );
  } else {
    return new NextResponse(null);
  }
}

export { handler as GET };
