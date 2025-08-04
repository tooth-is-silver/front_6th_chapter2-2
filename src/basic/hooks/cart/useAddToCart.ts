import { Dispatch, SetStateAction, useCallback } from "react";
import { CartItem, Product, ProductWithUI } from "../../../types";

export const useAddToCart = (
  getRemainingStock: (product: Product) => number,
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void,
  cart: Array<CartItem>,
  setCart: Dispatch<SetStateAction<Array<CartItem>>>
) => {
  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const remainingStock = getRemainingStock(product);
      if (remainingStock <= 0) {
        addNotification("재고가 부족합니다!", "error");
        return;
      }

      setCart((prevCart) => {
        const existingItem = prevCart.find(
          (item) => item.product.id === product.id
        );

        if (existingItem) {
          const newQuantity = existingItem.quantity + 1;

          if (newQuantity > product.stock) {
            addNotification(
              `재고는 ${product.stock}개까지만 있습니다.`,
              "error"
            );
            return prevCart;
          }

          return prevCart.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: newQuantity }
              : item
          );
        }

        return [...prevCart, { product, quantity: 1 }];
      });

      addNotification("장바구니에 담았습니다", "success");
    },
    [cart, setCart, getRemainingStock, addNotification]
  );

  return { addToCart };
};
