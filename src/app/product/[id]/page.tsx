import Container from "@/components/container/Container";
import Image from "next/image";

async function getProduct(id: string) {
  const fetchProduct = await fetch(
    process.env.NEXT_PUBLIC_API_PRODUCT_GET_BY_ID! + `/${id}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  const response = await fetchProduct.json();

  if (!response.ok) {
    return null;
  } else {
    return JSON.parse(response.product);
  }
}

export default async function Product({ params }: { params: { id: string } }) {
  const product: Product = await getProduct(params.id);

  if (product) {
    return (
      <Container className="w-full flex flex-col gap-8">
        <div className="w-full grid gap-8">
          <div className="flex flex-col gap-8 border border-gray-300 overflow-hidden rounded-lg">
            <div className="w-24 h-24 border border-gray-300 rounded-md overflow-hidden relative">
              <Image
                src={product.thumbnail}
                fill
                className="object-cover"
                alt={product.name}
              />
            </div>
          </div>
        </div>
      </Container>
    );
  }
}
