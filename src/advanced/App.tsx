import { useEffect } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { CartItem, Coupon } from "../types";
import { Header } from "./components/common/Header";
import { NotificationToast } from "./components/common/NotificationToast";
import CartPage from "./pages/CartPage";
import AdminPage from "./pages/AdminPage";
import { useLocalStorageState } from "./utils/hooks/useLocalStorageState";
import { useFilteredProducts } from "./utils/hooks/useFilteredProducts";
import { useDebounce } from "./utils/hooks/useDebounce";
import { useProducts } from "./hooks/useProducts";
import { useCoupons } from "./hooks/useCoupons";
import { NOTIFICATION_MESSAGE } from "./constants";
import { cartHandler } from "./handlers/cart";
import { isAdminAtom } from "./atoms/admin";
import { searchTermAtom } from "./atoms/search";
import { addNotificationAtom } from "./atoms/notification";

export default function App() {
  const searchTerm = useAtomValue(searchTermAtom);
  const [cart, setCart] = useLocalStorageState<Array<CartItem>>("cart", []);
  const {
    coupons,
    hasCoupon,
    addCoupon,
    deleteCoupon,
    selectedCoupon,
    setSelectedCoupon,
    applyCoupon,
  } = useCoupons();

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const addNotification = useSetAtom(addNotificationAtom);
  const { products, addProduct, deleteProduct, updateProduct } = useProducts();

  const filteredProducts = useFilteredProducts(products, debouncedSearchTerm);

  const [isAdmin] = useAtom(isAdminAtom);

  const {
    calculateItemTotal,
    calculateCartTotal,
    updateCartItemQuantity,
    getRemainingStock,
    removeFromCart,
  } = cartHandler(cart, selectedCoupon);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("cart");
    }
  }, [cart]);

  const handleDeleteCoupon = (couponCode: string) => {
    deleteCoupon(couponCode);
    addNotification({
      message: NOTIFICATION_MESSAGE.COUPON.DELETE,
      type: "success",
    });
  };

  const handleAddCoupon = (newCoupon: Coupon) => {
    const isSuccessAddCoupon = addCoupon(newCoupon, hasCoupon(newCoupon.code));
    if (isSuccessAddCoupon) {
      addNotification({
        message: NOTIFICATION_MESSAGE.COUPON.ADD,
        type: "success",
      });
    } else {
      addNotification({
        message: NOTIFICATION_MESSAGE.ERROR.EXISTED_COUPON,
        type: "error",
      });
    }
  };

  const handleApplyCoupon = (coupon: Coupon, currentTotal: number) => {
    const canApplyCoupon = applyCoupon(coupon, currentTotal);
    if (canApplyCoupon) {
      addNotification({
        message: NOTIFICATION_MESSAGE.COUPON.APPLIED,
        type: "success",
      });
    } else {
      addNotification({
        message: NOTIFICATION_MESSAGE.ERROR.MIN_COUPON,
        type: "error",
      });
    }
  };
  const totals = calculateCartTotal();

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationToast />
      <Header cart={cart} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage
            products={products}
            coupons={coupons}
            addProduct={addProduct}
            deleteProduct={deleteProduct}
            updateProduct={updateProduct}
            handleAddCoupon={handleAddCoupon}
            handleDeleteCoupon={handleDeleteCoupon}
            getRemainingStock={getRemainingStock}
          />
        ) : (
          <CartPage
            cart={cart}
            setCart={setCart}
            products={products}
            coupons={coupons}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            filteredProducts={filteredProducts}
            debouncedSearchTerm={debouncedSearchTerm}
            handleApplyCoupon={handleApplyCoupon}
            totals={totals}
            getRemainingStock={getRemainingStock}
            updateCartItemQuantity={updateCartItemQuantity}
            removeFromCart={removeFromCart}
            calculateItemTotal={calculateItemTotal}
          />
        )}
      </main>
    </div>
  );
}
