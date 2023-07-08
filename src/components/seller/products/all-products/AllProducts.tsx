"use client";

import { sortProducts } from "@/lib/helper";
import ProductCard from "../ProductCard";

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
    const sortedProducts = products.sort((product: Product) =>
      sortProducts(product)
    );
    return (
      <>
        {sortedProducts.map((product: Product) => (
          <ProductCard
            product={product}
            editProduct={editProduct}
            deleteProduct={deleteProduct}
            styles={styles}
            key={product.id}
          />
        ))}
      </>
    );
  }
}
