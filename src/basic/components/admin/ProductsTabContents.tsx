import { Dispatch, SetStateAction } from "react";
import { CartItem, ProductForm, ProductWithUI } from "../../../types";
import { formatPrice } from "../../utils/format";
import { getRemainingStock } from "../../utils/stock";
import { CloseIcon } from "../icons";
import Input from "../common/Input";
import ProductFormPanel from "./ProductFormPanel";

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
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void;
  handleProductSubmit: (e: React.FormEvent) => void;
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
  addNotification,
  handleProductSubmit,
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
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상품명
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                가격
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                재고
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                설명
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatPrice(
                    products,
                    true,
                    product.price,
                    getRemainingStock(cart, product),
                    product.id
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.stock > 10
                        ? "bg-green-100 text-green-800"
                        : product.stock > 0
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.stock}개
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {product.description || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => startEditProduct(product)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showProductForm && (
        <ProductFormPanel
          editingProduct={editingProduct}
          setEditingProduct={setEditingProduct}
          productForm={productForm}
          setProductForm={setProductForm}
          setShowProductForm={setShowProductForm}
          addNotification={addNotification}
          handleProductSubmit={handleProductSubmit}
        />
      )}
    </section>
  );
};

export default ProductsTabContents;
