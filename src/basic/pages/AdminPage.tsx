import { useState } from "react";
import { couponHandler } from "../handlers/coupon";
import { AddNotification, CartItem, Coupon, ProductWithUI } from "../../types";
import { productHandler } from "../handlers/product";
import ProductsTabContents from "../components/admin/ProductsTabContents";
import CouponsTabContents from "../components/admin/CouponsTabContents";

interface AdminPageProps {
  coupons: Array<Coupon>;
  products: Array<ProductWithUI>;
  cart: Array<CartItem>;
  addProduct: (newProduct: Omit<ProductWithUI, "id">) => void;
  deleteProduct: (productId: string) => void;
  updateProduct: (productId: string, updates: Partial<ProductWithUI>) => void;
  handleAddCoupon: (newCoupon: Coupon) => void;
  handleDeleteCoupon: (couponCode: string) => void;
  addNotification: AddNotification;
}
const AdminPage = ({
  coupons,
  products,
  cart,
  addProduct,
  deleteProduct,
  updateProduct,
  handleAddCoupon,
  handleDeleteCoupon,
  addNotification,
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
    handleAddCoupon,
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
          handleProductSubmit={handleProductSubmit}
          addNotification={addNotification}
        />
      ) : (
        <CouponsTabContents
          coupons={coupons}
          handleDeleteCoupon={handleDeleteCoupon}
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
