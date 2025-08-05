import { CartItem, Product } from "../../types";

export const getRemainingStock = (
  cart: Array<CartItem>,
  product: Product
): number => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  const remaining = product.stock - (cartItem?.quantity || 0);

  return remaining;
};
