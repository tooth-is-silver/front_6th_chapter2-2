import { Dispatch, SetStateAction, useCallback } from "react";
import { Coupon } from "../../../types";
import { NOTIFICATION_MESSAGE } from "../../constants";

export const useDeleteCoupon = (
  selectedCoupon: Coupon | null,
  setSelectedCoupon: Dispatch<SetStateAction<Coupon | null>>,
  setCoupons: Dispatch<SetStateAction<Array<Coupon>>>,
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void
) => {
  const deleteCoupon = useCallback(
    (couponCode: string) => {
      setCoupons((prev) => prev.filter((c) => c.code !== couponCode));
      if (selectedCoupon?.code === couponCode) {
        setSelectedCoupon(null);
      }
      addNotification(NOTIFICATION_MESSAGE.COUPON.DELETE, "success");
    },
    [selectedCoupon, addNotification]
  );
  return {
    deleteCoupon,
  };
};
