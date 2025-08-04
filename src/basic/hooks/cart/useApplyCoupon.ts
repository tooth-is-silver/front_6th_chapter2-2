import { SetStateAction, useCallback } from "react";
import { Coupon } from "../../../types";

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
        addNotification(
          "percentage 쿠폰은 10,000원 이상 구매 시 사용 가능합니다.",
          "error"
        );
        return;
      }

      setSelectedCoupon(coupon);
      addNotification("쿠폰이 적용되었습니다.", "success");
    },
    [addNotification, calculateCartTotal]
  );

  return { applyCoupon };
};
