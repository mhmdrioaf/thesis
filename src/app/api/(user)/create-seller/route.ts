import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import * as bcrypt from "bcrypt";

interface RequestBody {
  name: string;
  email: string;
  username: string;
  password: string;
  token: string;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  const newSeller = await db.seller.create({
    data: {
      email: body.email,
      name: body.name,
      password: await bcrypt.hash(body.password, 10),
      token: body.token,
      username: body.username,
    },
  });

  if (newSeller) {
    return NextResponse.json({
      ok: true,
      message: "Successfully added new seller.",
    });
  } else {
    return NextResponse.json({
      ok: false,
      message: "An error occurred when creating new seller.",
    });
  }
}

export { handler as POST };
