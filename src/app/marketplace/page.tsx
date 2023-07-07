import Card from "@/components/card/Card";
import Carousel from "@/components/carousel/Carousel";
import Container from "@/components/container/Container";
import SectionTitle from "@/components/section-title/SectionTitle";
import ShowMessage from "@/components/utils/ShowMessage";
import {
  ROUTES,
  DUMMY_MARKETPLACE_CAROUSEL_ASSETS as dummyAssets,
} from "@/lib/constants";
import { rupiahConverter } from "@/lib/helper";
import Image from "next/image";
import Link from "next/link";

export default async function Marketplace() {
  const products: Product[] = [];

  return (
    <Container className="w-full min-h-screen flex flex-col gap-8">
      <ShowMessage />
      <Carousel
        className="w-full h-64 rounded-2xl overflow-hidden"
        assets={dummyAssets}
        autoplay={false}
      />
      <SectionTitle title="Featured Products" />
      <div className="grid grid-cols-2 lg:grid-cols-4 w-full items-center gap-2 lg:gap-8">
        {products &&
          products.map((product: Product) => (
            <Link key={product.id} href={ROUTES.PRODUCT_DETAIL(product.id)}>
              <Card>
                <div className="w-full h-32 lg:h-64 relative rounded-b-lg overflow-hidden">
                  <Image
                    src={product.thumbnail}
                    fill
                    className="object-cover"
                    alt="Product"
                  />
                </div>
                <div className="w-full px-2 py-2 lg:px-4 lg:py-4 flex flex-col lg:gap-2">
                  <p className="text-xl">{product.name}</p>
                  <p className="truncate" title={product?.descriptions}>
                    {product?.descriptions}
                  </p>
                  <b>{rupiahConverter(product.price)}</b>
                </div>
              </Card>
            </Link>
          ))}

        {!products ||
          (products.length <= 0 && (
            <div className="w-full only:grid place-items-center text-gray-300">
              <p>No products listed yet...</p>
            </div>
          ))}
      </div>
    </Container>
  );
}
