"use client";

import Button from "@/components/buttons/Button";
import LoadingSpinner from "@/components/indicators/LoadingSpinner";
import Snackbar from "@/components/snackbars/Snackbar";
import ShowFormModal from "@/components/utils/ShowFormModal";
import { SELLER_PRODUCT_TAB as tabs } from "@/lib/constants";
import { fetcher, rupiahConverter, sortProducts } from "@/lib/helper";
import Image from "next/image";
import { useState } from "react";
import useSWR from "swr";

export default function AdminProducts() {
  const [productsShown, setProductsShown] = useState("all-products");

  const { data, isLoading, isValidating, error } = useSWR(
    "/api/list-products",
    fetcher
  );

  const tabStyles =
    "w-full rounded-md px-2 py-2 grid place-items-center cursor-pointer hover:bg-primary hover:text-white";
  const activeTab = tabStyles + " bg-primary text-white";
  const products: Product[] = data ? JSON.parse(data.products) : [];

  function showProducts(options: string | null) {
    const allProducts = products.sort((product: Product) =>
      sortProducts(product)
    );
    const submittedProducts = products.filter(
      (product: Product) => product.status === "SUBMITTED"
    );
    const approvedProducts = products.filter(
      (product: Product) => product.status === "APPROVED"
    );
    const rejectedProducts = products.filter(
      (product: Product) => product.status === "REJECTED"
    );
    switch (options) {
      case "all-products":
        return <AdminProductsList products={allProducts} />;

      case "submitted-products":
        return <AdminProductsList products={submittedProducts} />;

      case "approved-products":
        return <AdminProductsList products={approvedProducts} />;

      case "rejected-products":
        return <AdminProductsList products={rejectedProducts} />;

      default:
        return <AdminProductsList products={allProducts} />;
    }
  }

  return (
    <div className="w-full flex flex-col gap-8 overflow-hidden">
      <div className="flex flex-row justify-between gap-4 overflow-x-auto">
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
      {error && <p>An error occurred when fetching products</p>}
      {isLoading ||
        (isValidating && (
          <div className="w-full grid place-items-center">
            <LoadingSpinner />
          </div>
        ))}
      {data && showProducts(productsShown)}
    </div>
  );
}

export function AdminProductsList({ products }: { products: Product[] }) {
  const [modalShown, setModalShown] = useState<string | null>(null);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const statusStyle = {
    APPROVED: "text-green-800",
    SUBMITTED: "text-yellow-800",
    REJECTED: "text-red-800",
  };

  function productActions(option: string, product: Product) {
    setModalShown(option);
    setProductToEdit(product);
  }

  function onModalCloses() {
    setModalShown(null);
    setProductToEdit(null);
  }

  function statusChecker(status: ProductStatus | undefined) {
    switch (status) {
      case "APPROVED":
        return <p className={statusStyle.APPROVED}>Status: Approved</p>;
      case "SUBMITTED":
        return <p className={statusStyle.SUBMITTED}>Status: Submitted</p>;
      case "REJECTED":
        return <p className={statusStyle.REJECTED}>Status: Rejected</p>;

      default:
        return <p>Status: Unknown</p>;
    }
  }

  return (
    <div className="w-full flex flex-col gap-8">
      {message && <Snackbar variant="ERROR" message={message} />}
      {success && <Snackbar variant="SUCCESS" message={success} />}
      {products.map((product: Product) => (
        <div
          key={product.id}
          className="w-full px-2 py-2 flex flex-col gap-2 lg:gap-4 lg:flex-row lg:justify-between lg:items-center border border-gray-300 overflow-hidden rounded-md"
        >
          <div className="flex flex-col lg:flex-row gap-2">
            <div className="w-64 h-64 lg:w-32 lg:h-auto rounded-sm overflow-hidden relative">
              <Image
                src={product.thumbnail}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-2">
              <p>{product.name}</p>
              <p>{rupiahConverter(product.price)}</p>
              <p>Proposed by: {product.sellerId}</p>
              {statusChecker(product.status)}
            </div>
          </div>

          <div className="flex flex-col gap-4 w-24">
            {product.status === "SUBMITTED" ? (
              <>
                <Button
                  fullWidth
                  variants="PRIMARY"
                  onClick={() => productActions("product-approve", product)}
                >
                  Apprrove
                </Button>
                <Button
                  fullWidth
                  variants="ERROR"
                  onClick={() => productActions("product-reject", product)}
                >
                  Reject
                </Button>
              </>
            ) : (
              <Button
                fullWidth
                variants="ERROR"
                onClick={() => productActions("product-delete", product)}
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      ))}
      <ShowFormModal
        onClose={onModalCloses}
        options={modalShown}
        setMessage={setMessage}
        setSuccess={setSuccess}
        product={productToEdit}
      />
    </div>
  );
}
