import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  addressId: string;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  try {
    const deletedAddress = await db.address.delete({
      where: {
        id: body.addressId,
      },
    });

    if (deletedAddress) {
      return NextResponse.json({ ok: true });
    } else {
      return NextResponse.json({ ok: false });
    }
  } catch (err) {
    console.error(err);
  }
}

export { handler as POST };
