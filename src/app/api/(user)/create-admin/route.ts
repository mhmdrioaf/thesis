import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import * as bcrypt from "bcrypt";

interface RequestBody {
  name: string;
  username: string;
  email: string;
  password: string;
  imageURL?: string;
  token: string;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  try {
    const administrator = await db.administrator.create({
      data: {
        name: body.name,
        username: body.username,
        email: body.email,
        password: await bcrypt.hash(body.password, 10),
        token: body.token,
      },
    });

    if (administrator) {
      return NextResponse.json({
        ok: true,
        error: { code: null, message: null },
        message: "Administrator account created succesfully.",
      });
    } else {
      return NextResponse.json({
        ok: false,
        error: {
          code: "no-access",
          message: "You have no access to make this request!",
        },
        message: null,
      });
    }
  } catch (err) {
    console.error(err);
  }
}

export { handler as POST };
