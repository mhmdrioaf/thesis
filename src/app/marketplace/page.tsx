import Card from "@/components/card/Card";
import Carousel from "@/components/carousel/Carousel";
import Container from "@/components/container/Container";
import SectionTitle from "@/components/section-title/SectionTitle";
import {
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
      <div className="grid grid-cols-2 lg:grid-cols-4 w-full items-center gap-8">
        {dummyProducts.map((product: Product) => (
          <Link key={product.id} href={`/marketplace/product/${product.id}`}>
            <Card>
              <div className="w-full h-64 relative">
                <Image
                  src={product.imgURL}
                  fill
                  className="object-cover"
                  alt="Product"
                />
              </div>
              <div className="w-full px-4 py-4 flex flex-col gap-2">
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
