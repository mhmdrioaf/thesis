export async function getProducts() {
  const fetchProducts = await fetch(
    process.env.NEXT_PUBLIC_API_PRODUCT_LIST_PRODUCTS!,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
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

export async function getUserById(id: string) {
  const fetchUser = await fetch(process.env.NEXT_PUBLIC_API_USER_GET! + id, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    next: {
      tags: ["user"],
    },
  });

  const user = await fetchUser.json();

  if (user) {
    return user;
  } else {
    return null;
  }
}
