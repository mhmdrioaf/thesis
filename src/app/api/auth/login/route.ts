import { db } from "@/lib/db";
import * as bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  username: string;
  password: string;
}

const handler = async (request: NextRequest) => {
  const body: RequestBody = await request.json();

  const user = await db.user.findFirst({
    where: {
      OR: [
        {
          email: body.username,
        },
        {
          username: body.username,
        },
      ],
    },
  });

  if (user && (await bcrypt.compare(body.password, user.password!))) {
    const { password, ...result } = user;
    return new NextResponse(JSON.stringify(result));
  } else return new NextResponse(JSON.stringify(null));
};

export { handler as POST };
