export function phoneNumberConverter(value: string | number | undefined) {
  if (typeof value === "string") {
    const phoneNumber =
      value.charAt(0) === "0"
        ? `62${value.slice(1)}`
        : value.charAt(0) === "6"
        ? value
        : `62${value}`;

    return parseInt(phoneNumber);
  } else if (typeof value === "number") {
    const phoneNumber = `62${value}`;

    return parseInt(phoneNumber);
  } else {
    return null;
  }
}

export function rupiahConverter(value: number) {
  return Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(value);
}

export function capitalizeFirstWord(words: string) {
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function sortAddress(address: Address) {
  if (address.primaryAddressFor !== null) {
    return -1;
  } else {
    return 0;
  }
}

export function sortProducts(product: Product) {
  if (product.status === "REJECTED" || product.status === "SUBMITTED") {
    return -1;
  } else {
    return 0;
  }
}

export function getFilenameFromURL(url: string) {
  const splittedURL = url.split("/");
  const userId = splittedURL[splittedURL.length - 3];
  const productName = splittedURL[splittedURL.length - 2];
  const fileName = userId + "/" + productName;

  return fileName;
}

export function getFeaturedProducts(products: Product[]) {
  const featuredProducts = products.filter(
    (product: Product) => product.isFeatured === true
  );

  return featuredProducts;
}

export function getApprovedProducts(products: Product[]) {
  const approvedProducts = products.filter(
    (product: Product) => product.status === "APPROVED"
  );

  return approvedProducts;
}

export function getNewestProducts(products: Product[]) {
  const currentDate = new Date();
  const newestProducts = products.map((product: Product) => {
    const productCreatedDate = new Date(product.createdAt);
    const diffInTime = currentDate.getTime() - productCreatedDate.getTime();
    const diffInDays = diffInTime / (1000 * 3600 * 24);

    if (diffInDays < 7) {
      return product;
    } else {
      return null as unknown as Product;
    }
  });

  return newestProducts;
}

export async function makeAnOrder(
  customerId: string,
  product: Product | null,
  quantity: number,
  shippingAddress: string
) {
  const itemToSubmit = {
    id: product?.id,
    quantity: quantity,
    price: product?.price,
    sellerId: product?.sellerId,
  };
  const res = await fetch(process.env.NEXT_PUBLIC_API_USER_PLACE_ORDER!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      customer: {
        customerId: customerId,
        shippingAddress: shippingAddress,
      },
      product: {
        ...itemToSubmit,
      },
    }),
  });

  const response = await res.json();

  return response;
}

export function decimalNumber(num: number) {
  const formattedNumber = num < 10 ? `0${num}` : num;

  return formattedNumber;
}

export const fetcher = (url: string) =>
  fetch(url).then((response) => response.json());

export async function getUserOrders(customerId: string) {
  const response = await fetch(process.env.NEXT_PUBLIC_API_USER_GET_ORDERS!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ customerId: customerId }),
  });

  const ordersResponse = await response.json();

  if (!ordersResponse.ok) {
    return null;
  } else {
    return ordersResponse.orders;
  }
}

export async function makePayment(totalAmount: number, orderID: string) {
  const res = await fetch(process.env.NEXT_PUBLIC_API_PAYMENT_GATEWAY!, {
    method: "POST",
    body: JSON.stringify({ totalAmount: totalAmount, orderId: orderID }),
  });

  const paymentResponse = await res.json();

  return paymentResponse.response;
}
