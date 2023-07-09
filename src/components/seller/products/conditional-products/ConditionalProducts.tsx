"use client";

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
  status: string;
}

export default function ConditionalProducts({
  products,
  editProduct,
  deleteProduct,
  styles,
  status,
}: Props) {
  {
    const conditionalProducts = products.filter(
      (product: Product) => product.status === status
    );

    if (conditionalProducts.length <= 0) {
      return <p>There is no product in the current status.</p>;
    } else {
      return (
        <>
          {conditionalProducts.map((product: Product) => (
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
}
