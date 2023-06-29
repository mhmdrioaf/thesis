import { db } from "@/lib/db";
import { Address, Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  id: string;
  name?: string;
  phoneNumber?: number;
  image?: string;
  username?: string;
  email?: string;
  birthdate?: Date;
  address?: Address;
  mainAddress?: string;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();
  const currentUser = await db.user.findFirst({
    where: {
      id: body.id,
    },
    include: {
      addresses: true,
    },
  });

  if (!body.address) {
    try {
      const user = await db.user.update({
        where: {
          id: body.id,
        },
        data: {
          name: body.name,
          image: body.image,
          username: body.username,
          email: body.email,
          birthdate: body.birthdate,
          phoneNumber: body.phoneNumber,
          mainAddress: body.mainAddress,
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
  } else {
    try {
      const user = await db.user.update({
        where: {
          id: body.id,
        },
        data: {
          mainAddress:
            currentUser!.addresses.length <= 0
              ? body.address.id
              : currentUser?.mainAddress,
          addresses: {
            create: {
              id: body.address.id,
              label: body.address.label,
              fullAddress: body.address.fullAddress,
              receiverName: body.address.receiverName,
              receiverPhone: body.address.receiverPhone,
              note: body.address.note,
            },
          },
        },
      });

      if (user) {
        return NextResponse.json({ ok: true });
      } else {
        return NextResponse.json({ ok: false });
      }
    } catch (err) {
      return console.error(err);
    }
  }
}

export { handler as POST };
