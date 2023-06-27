import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  id: string;
  name?: string;
  phoneNumber?: number;
  image?: string;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  const user = await db.user.update({
    where: {
      id: body.id,
    },
    data: {
      name: body.name,
      image: body.image,
    },
  });

  if (user) {
    const { password, ...result } = user;
    return new NextResponse(JSON.stringify(result));
  } else {
    return NextResponse.json({ error: "An error occured" });
  }
}

export { handler as POST };
