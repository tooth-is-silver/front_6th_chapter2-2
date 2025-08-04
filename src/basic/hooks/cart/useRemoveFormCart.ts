import { Dispatch, SetStateAction, useCallback } from "react";
import { CartItem } from "../../../types";

export const useRemoveFromCart = (
  setCart: Dispatch<SetStateAction<Array<CartItem>>>
) => {
  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productId)
    );
  }, []);

  return { removeFromCart };
};
