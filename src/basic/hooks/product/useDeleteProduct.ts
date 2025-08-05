import { Dispatch, SetStateAction, useCallback } from "react";
import { ProductWithUI } from "../../../types";

export const useDeleteProduct = (
  setProducts: Dispatch<SetStateAction<Array<ProductWithUI>>>,
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void
) => {
  const deleteProduct = useCallback(
    (productId: string) => {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      addNotification("상품이 삭제되었습니다.", "success");
    },
    [addNotification]
  );
  return { deleteProduct };
};
