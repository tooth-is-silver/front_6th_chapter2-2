import { useEffect, useState } from "react";
import { CartItem, Coupon, ProductWithUI } from "../types";
import { Header } from "./components/common/Header";
import { Notification } from "../types";
import { NotificationToast } from "./components/common/NotificationToast";
import CartPage from "./pages/CartPage";
import AdminPage from "./pages/AdminPage";
import { initialCoupons, initialProducts } from "./constants";
import { useAddNotification } from "./hooks/notification/useAddNotification";
import { useLocalStorageState } from "./hooks/common/useLocalStorageState";
import { useFilteredProducts } from "./hooks/common/useFilteredProducts";

export default function App() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [coupons, setCoupons] = useLocalStorageState<Array<Coupon>>(
    "coupons",
    initialCoupons
  );
  const [products, setProducts] = useLocalStorageState<Array<ProductWithUI>>(
    "products",
    initialProducts
  );
  const filteredProducts = useFilteredProducts(products, debouncedSearchTerm);

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [totalItemCount, setTotalItemCount] = useState(0);

  const { addNotification } = useAddNotification(setNotifications);

  useEffect(() => {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItemCount(count);
  }, [cart]);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    } else {
      localStorage.removeItem("cart");
    }
  }, [cart]);

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationToast
        notifications={notifications}
        setNotifications={setNotifications}
      />
      <Header
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        cart={cart}
        totalItemCount={totalItemCount}
        setDebouncedSearchTerm={setDebouncedSearchTerm}
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage
            coupons={coupons}
            setCoupons={setCoupons}
            products={products}
            setProducts={setProducts}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            addNotification={addNotification}
            cart={cart}
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
            addNotification={addNotification}
          />
        )}
      </main>
    </div>
  );
}
