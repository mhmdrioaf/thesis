"use client";

import React, { useState } from "react";
import TextField from "../inputs/TextField";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AddProductForm() {
  const [newProduct, setNewProduct] = useState<NewProduct | null>(null);

  const labelStyles = "text-neutral-500";
  const inputStyles = "flex flex-col gap-2";

  const { data: session, status } = useSession();
  const router = useRouter();

  function inputChangeHandler(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const dataName = event.target.name;
    const dataValue = event.target.value;

    return dataName === "price"
      ? setNewProduct((prev) => ({ ...prev!, price: Number(dataValue) }))
      : setNewProduct((prev) => ({ ...prev!, [dataName]: dataValue }));
  }

  async function onProductSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (session) {
      const productToSubmit = {
        ...newProduct,
        seller: session?.user.id,
      };

      try {
        const productResponse = await fetch(
          "http://localhost:3000/api/create-product",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productToSubmit),
          }
        );

        if (!productResponse.ok) {
          console.error(
            "A problem occurred during uploading the product: ",
            productResponse.status
          );
        }

        router.push('/marketplace?status="Successfully added new product!"');
      } catch (error) {
        console.error("Unable to create the product: ", error);
      }
    }
  }

  if (status === "loading") {
    return (
      <div className="w-full h-full flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={onProductSubmit}>
      <div className={inputStyles}>
        <label htmlFor="name" className={labelStyles}>
          Product name
        </label>
        <TextField
          type="text"
          name="name"
          id="name"
          onChange={inputChangeHandler}
          placeholder="Your product name..."
          required
        />
      </div>

      <div className={inputStyles}>
        <label htmlFor="price" className={labelStyles}>
          Product price
        </label>
        <TextField
          type="number"
          name="price"
          id="price"
          onChange={inputChangeHandler}
          placeholder="45000"
          required
        />
      </div>

      <div className={inputStyles}>
        <label htmlFor="description" className={labelStyles}>
          Product descriptions
        </label>
        <textarea
          className="w-full outline-none border border-gray-300 px-2 py-2 rounded-md"
          name="description"
          id="description"
          onChange={inputChangeHandler}
          placeholder="This product is..."
          required
        />
      </div>

      <button
        type="submit"
        className="w-full px-4 py-4 border-none outline-none rounded-md bg-primary bg-opacity-85 text-white hover:bg-opacity-100"
      >
        Add product
      </button>
    </form>
  );
}
