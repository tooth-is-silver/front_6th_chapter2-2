import { Dispatch, SetStateAction } from "react";
import {
  AddNotification,
  CartItem,
  ProductForm,
  ProductWithUI,
} from "../../../types";
import ProductFormPanel from "./ProductFormPanel";
import ProductTable from "./ProductTable";

interface ProductsTabContentsProps {
  cart: Array<CartItem>;
  products: Array<ProductWithUI>;
  editingProduct: string | null;
  setEditingProduct: Dispatch<SetStateAction<string | null>>;
  productForm: ProductForm;
  setProductForm: Dispatch<SetStateAction<ProductForm>>;
  showProductForm: boolean;
  setShowProductForm: Dispatch<SetStateAction<boolean>>;
  startEditProduct: (product: ProductWithUI) => void;
  deleteProduct: (productId: string) => void;
  handleProductSubmit: (e: React.FormEvent) => void;
  addNotification: AddNotification;
}

const ProductsTabContents = ({
  cart,
  products,
  editingProduct,
  setEditingProduct,
  productForm,
  setProductForm,
  showProductForm,
  setShowProductForm,
  startEditProduct,
  deleteProduct,
  handleProductSubmit,
  addNotification,
}: ProductsTabContentsProps) => {
  return (
    <section className="bg-white rounded-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">상품 목록</h2>
          <button
            onClick={() => {
              setEditingProduct("new");
              setProductForm({
                name: "",
                price: 0,
                stock: 0,
                description: "",
                discounts: [],
              });
              setShowProductForm(true);
            }}
            className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
          >
            새 상품 추가
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <ProductTable
          cart={cart}
          products={products}
          startEditProduct={startEditProduct}
          deleteProduct={deleteProduct}
        />
      </div>
      {showProductForm && (
        <ProductFormPanel
          editingProduct={editingProduct}
          setEditingProduct={setEditingProduct}
          productForm={productForm}
          setProductForm={setProductForm}
          setShowProductForm={setShowProductForm}
          handleProductSubmit={handleProductSubmit}
          addNotification={addNotification}
        />
      )}
    </section>
  );
};

export default ProductsTabContents;
