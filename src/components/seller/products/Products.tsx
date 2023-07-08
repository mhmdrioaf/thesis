"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { fetcher } from "@/lib/helper";
import ShowFormModal from "@/components/utils/ShowFormModal";
import useSWR from "swr";
import LoadingSpinner from "@/components/indicators/LoadingSpinner";
import Snackbar from "@/components/snackbars/Snackbar";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import AllProducts from "./all-products/AllProducts";
import { SELLER_PRODUCT_TAB as tabs } from "@/lib/constants";
import Button from "@/components/buttons/Button";
import { PlusIcon } from "@heroicons/react/24/solid";

export default function ProductsList() {
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [modalShown, setModalShown] = useState<string | null>(null);
  const [productsShown, setProductsShown] = useState<string | null>(
    "all-products"
  );

  const { data: session } = useSession();
  const { data, error, isLoading, isValidating } = useSWR(
    process.env.NEXT_PUBLIC_API_PRODUCT_LIST_SELLER_PRODUCTS! +
      session?.user.id,
    fetcher
  );

  const smallStockStyle = "font-bold text-red-950";
  const safeStockStyle = "font-bold text-primary";
  const tabStyles =
    "w-full rounded-md px-2 py-2 grid place-items-center cursor-pointer hover:bg-primary hover:text-white";
  const activeTab = tabStyles + " bg-primary text-white";

  function editProduct(product: Product) {
    setProductToEdit(product);
    setModalShown("product-edit");
  }
  function deleteProduct(product: Product) {
    setProductToEdit(product);
    setModalShown("product-delete");
  }
  function onModalCloses() {
    setModalShown(null);
  }

  function showProducts(options: string | null, products: Product[]) {
    switch (options) {
      case "all-products":
        return (
          <AllProducts
            deleteProduct={deleteProduct}
            editProduct={editProduct}
            products={products}
            styles={{
              stockStyle: { safe: safeStockStyle, small: smallStockStyle },
            }}
          />
        );
      case "submitted-products":
        return "Submitted";
      case "approved-products":
        return "Approved";
      case "rejected-products":
        return "rejected";
      default:
        return (
          <AllProducts
            deleteProduct={deleteProduct}
            editProduct={editProduct}
            products={products}
            styles={{
              stockStyle: { safe: safeStockStyle, small: smallStockStyle },
            }}
          />
        );
    }
  }

  if (error) return <p>There was an error while fetching the products.</p>;
  if (isLoading || isValidating) {
    return (
      <div className="w-full h-full grid place-items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (data) {
    const products = JSON.parse(data.products);

    if (products.length < 1) {
      return (
        <div className="w-full h-full grid place-items-center">
          <p className="text-gray-500">
            {"You doesn't have any products yet. "}
            <Link
              href={ROUTES.PRODUCTS.CREATE}
              className="text-primary font-bold"
            >
              Click here to add one.
            </Link>
          </p>
        </div>
      );
    }

    return (
      <div className="w-full flex flex-col gap-8">
        {message && <Snackbar variant="ERROR" message={message} />}
        {success && <Snackbar variant="SUCCESS" message={success} />}

        <div className="w-full flex flex-row gap-4 justify-between border-b border-b-gray-300 py-2">
          {tabs.map((tab: Tab) => (
            <div
              key={tab.id}
              className={productsShown === tab.id ? activeTab : tabStyles}
              onClick={() => setProductsShown(tab.id!)}
            >
              <p>{tab.name}</p>
            </div>
          ))}
        </div>

        <div className="w-full grid place-content-end">
          <Link href={ROUTES.PRODUCTS.CREATE}>
            <Button>
              <PlusIcon className="w-4 h-4 text-white" />
              <p>Create New Product</p>
            </Button>
          </Link>
        </div>

        <div className="w-full flex flex-col lg:flex-row gap-8 lg:gap-4">
          {showProducts(productsShown, products)}
        </div>

        <ShowFormModal
          onClose={onModalCloses}
          options={modalShown}
          setMessage={setMessage}
          product={productToEdit}
          setSuccess={setSuccess}
        />
      </div>
    );
  }
}
