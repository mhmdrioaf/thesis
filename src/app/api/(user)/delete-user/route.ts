import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  id: string;
  username: string;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  const currentUser = await db.customer.findFirst({
    where: {
      username: body.username,
    },
    select: {
      id: true,
    },
  });

  const seller = await db.seller.findFirst({
    where: {
      username: body.username,
    },
    select: {
      id: true,
    },
  });

  if (currentUser && body.id === currentUser.id) {
    try {
      const user = await db.customer.delete({
        where: {
          id: currentUser.id,
        },
      });

      if (user) {
        return NextResponse.json({ ok: true });
      } else {
        return NextResponse.json({ ok: false });
      }
    } catch (err) {
      console.error(err);
    }
  } else if (seller && body.id === seller.id) {
    try {
      const user = await db.seller.delete({
        where: {
          id: seller.id,
        },
      });

      if (user) {
        return NextResponse.json({ ok: true });
      } else {
        return NextResponse.json({ ok: false });
      }
    } catch (err) {
      console.error(err);
    }
  } else {
    return NextResponse.json({
      ok: false,
      cause: "The username that you entered is incorrect.",
    });
  }
}

export { handler as POST };
