"use client";

import Card from "@/components/card/Card";
import Carousel from "@/components/carousel/Carousel";
import Container from "@/components/container/Container";
import TextDivider from "@/components/dividers/TextDivider";
import LoadingSpinner from "@/components/indicators/LoadingSpinner";
import SectionTitle from "@/components/section-title/SectionTitle";
import ShowMessage from "@/components/utils/ShowMessage";
import {
  ROUTES,
  DUMMY_MARKETPLACE_CAROUSEL_ASSETS as dummyAssets,
} from "@/lib/constants";
import {
  fetcher,
  getApprovedProducts,
  getFeaturedProducts,
  getNewestProducts,
  rupiahConverter,
} from "@/lib/helper";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";

export default function Marketplace() {
  const { data, isLoading, isValidating, error } = useSWR(
    "/api/list-products",
    fetcher
  );

  function getProducts(type: string) {
    if (isLoading || isValidating) {
      return (
        <div className="w-full flex flex-col gap-4 justify-center items-center">
          <LoadingSpinner />
          <p className="text-gray-500">Loading products...</p>
        </div>
      );
    } else if (data) {
      const productsData = JSON.parse(data.products);
      const products = getApprovedProducts(productsData);
      switch (type) {
        case "all-products":
        case "all":
          return showProductsElements(products);
        case "featured-products":
        case "featured":
          return showProductsElements(getFeaturedProducts(products));
        case "newest-products":
        case "newest":
        case "new":
          return showProductsElements(getNewestProducts(products));
        default:
          return showProductsElements(products);
      }
    } else if (error) {
      return (
        <div className="w-full grid place-items-center">
          <p className="text-gray-500">
            A problem occurred while we were getting the products. {":("}
          </p>
        </div>
      );
    } else {
      return (
        <div className="w-full grid place-items-center">
          <p className="text-gray-500">
            A problem occurred while we were getting the products. {":("}
          </p>
        </div>
      );
    }
  }

  function showProductsElements(products: Product[]) {
    if (products && products.length > 0) {
      return (
        <>
          {products.map((product: Product) => (
            <>
              {product !== null && (
                <Link key={product.id} href={ROUTES.PRODUCT_DETAIL(product.id)}>
                  <Card className="w-32 md:w-64 lg:w-full">
                    <div className="w-full h-32 lg:h-64 relative rounded-b-lg overflow-hidden">
                      <Image
                        src={product.thumbnail}
                        fill
                        className="object-cover"
                        alt="Product"
                      />
                    </div>
                    <div className="w-full px-2 py-2 lg:px-4 lg:py-4 flex flex-col">
                      <p className="truncate text-base lg:text-xl">
                        {product.name}
                      </p>
                      <p
                        className="truncate text-xs lg:text-base"
                        title={product?.descriptions}
                      >
                        {product?.descriptions}
                      </p>
                      <b className="text-sm lg:text-base truncate">
                        {rupiahConverter(product.price)}
                      </b>
                    </div>
                  </Card>
                </Link>
              )}
              {product === null && <></>}
            </>
          ))}
        </>
      );
    } else {
      return (
        <p className="text-gray-500">
          Currently, there are no products listed yet.
        </p>
      );
    }
  }

  return (
    <Container className="w-full min-h-screen flex flex-col gap-8">
      <ShowMessage />
      <Carousel
        className="w-full h-64 rounded-2xl overflow-hidden"
        assets={dummyAssets}
        autoplay={false}
      />
      <SectionTitle title="Featured Products" />
      <div className="flex flex-row flex-wrap lg:grid lg:grid-cols-4 w-full items-center gap-2 lg:gap-8">
        {getProducts("featured")}
      </div>

      <TextDivider text="" />

      <SectionTitle title="Explore new Products" />
      <div className="flex flex-row flex-wrap lg:grid lg:grid-cols-4 w-full items-center gap-2 lg:gap-8">
        {getProducts("newest")}
      </div>

      <TextDivider text="" />

      <SectionTitle title="All Products" />
      <div className="flex flex-row flex-wrap lg:grid lg:grid-cols-4 w-full items-center gap-2 lg:gap-8">
        {getProducts("all")}
      </div>
    </Container>
  );
}
