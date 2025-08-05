import { useState } from "react";
import { CartItem } from "../types";
import { Header } from "./components/common/Header";
import { Notification } from "../types";
import { NotificationToast } from "./components/common/NotificationToast";
import CartPage from "./pages/CartPage";
import AdminPage from "./pages/AdminPage";

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
  const [isAdmin, setIsAdmin] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalItemCount, setTotalItemCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationToast
        notifications={notifications}
        setNotifications={setNotifications}
      />
      <Header
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        cart={cart}
        totalItemCount={totalItemCount}
      />
      {isAdmin ? (
        <AdminPage />
      ) : (
        <CartPage
          cart={cart}
          isAdmin={isAdmin}
          setCart={setCart}
          searchTerm={searchTerm}
          setTotalItemCount={setTotalItemCount}
          setNotifications={setNotifications}
        />
      )}
    </div>
  );
}
