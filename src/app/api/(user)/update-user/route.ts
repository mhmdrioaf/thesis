import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  id: string;
  name?: string;
  phoneNumber?: number;
  image?: string;
  username?: string;
  email?: string;
  birthdate?: Date;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  try {
    const user = await db.customer.update({
      where: {
        id: body.id,
      },
      data: {
        name: body.name,
        imageURL: body.image,
        username: body.username,
        email: body.email,
        dateOfBirth: body.birthdate,
        phoneNumber: body.phoneNumber,
      },
    });

    if (user) {
      return NextResponse.json({ ok: true });
    } else {
      return NextResponse.json({ ok: false });
    }
  } catch (error) {
    console.error(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json({ ok: false, cause: error.meta?.target });
      }
    }
  }
}

export { handler as POST };
