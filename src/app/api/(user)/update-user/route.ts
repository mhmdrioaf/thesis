import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import * as bcrypt from "bcrypt";

interface RequestBody {
  id: string;
  name?: string;
  phoneNumber?: number;
  image?: string;
  username?: string;
  email?: string;
  birthdate?: Date;
  currentPassword?: string;
  newPassword?: string;
  storeAddress?: string;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  const customer = await db.customer.findFirst({ where: { id: body.id } });
  const seller = await db.seller.findFirst({ where: { id: body.id } });

  if (body.currentPassword && body.newPassword) {
    if (customer) {
      if (
        customer &&
        (await bcrypt.compare(body.currentPassword, customer.password!))
      ) {
        const updateUserPassword = await db.customer.update({
          where: {
            id: body.id,
          },
          data: {
            password: await bcrypt.hash(body.newPassword, 10),
          },
        });

        return NextResponse.json({ ok: true, message: "Password changed!" });
      } else {
        return NextResponse.json({
          ok: false,
          message: "Current password isn't correct!",
        });
      }
    } else if (seller) {
      if (
        seller &&
        (await bcrypt.compare(body.currentPassword, seller.password!))
      ) {
        const updateUserPassword = await db.seller.update({
          where: {
            id: body.id,
          },
          data: {
            password: await bcrypt.hash(body.newPassword, 10),
          },
        });

        return NextResponse.json({ ok: true, message: "Password changed!" });
      } else {
        return NextResponse.json({
          ok: false,
          message: "Current password isn't correct!",
        });
      }
    }
  }

  try {
    if (customer) {
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
    } else if (seller) {
      const user = await db.seller.update({
        where: {
          id: body.id,
        },
        data: {
          email: body.email,
          imageURL: body.image,
          name: body.name,
          storeAddress: body.storeAddress,
          username: body.username,
          phoneNumber: body.phoneNumber,
        },
      });

      if (user) {
        return NextResponse.json({ ok: true });
      } else {
        return NextResponse.json({ ok: false });
      }
    } else {
      return NextResponse.json({ ok: false, message: "Unknown error." });
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
