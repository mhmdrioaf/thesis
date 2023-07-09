"use client";

import Button from "@/components/buttons/Button";
import Container from "@/components/container/Container";
import LoadingSpinner from "@/components/indicators/LoadingSpinner";
import { fetcher, makeAnOrder, rupiahConverter } from "@/lib/helper";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useState } from "react";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import ShowFormModal from "@/components/utils/ShowFormModal";
import Snackbar from "@/components/snackbars/Snackbar";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";

export default function Product({ params }: { params: { id: string } }) {
  const [qty, setQty] = useState(0);
  const [modalShown, setModalShown] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: session, status } = useSession();
  const {
    data: productData,
    error,
    isLoading,
    isValidating,
  } = useSWR("/api/get-product/" + params.id, fetcher);
  const { data: addressData } = useSWR(
    "/api/get-user-primary-address" + `/${session?.user.id}`,
    fetcher
  );

  const router = useRouter();

  const product: Product | null = productData
    ? JSON.parse(productData.product)
    : null;
  const shippingAddress: string | null = addressData
    ? JSON.parse(addressData.address)
    : null;

  async function placeAnOrder() {
    setSuccess(null);
    setMessage(null);
    setIsSubmitting(true);
    if (shippingAddress === null) {
      setModalShown("address-create");
    } else {
      try {
        if (session) {
          const response = await makeAnOrder(
            session.user.id,
            product ? product : null,
            qty,
            shippingAddress
          );

          if (response.error) {
            setIsSubmitting(false);
            setMessage(response.message);
          } else {
            setIsSubmitting(false);
            setSuccess(response.message);
          }
        } else {
          setIsSubmitting(false);
          router.push(ROUTES.AUTH.LOGIN);
        }
      } catch (err) {
        setIsSubmitting(false);
        console.error(err);
      }
    }
  }

  if (isLoading || isValidating) {
    return (
      <div className="w-full h-screen flex flex-col gap-4 items-center justify-center">
        <LoadingSpinner />
        <p className="text-gray-500">Loading product data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen grid place-items-center">
        A problem occurred when getting product detail.
      </div>
    );
  } else {
    if (product) {
      return (
        <Container className="w-full flex flex-col gap-8">
          {message && <Snackbar variant="ERROR" message={message} />}
          {success && <Snackbar variant="SUCCESS" message={success} />}
          <div className="w-full grid gap-8">
            <div className="flex flex-col lg:flex-row gap-8 border border-gray-300 overflow-hidden rounded-lg px-8 py-8">
              <div className="w-64 h-64 border border-gray-300 rounded-md overflow-hidden relative flex-shrink-0">
                <Image
                  src={product.thumbnail}
                  fill
                  className="object-cover"
                  alt={product.name}
                />
              </div>

              <div className="flex flex-col gap-4 text-neutral-800">
                <p className="text-2xl">{product.name}</p>
                <b className="text-xl text-primary">
                  {rupiahConverter(product.price)}
                </b>
                <div className="w-full">
                  <p className="text-sm">{product.descriptions}</p>
                </div>

                <div className="flex flex-row gap-4 items-center">
                  <div className="w-fit flex flex-row items-center gap-4 border border-gray-300 rounded-lg overflow-hidden">
                    <Button
                      variants="PRIMARY"
                      onClick={() =>
                        setQty((prev) => (prev > 0 ? prev - 1 : 0))
                      }
                    >
                      <MinusIcon className="w-5 h-5" />
                    </Button>
                    <b className="text-lg">{qty}</b>
                    <Button
                      variants="PRIMARY"
                      onClick={() => setQty((prev) => prev + 1)}
                    >
                      <PlusIcon className="w-5 h-5" />
                    </Button>
                  </div>
                  <b className="text-sm">Available stocks: {product.stock}</b>
                </div>

                <div className="flex flex-row gap-4">
                  <Button
                    disabled={isSubmitting}
                    variants="PRIMARY"
                    onClick={() => placeAnOrder()}
                  >
                    Buy now
                  </Button>
                  <Button disabled={isSubmitting} variants="SECONDARY">
                    Add to wishlist
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <ShowFormModal
            onClose={() => setModalShown(null)}
            options={modalShown}
            setMessage={setMessage}
            setSuccess={setSuccess}
          />
        </Container>
      );
    }
  }
}
