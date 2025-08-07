import { SetStateAction, useCallback } from "react";
import { Coupon } from "../../../types";
import { NOTIFICATION_MESSAGE } from "../../constants";

export const useApplyCoupon = (
  calculateCartTotal: () => {
    totalBeforeDiscount: number;
    totalAfterDiscount: number;
  },
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void,
  setSelectedCoupon: (value: SetStateAction<Coupon | null>) => void
) => {
  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      const currentTotal = calculateCartTotal().totalAfterDiscount;

      if (currentTotal < 10000 && coupon.discountType === "percentage") {
        addNotification(NOTIFICATION_MESSAGE.ERROR.MIN_COUPON, "error");
        return;
      }

      setSelectedCoupon(coupon);
      addNotification(NOTIFICATION_MESSAGE.COUPON.APPLIED, "success");
    },
    [addNotification, calculateCartTotal]
  );

  return { applyCoupon };
};
