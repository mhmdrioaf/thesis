"use client";

import Button from "@/components/buttons/Button";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  decimalNumber,
  getUserOrders,
  makePayment,
  rupiahConverter,
} from "@/lib/helper";
import ModalsContainer from "@/components/container/ModalsContainer";
import LoadingSpinner from "@/components/indicators/LoadingSpinner";

export default function OrdersList() {
  const [ordersList, setOrdersList] = useState<CustomerOrder[] | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, update, status } = useSession();

  async function payment(totalAmount: number, orderID: string) {
    setIsLoading(true);
    const paymentResponse = await makePayment(totalAmount, orderID);

    setPaymentDetails(paymentResponse);
    setIsLoading(false);
  }

  function dateConverter(date: string | number | Date) {
    const convertedDate = new Date(date);
    const years = convertedDate.getFullYear();
    const month = convertedDate.getMonth();
    const day = convertedDate.getDate();

    const shownDate = `${decimalNumber(day)}-${decimalNumber(month)}-${years}`;

    return shownDate;
  }

  function closeModal() {
    setPaymentDetails(null);
    update();
  }

  useEffect(() => {
    async function fetchOrders() {
      setIsLoading(true);
      if (session) {
        const orders = await getUserOrders(session.user.id);
        if (orders) {
          setOrdersList(orders);
          setIsLoading(false);
        }
      }
    }
    fetchOrders();
  }, [session]);

  return (
    <div className="w-full px-4 py-4 flex flex-col gap-8 border border-gray-300 rounded-lg">
      {status === "loading" ? (
        <LoadingSpinner />
      ) : (
        <>
          {!ordersList ||
            (ordersList.length <= 0 && (
              <p className="text-gray-500">There is no order yet.</p>
            ))}
          {ordersList &&
            ordersList.map((order: CustomerOrder) => (
              <div
                key={order.id}
                className="w-full px-4 py-4 flex flex-row gap-4 justify-between items-center border border-gray-300 rounded-md"
              >
                <div className="flex flex-col gap-4">
                  <p>{order.id}</p>
                  <p>{rupiahConverter(order.totalPrice)}</p>
                </div>
                {!order.va ? (
                  <div className="w-32">
                    <Button
                      variants="PRIMARY"
                      fullWidth
                      onClick={() => payment(order.totalPrice, order.id)}
                      disabled={isLoading}
                    >
                      Pay
                    </Button>
                  </div>
                ) : (
                  <p>Virtual Account Number: {order.va} </p>
                )}
              </div>
            ))}
        </>
      )}

      {paymentDetails && (
        <ModalsContainer
          title="Invoice"
          description="This is the amount of money that you have to pay, to complete the transactions."
          onClose={closeModal}
        >
          <div className="w-full flex flex-col gap-4">
            <div className="w-full grid grid-cols-2">
              <b>Bank name:</b>
              <b>{paymentDetails.bank_code}</b>
            </div>

            <div className="w-full grid grid-cols-2">
              <b>VA Number:</b>
              <p>{paymentDetails.account_number}</p>
            </div>

            <div className="w-full grid grid-cols-2">
              <b>Bank account name:</b>
              <p>{paymentDetails.name}</p>
            </div>

            <div className="w-full grid grid-cols-2">
              <b>Total amount:</b>
              <p>{rupiahConverter(paymentDetails.expected_amount)}</p>
            </div>

            <b>Pay before: {dateConverter(paymentDetails.expiration_date)}</b>
          </div>
        </ModalsContainer>
      )}
    </div>
  );
}
