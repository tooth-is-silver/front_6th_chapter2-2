import { useEffect, useState } from "react";
import { CartItem, Coupon } from "../types";
import { Header } from "./components/common/Header";
import { NotificationToast } from "./components/common/NotificationToast";
import CartPage from "./pages/CartPage";
import AdminPage from "./pages/AdminPage";
import { initialCoupons } from "./constants";
import { useLocalStorageState } from "./utils/hooks/useLocalStorageState";
import { useFilteredProducts } from "./utils/hooks/useFilteredProducts";
import { useDebounce } from "./utils/hooks/useDebounce";
import { useProducts } from "./hooks/useProducts";
import { useNotification } from "./hooks/useNotification";

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useLocalStorageState<Array<CartItem>>("cart", []);
  const [coupons, setCoupons] = useLocalStorageState<Array<Coupon>>(
    "coupons",
    initialCoupons
  );

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { notifications, addNotification, removeNotification } =
    useNotification();
  const { products, addProduct, deleteProduct, updateProduct } = useProducts();

  const filteredProducts = useFilteredProducts(products, debouncedSearchTerm);

  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [totalItemCount, setTotalItemCount] = useState(0);

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
        removeNotification={removeNotification}
      />
      <Header
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        cart={cart}
        totalItemCount={totalItemCount}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isAdmin ? (
          <AdminPage
            products={products}
            coupons={coupons}
            setCoupons={setCoupons}
            selectedCoupon={selectedCoupon}
            setSelectedCoupon={setSelectedCoupon}
            addNotification={addNotification}
            cart={cart}
            addProduct={addProduct}
            deleteProduct={deleteProduct}
            updateProduct={updateProduct}
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
