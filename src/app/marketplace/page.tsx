import Card from "@/components/card/Card";
import Carousel from "@/components/carousel/Carousel";
import Container from "@/components/container/Container";
import SectionTitle from "@/components/section-title/SectionTitle";
import {
  ROUTES,
  DUMMY_MARKETPLACE_CAROUSEL_ASSETS as dummyAssets,
  DUMMY_MARKETPLACE_PRODUCTS as dummyProducts,
} from "@/lib/constants";
import RupiahConverter from "@/lib/rupiahConverter";
import Image from "next/image";
import Link from "next/link";

export default function Marketplace() {
  return (
    <Container className="w-full min-h-screen flex flex-col gap-8">
      <Carousel
        className="w-full h-64 rounded-2xl overflow-hidden"
        assets={dummyAssets}
        autoplay={false}
      />
      <SectionTitle title="Featured Products" />
      <div className="grid grid-cols-2 lg:grid-cols-4 w-full items-center gap-2 lg:gap-8">
        {dummyProducts.map((product: Product) => (
          <Link key={product.id} href={ROUTES.PRODUCT_DETAIL(product.id)}>
            <Card>
              <div className="w-full h-32 lg:h-64 relative rounded-b-lg overflow-hidden">
                <Image
                  src={product.imgURL}
                  fill
                  className="object-cover"
                  alt="Product"
                />
              </div>
              <div className="w-full px-2 py-2 lg:px-4 lg:py-4 flex flex-col lg:gap-2">
                <p className="text-xl">{product.name}</p>
                <p className="truncate" title={product?.desc}>
                  {product?.desc}
                </p>
                <b>{RupiahConverter(product.price)}</b>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </Container>
  );
}
