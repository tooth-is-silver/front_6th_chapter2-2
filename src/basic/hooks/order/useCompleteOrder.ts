import { Dispatch, SetStateAction, useCallback } from "react";
import { CartItem, Coupon } from "../../../types";

export const useCompleteOrder = (
  setCart: Dispatch<SetStateAction<Array<CartItem>>>,
  setSelectedCoupon: (value: SetStateAction<Coupon | null>) => void,
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void
) => {
  const completeOrder = useCallback(() => {
    const orderNumber = `ORD-${Date.now()}`;
    addNotification(
      `주문이 완료되었습니다. 주문번호: ${orderNumber}`,
      "success"
    );
    setCart([]);
    setSelectedCoupon(null);
  }, [addNotification]);

  return { completeOrder };
};
