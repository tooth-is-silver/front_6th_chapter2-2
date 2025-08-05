import { Dispatch, SetStateAction, useCallback } from "react";
import { Coupon } from "../../../types";

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
        addNotification("이미 존재하는 쿠폰 코드입니다.", "error");
        return;
      }
      setCoupons((prev) => [...prev, newCoupon]);
      addNotification("쿠폰이 추가되었습니다.", "success");
    },
    [coupons, addNotification]
  );
  return { addCoupon };
};
