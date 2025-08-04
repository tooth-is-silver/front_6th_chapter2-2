import { Product, ProductWithUI } from "../../types";

export const formatPrice = (
  products: Array<ProductWithUI>,
  isAdmin: boolean,
  price: number,
  getRemainingStock: (product: Product) => number,
  productId?: string
): string => {
  if (productId) {
    const product = products.find((p) => p.id === productId);
    if (product && getRemainingStock(product) <= 0) {
      return "SOLD OUT";
    }
  }

  return toLocaleStringKrPrice(price, isAdmin);
};

export const toLocaleStringKrPrice = (price: number, isAdmin: boolean) => {
  if (isAdmin) {
    return `${price.toLocaleString()}원`;
  }

  return `₩${price.toLocaleString()}`;
};
