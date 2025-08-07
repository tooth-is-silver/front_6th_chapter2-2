import { ProductWithUI } from "../../types";
import { initialProducts } from "../constants";
import { useLocalStorageState } from "../utils/hooks/useLocalStorageState";

export const useProducts = () => {
  const [products, setProducts] = useLocalStorageState<Array<ProductWithUI>>(
    "products",
    initialProducts
  );
  const addProduct = (newProduct: Omit<ProductWithUI, "id">) => {
    const product: ProductWithUI = {
      ...newProduct,
      id: `p${Date.now()}`,
    };
    setProducts((prev) => [...prev, product]);
    //   addNotification("상품이 추가되었습니다.", "success");
  };

  const updateProduct = (
    productId: string,
    updates: Partial<ProductWithUI>
  ) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === productId ? { ...product, ...updates } : product
      )
    );
    // addNotification("상품이 수정되었습니다.", "success");
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    // addNotification('상품이 삭제되었습니다.', 'success');
  };

  return {
    products,
    addProduct,
    deleteProduct,
    updateProduct,
  };
};
