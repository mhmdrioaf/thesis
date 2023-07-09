import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  product: Product;
  token: string;
  actions: string;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();
  const product = await db.product.findFirst({
    where: {
      id: body.product.id,
    },
  });
  const currentDate = new Date();

  if (product && body.token === process.env.ADMINISTRATOR_TOKEN) {
    if (body.actions === "approve") {
      try {
        const approvedProduct = await db.product.update({
          where: {
            id: body.product.id,
          },
          data: {
            status: "APPROVED",
            approvedAt: currentDate,
          },
        });

        if (approvedProduct) {
          return NextResponse.json({
            ok: true,
            error: { code: null, message: null },
            message: "Product has been approved successfully!",
          });
        } else {
          return NextResponse.json({
            ok: false,
            error: {
              code: "product-not-found",
              message: "There are no products indicated to the request.",
            },
            message: null,
          });
        }
      } catch (err) {
        return NextResponse.json({
          ok: false,
          error: { code: "unknown", message: "An error occurred" },
          message: null,
        });
      }
    } else if (body.actions === "reject") {
      try {
        const rejectedProduct = await db.product.update({
          where: {
            id: body.product.id,
          },
          data: {
            status: "REJECTED",
          },
        });

        if (rejectedProduct) {
          return NextResponse.json({
            ok: true,
            error: { code: null, message: null },
            message: "Product has been rejected successfully!",
          });
        } else {
          return NextResponse.json({
            ok: false,
            error: {
              code: "product-not-found",
              message: "There are no products indicated to the request.",
            },
            message: null,
          });
        }
      } catch (err) {
        return NextResponse.json({
          ok: false,
          error: { code: "unknown", message: "An error occurred" },
          message: null,
        });
      }
    }
  } else {
    return NextResponse.json({
      ok: true,
      error: {
        code: "no-access",
        message: "You have no access to make this request!",
      },
      message: null,
    });
  }
}

export { handler as POST };
