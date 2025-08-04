import { Dispatch, SetStateAction, useCallback } from "react";
import { CartItem, Product, ProductWithUI } from "../../../types";

export const useUpdateQuantity = (
  removeFromCart: (productId: string) => void,
  products: Array<ProductWithUI>,
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void,
  setCart: Dispatch<SetStateAction<Array<CartItem>>>,
  getRemainingStock: (product: Product) => number
) => {
  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
      }

      const product = products.find((p) => p.id === productId);
      if (!product) return;

      const maxStock = product.stock;
      if (newQuantity > maxStock) {
        addNotification(`재고는 ${maxStock}개까지만 있습니다.`, "error");
        return;
      }

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    },
    [products, removeFromCart, addNotification, getRemainingStock]
  );
  return { updateQuantity };
};
