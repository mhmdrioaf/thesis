import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Xendit from "xendit-node";

interface RequestBody {
  orderId: string;
  totalAmount: number;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  const customerOrder = await db.customerOrder.findFirst({
    where: {
      id: body.orderId,
    },
  });

  if (customerOrder) {
    const x = new Xendit({
      secretKey: process.env.PG_SECRET_TOKEN!,
    });
    const { VirtualAcc } = x;
    const vaSpecifications = {};
    const va = new VirtualAcc(vaSpecifications);

    const response = await va.createFixedVA({
      externalID: "va-13281595039",
      bankCode: "BRI",
      name: "Rio Ananta",
      expectedAmt: body.totalAmount,
      currency: "IDR",
      isSingleUse: true,
      isClosed: true,
    });

    if (response) {
      const res = NextResponse.json({ ok: true, response: response });
      const paymentResponse = await res.json();

      await db.customerOrder.update({
        where: {
          id: body.orderId,
        },
        data: {
          va: paymentResponse.response.account_number,
        },
      });

      return NextResponse.json({ ok: true, response: response });
    } else {
      return NextResponse.json({ ok: false, response: "failed-va" });
    }
  }
}

export { handler as POST };
