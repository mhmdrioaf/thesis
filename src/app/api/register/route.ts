import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import * as bcrypt from "bcrypt";

interface RequestBody {
  username?: string;
  name: string;
  email: string;
  password: string;
}

const handler = async (request: NextRequest) => {
  const body: RequestBody = await request.json();

  const newUser = await db.user.create({
    data: {
      username: body.username,
      name: body.name,
      email: body.email,
      password: await bcrypt.hash(body.password, 10),
    },
  });

  const { password, ...result } = newUser;
  return new NextResponse(JSON.stringify(result));
};

export { handler as GET, handler as POST };
