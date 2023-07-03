export async function getProducts() {
  const fetchProducts = await fetch(
    process.env.NEXT_PUBLIC_API_PRODUCT_LIST_PRODUCTS!,
    {
      next: {
        tags: ["products"],
      },
    }
  );

  const response = await fetchProducts.json();

  if (!response.ok) {
    return null;
  } else {
    return JSON.parse(response.products);
  }
}
