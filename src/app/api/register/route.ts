import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import * as bcrypt from "bcrypt";
import { Prisma } from "@prisma/client";

interface RequestBody {
  username: string;
  name: string;
  email: string;
  password: string;
}

const handler = async (request: NextRequest) => {
  const body: RequestBody = await request.json();

  try {
    const newUser = await db.customer.create({
      data: {
        username: body.username,
        name: body.name,
        email: body.email,
        password: await bcrypt.hash(body.password, 10),
      },
    });

    const { password, ...result } = newUser;
    return new NextResponse(JSON.stringify(result));
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Email or username are already registered." },
          {
            status: 409,
            statusText: "Email or username are already registered",
          }
        );
      }
    }
  }
};

export { handler as GET, handler as POST };
