import { Dispatch, SetStateAction, useCallback } from "react";
import { Coupon } from "../../../types";
import { NOTIFICATION_MESSAGE } from "../../constants";

export const useAddCoupon = (
  coupons: Array<Coupon>,
  setCoupons: Dispatch<SetStateAction<Array<Coupon>>>,
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void
) => {
  const addCoupon = useCallback(
    (newCoupon: Coupon) => {
      const existingCoupon = coupons.find((c) => c.code === newCoupon.code);
      if (existingCoupon) {
        addNotification(NOTIFICATION_MESSAGE.ERROR.EXISTED_COUPON, "error");
        return;
      }
      setCoupons((prev) => [...prev, newCoupon]);
      addNotification(NOTIFICATION_MESSAGE.COUPON.ADD, "success");
    },
    [coupons, addNotification]
  );
  return { addCoupon };
};
