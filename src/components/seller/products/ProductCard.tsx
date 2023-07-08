import Button from "@/components/buttons/Button";
import { rupiahConverter } from "@/lib/helper";
import Image from "next/image";

interface Props {
  product: Product;
  editProduct: (product: Product) => void;
  deleteProduct: (product: Product) => void;
  styles?: {
    stockStyle: {
      small: string;
      safe: string;
    };
  };
}

export default function ProductCard({
  product,
  editProduct,
  deleteProduct,
  styles,
}: Props) {
  const statusStyle = {
    APPROVED: "text-green-800",
    SUBMITTED: "text-yellow-800",
    REJECTED: "text-yellow-800",
  };

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
    <div className="w-full px-8 py-8 lg:px-4 lg:py-4 flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-start lg:justify-between border border-gray-300 rounded-lg">
      <div className="w-full lg:w-fit flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        <div className="w-full lg:w-32 h-64 lg:h-32 rounded-md overflow-hidden relative">
          {product.thumbnail && (
            <Image
              src={product.thumbnail}
              fill
              alt="product"
              className="object-cover"
            />
          )}
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-lg">{product.name}</p>
          <p className="font-bold text-xl">{rupiahConverter(product.price)}</p>
          <p className="w-96 truncate text-base" title={product.descriptions}>
            {product.descriptions}
          </p>
        </div>
      </div>

      <div className="w-full lg:w-fit flex flex-col gap-4">
        <Button
          variants="PRIMARY"
          fullWidth
          onClick={() => editProduct(product)}
        >
          Edit product
        </Button>
        <Button
          variants="ERROR"
          fullWidth
          onClick={() => deleteProduct(product)}
        >
          Delete product
        </Button>
        <p
          className={
            product.stock <= 10
              ? styles?.stockStyle.small
              : styles?.stockStyle.safe
          }
        >
          {product.stock} Stocks Available
        </p>
        {statusChecker(product.status)}
      </div>
    </div>
  );
}
