import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  customerId: string;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  const orders = await db.customerOrder.findMany({
    where: {
      customerID: body.customerId,
    },
  });

  if (orders) {
    return NextResponse.json({ ok: true, orders: orders });
  } else {
    return NextResponse.json({ ok: false, orders: null });
  }
}

export { handler as POST };
