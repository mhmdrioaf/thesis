"use client";

import Button from "@/components/buttons/Button";
import { rupiahConverter } from "@/lib/helper";
import Image from "next/image";

interface Props {
  products: Product[];
  editProduct: (product: Product) => void;
  deleteProduct: (product: Product) => void;
  styles?: {
    stockStyle: {
      small: string;
      safe: string;
    };
  };
}

export default function AllProducts({
  products,
  editProduct,
  deleteProduct,
  styles,
}: Props) {
  {
    return (
      <>
        {products.map((product: Product) => (
          <div
            key={product.id}
            className="w-full px-4 py-4 border border-gray-300 rounded-md overflow-hidden flex justify-between items-center"
          >
            <div className="flex flex-row gap-4 overflow-hidden">
              {product.thumbnail && (
                <div className="w-32 h-auto rounded-md overflow-hidden relative shrink-0">
                  <Image
                    src={product.thumbnail}
                    alt="product-thumbnail"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex flex-col gap-2">
                <p className="text-xl">{product.name}</p>
                <p className="text-2xl font-bold">
                  {rupiahConverter(product.price)}
                </p>
                <p className="w-80 truncate" title={product.descriptions}>
                  {product.descriptions}
                </p>

                <div className="flex flex-row gap-4 items-center">
                  <Button onClick={() => editProduct(product)}>
                    Edit product
                  </Button>
                  <Button
                    variants="ERROR"
                    onClick={() => deleteProduct(product)}
                  >
                    Delete product
                  </Button>
                </div>
              </div>
            </div>

            <div className="w-fit grid place-content-end">
              <p
                className={
                  product.stock <= 10
                    ? styles?.stockStyle.small
                    : styles?.stockStyle.safe
                }
              >
                {product.stock} stock availables
              </p>
            </div>
          </div>
        ))}
      </>
    );
  }
}
