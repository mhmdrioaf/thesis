import { db } from "@/lib/db";
import { Address } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  address: Address;
  userId: string;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  const customer = await db.customer.findFirst({
    where: {
      id: body.userId,
    },
    include: {
      addresses: true,
    },
  });

  const userAddressLength = customer!.addresses.length;
  const newAddress = await db.address.create({
    data: {
      fullAddress: body.address.fullAddress,
      label: body.address.label,
      receiverName: body.address.receiverName,
      receiverPhoneNumber: body.address.receiverPhoneNumber,
      receiverId: body.address.receiverId,
      primaryAddressFor: userAddressLength <= 0 ? body.userId : null,
    },
  });

  if (newAddress) {
    return NextResponse.json({ ok: true });
  } else {
    return NextResponse.json({ ok: false });
  }
}

export { handler as POST };
