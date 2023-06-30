import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  addressId: string;
  userId?: string;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  const removeMainAddress = await db.address.updateMany({
    where: {
      id: {
        not: body.addressId,
      },
    },
    data: {
      mainAddressFor: null,
    },
  });

  if (removeMainAddress) {
    try {
      const address = await db.address.update({
        where: {
          id: body.addressId,
        },
        data: {
          mainAddressFor: body.userId,
        },
      });

      if (address) {
        return NextResponse.json({ ok: true });
      } else {
        return NextResponse.json({ ok: false });
      }
    } catch (err) {
      console.error(err);
    }
  }
}

export { handler as POST };
