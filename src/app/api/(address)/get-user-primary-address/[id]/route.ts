import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

async function handler(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  const primaryAddress = await db.address.findFirst({
    where: {
      primaryAddressFor: id,
    },
  });

  if (primaryAddress) {
    return NextResponse.json({
      ok: true,
      address: JSON.stringify(primaryAddress, (_, v) =>
        typeof v === "bigint" ? v.toString() : v
      ),
      error: null,
    });
  } else {
    return NextResponse.json({
      ok: false,
      address: null,
      error: "No address founded",
    });
  }
}

export { handler as GET };
