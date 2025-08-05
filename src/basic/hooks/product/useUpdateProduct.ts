import { Dispatch, SetStateAction, useCallback } from "react";
import { ProductWithUI } from "../../../types";

export const useUpdateProduct = (
  setProducts: Dispatch<SetStateAction<Array<ProductWithUI>>>,
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void
) => {
  const updateProduct = useCallback(
    (productId: string, updates: Partial<ProductWithUI>) => {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId ? { ...product, ...updates } : product
        )
      );
      addNotification("상품이 수정되었습니다.", "success");
    },
    [addNotification]
  );
  return { updateProduct };
};
