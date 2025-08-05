import { Dispatch, SetStateAction, useState } from "react";
import { couponHandler } from "../handlers/coupon";
import { useAddCoupon } from "../hooks/coupon/useAddCoupon";
import { CartItem, Coupon, ProductWithUI } from "../../types";
import { useDeleteProduct } from "../hooks/product/useDeleteProduct";
import { useDeleteCoupon } from "../hooks/coupon/useDeleteCoupon";
import { useAddProduct } from "../hooks/product/useAddProduct";
import { useUpdateProduct } from "../hooks/product/useUpdateProduct";
import { productHandler } from "../handlers/product";
import ProductsTabContents from "../components/admin/ProductsTabContents";
import CouponsTabContents from "../components/admin/CouponsTabContents";

interface AdminPageProps {
  coupons: Array<Coupon>;
  setCoupons: Dispatch<SetStateAction<Array<Coupon>>>;
  products: Array<ProductWithUI>;
  setProducts: Dispatch<SetStateAction<Array<ProductWithUI>>>;
  selectedCoupon: Coupon | null;
  setSelectedCoupon: Dispatch<SetStateAction<Coupon | null>>;
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void;
  cart: Array<CartItem>;
}
const AdminPage = ({
  coupons,
  setCoupons,
  products,
  setProducts,
  selectedCoupon,
  setSelectedCoupon,
  addNotification,
  cart,
}: AdminPageProps) => {
  const [showProductForm, setShowProductForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"products" | "coupons">(
    "products"
  );
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    price: 0,
    stock: 0,
    description: "",
    discounts: [] as Array<{ quantity: number; rate: number }>,
  });
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [couponForm, setCouponForm] = useState({
    name: "",
    code: "",
    discountType: "amount" as "amount" | "percentage",
    discountValue: 0,
  });

  const { addProduct } = useAddProduct(setProducts, addNotification);
  const { updateProduct } = useUpdateProduct(setProducts, addNotification);
  const { addCoupon } = useAddCoupon(coupons, setCoupons, addNotification);
  const { deleteProduct } = useDeleteProduct(setProducts, addNotification);

  const { deleteCoupon } = useDeleteCoupon(
    selectedCoupon,
    setSelectedCoupon,
    setCoupons,
    addNotification
  );

  const { handleProductSubmit, startEditProduct } = productHandler(
    editingProduct,
    setEditingProduct,
    updateProduct,
    addProduct,
    productForm,
    setProductForm,
    setShowProductForm
  );

  const { handleCouponSubmit } = couponHandler(
    addCoupon,
    couponForm,
    setCouponForm,
    setShowCouponForm
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="text-gray-600 mt-1">상품과 쿠폰을 관리할 수 있습니다</p>
      </div>
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("products")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "products"
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            상품 관리
          </button>
          <button
            onClick={() => setActiveTab("coupons")}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "coupons"
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            쿠폰 관리
          </button>
        </nav>
      </div>

      {activeTab === "products" ? (
        <ProductsTabContents
          cart={cart}
          products={products}
          editingProduct={editingProduct}
          setEditingProduct={setEditingProduct}
          productForm={productForm}
          setProductForm={setProductForm}
          showProductForm={showProductForm}
          setShowProductForm={setShowProductForm}
          startEditProduct={startEditProduct}
          deleteProduct={deleteProduct}
          addNotification={addNotification}
          handleProductSubmit={handleProductSubmit}
        />
      ) : (
        <CouponsTabContents
          coupons={coupons}
          deleteCoupon={deleteCoupon}
          couponForm={couponForm}
          setCouponForm={setCouponForm}
          showCouponForm={showCouponForm}
          setShowCouponForm={setShowCouponForm}
          handleCouponSubmit={handleCouponSubmit}
          addNotification={addNotification}
        />
      )}
    </div>
  );
};

export default AdminPage;
