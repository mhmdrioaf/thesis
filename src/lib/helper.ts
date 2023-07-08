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

export const fetcher = (url: string) =>
  fetch(url).then((response) => response.json());
