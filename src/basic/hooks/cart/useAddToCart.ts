import { Dispatch, SetStateAction, useCallback } from "react";
import { CartItem, Product, ProductWithUI } from "../../../types";
import { NOTIFICATION_MESSAGE } from "../../constants";

export const useAddToCart = (
  getRemainingStock: (cart: Array<CartItem>, product: Product) => number,
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void,
  cart: Array<CartItem>,
  setCart: Dispatch<SetStateAction<Array<CartItem>>>
) => {
  const addToCart = useCallback(
    (product: ProductWithUI) => {
      const remainingStock = getRemainingStock(cart, product);
      if (remainingStock <= 0) {
        addNotification(NOTIFICATION_MESSAGE.ERROR.NONE_STOCK, "error");
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
              NOTIFICATION_MESSAGE.ERROR.INSUFFICIENT_STOCK(product.stock),
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

      addNotification(NOTIFICATION_MESSAGE.CART.ADD, "success");
    },
    [cart, setCart, getRemainingStock, addNotification]
  );

  return { addToCart };
};
