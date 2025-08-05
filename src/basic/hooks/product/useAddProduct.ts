import { Dispatch, SetStateAction, useCallback } from "react";
import { ProductWithUI } from "../../../types";

export const useAddProduct = (
  setProducts: Dispatch<SetStateAction<Array<ProductWithUI>>>,
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void
) => {
  const addProduct = useCallback(
    (newProduct: Omit<ProductWithUI, "id">) => {
      const product: ProductWithUI = {
        ...newProduct,
        id: `p${Date.now()}`,
      };
      setProducts((prev) => [...prev, product]);
      addNotification("상품이 추가되었습니다.", "success");
    },
    [addNotification]
  );
  return { addProduct };
};
