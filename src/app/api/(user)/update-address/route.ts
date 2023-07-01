import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  userId?: string;
  address: Address;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  if (request.method === "POST") {
    const removeMainAddress = await db.address.updateMany({
      where: {
        id: {
          not: body.address.id,
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
            id: body.address.id,
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

  if (request.method === "PATCH") {
    try {
      const updatedAddress = await db.address.update({
        where: {
          id: body.address.id,
        },
        data: {
          fullAddress: body.address.fullAddress,
          label: body.address.label,
          receiverName: body.address.receiverName,
          receiverPhone: parseInt(body.address.receiverPhone),
        },
      });

      if (updatedAddress) {
        return NextResponse.json({ ok: true });
      } else {
        return NextResponse.json({ ok: false });
      }
    } catch (err) {
      console.error(err);
    }
  }
}

export { handler as POST, handler as PATCH };
