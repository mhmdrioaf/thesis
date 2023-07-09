import { db } from "@/lib/db";
import { decimalNumber } from "@/lib/helper";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  customer: {
    customerId: string;
    shippingAddress: Address;
  };
  product: {
    id: number;
    quantity: number;
    price: number;
    sellerId: string;
  };
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  const fetchCustomer = await fetch(
    process.env.NEXT_PUBLIC_API_USER_GET! + `/${body.customer.customerId}`
  );
  const customer: Customer = await fetchCustomer.json();
  const currentDate = new Date();
  const years = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const day = currentDate.getDate();
  const seconds = currentDate.getSeconds();
  const minutes = currentDate.getMinutes();
  const hours = currentDate.getHours();
  const dateTime = `${decimalNumber(day)}${decimalNumber(
    month + 1
  )}${years}${decimalNumber(hours)}${decimalNumber(minutes)}${decimalNumber(
    seconds
  )}`;
  const orderID = `ORD/${dateTime}/${customer.id}`;

  if (customer) {
    try {
      const customerOrder = await db.customerOrder.create({
        data: {
          id: orderID,
          shippingAddress: body.customer.shippingAddress.fullAddress,
          totalPrice: body.product.quantity * body.product.price,
          customerID: customer.id,
          seller: {
            connectOrCreate: {
              create: {
                sellerID: body.product.sellerId,
              },
              where: {
                customerOrderID: orderID,
              },
            },
          },
        },
      });

      if (customerOrder) {
        return NextResponse.json({
          ok: true,
          error: { code: null, message: null },
          message: "Order placed.",
        });
      } else {
        return NextResponse.json({
          ok: false,
          error: { code: "unknown", message: "An error occurred." },
          message: null,
        });
      }
    } catch (err) {
      console.error(err);
    }
  } else {
    return NextResponse.json({
      ok: false,
      error: {
        code: "no-auth",
        message: "You have to login first to place an order.",
      },
      message: null,
    });
  }
}

export { handler as POST };
