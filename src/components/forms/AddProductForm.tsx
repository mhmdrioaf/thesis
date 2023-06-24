"use client";

import { API_PRODUCTS, ROUTES } from "@/lib/constants";
import supabase from "@/lib/supabase";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import LoadingSpinner from "../indicators/LoadingSpinner";
import TextField from "../inputs/TextField";

export default function AddProductForm() {
  const [newProduct, setNewProduct] = useState<NewProduct | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const labelStyles = "text-neutral-500";
  const inputStyles = "flex flex-col gap-2";
  const thumbnailCardStyles = (disabled: boolean): string => {
    return disabled
      ? "w-32 h-32 rounded-lg border border-gray-300 overflow-hidden grid place-items-center relative bg-gray-300"
      : "w-32 h-32 rounded-lg border border-gray-300 overflow-hidden grid place-items-center relative cursor-pointer";
  };

  const { data: session, status } = useSession();
  const router = useRouter();
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  function inputChangeHandler(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const dataName = event.target.name;
    const dataValue = event.target.value;

    return dataName === "price"
      ? setNewProduct((prev) => ({ ...prev!, price: Number(dataValue) }))
      : setNewProduct((prev) => ({ ...prev!, [dataName]: dataValue }));
  }

  function onThumbnailInputClicked() {
    if (thumbnailInputRef) {
      return thumbnailInputRef.current?.click();
    }
  }

  function onThumbnailInputChanged(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files;

    if (!file) return;
    setThumbnail(file[0]);
  }

  function getPublicImageURL(imagePath: string) {
    return supabase.storage.from("products").getPublicUrl(imagePath).data
      .publicUrl;
  }

  async function onProductSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    if (session) {
      const productWithoutThumbnail = {
        ...newProduct,
        seller: session.user.id,
      };

      try {
        if (thumbnail) {
          const fileName = `${session.user.id}/${newProduct?.name}/${newProduct?.name}_${session.user.id}_thumbnail`;
          const { data, error } = await supabase.storage
            .from("products")
            .upload(fileName, thumbnail, {
              upsert: true,
            });

          if (error) {
            console.error(
              "An error occurred while uploading the thumbnail: ",
              error.cause
            );
            setIsLoading(false);
          }

          if (data) {
            const thumbnailURL = getPublicImageURL(data.path);
            const productToSubmit = {
              ...productWithoutThumbnail,
              thumbnail: thumbnailURL,
            };

            const productResponse = await fetch(API_PRODUCTS.CREATE, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(productToSubmit),
            });

            if (!productResponse.ok) {
              setIsLoading(false);
              console.error(
                "A problem occurred during uploading the product: ",
                productResponse.status
              );
            } else {
              setIsLoading(false);
              router.push(ROUTES.MARKETPLACE + "?status=Added new product!");
            }
          }
        }
      } catch (error) {
        setIsLoading(false);
        console.error("Unable to create the product: ", error);
      }
    }
  }

  useEffect(() => {
    if (thumbnail) {
      const thumbnailPreviewURL = URL.createObjectURL(thumbnail);
      setThumbnailPreview(thumbnailPreviewURL);
    }
  }, [thumbnail]);

  if (status === "loading") {
    return (
      <div className="w-full min-h-screen grid place-items-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={onProductSubmit}>
      <div className={inputStyles}>
        <p className={labelStyles}>Product thumbnail</p>
        <div
          className={thumbnailCardStyles(
            isLoading || thumbnailPreview !== null
          )}
          onClick={
            isLoading || thumbnailPreview ? () => {} : onThumbnailInputClicked
          }
        >
          {!thumbnailPreview && (
            <>
              <PlusIcon className="w-8 h-8 text-gray-300" />
              <input
                ref={thumbnailInputRef}
                type="file"
                required
                hidden
                accept="image/*"
                multiple={false}
                onChange={onThumbnailInputChanged}
              />
            </>
          )}
          {thumbnailPreview && (
            <Image
              src={thumbnailPreview}
              fill
              alt="Product thumbnail"
              className="object-cover"
            />
          )}
        </div>
      </div>

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
          disabled={isLoading}
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
          disabled={isLoading}
        />
      </div>

      <div className={inputStyles}>
        <label htmlFor="description" className={labelStyles}>
          Product descriptions
        </label>
        <textarea
          className="w-full outline-none border border-gray-300 px-2 py-2 rounded-md disabled:bg-gray-300 disabled:text-gray-500"
          name="description"
          id="description"
          onChange={inputChangeHandler}
          placeholder="This product is..."
          required
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        className="w-full px-4 py-4 border-none outline-none rounded-md bg-primary bg-opacity-85 text-white hover:bg-opacity-100 disabled:bg-gray-400 disabled:text-gray-500"
        disabled={isLoading}
      >
        {isLoading && (
          <div className="w-full flex gap-4 items-center justify-center">
            Uploading product...
          </div>
        )}
        {!isLoading && "Add product"}
      </button>
    </form>
  );
}
