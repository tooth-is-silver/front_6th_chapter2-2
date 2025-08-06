import { Dispatch, SetStateAction } from "react";
import { CartItem, ProductWithUI, Coupon } from "../../types";
import { CartIcon } from "../components/icons";
import { cartHandler } from "../handlers/cart";
import { useAddToCart } from "../hooks/cart/useAddToCart";
import { useApplyCoupon } from "../hooks/cart/useApplyCoupon";
import { useRemoveFromCart } from "../hooks/cart/useRemoveFormCart";
import { useUpdateQuantity } from "../hooks/cart/useUpdateQuantity";
import { useCompleteOrder } from "../hooks/order/useCompleteOrder";
import { getRemainingStock } from "../utils/stock";
import ProductList from "../components/cart/ProductList";
import EmptyCart from "../components/cart/EmptyCart";
import CartItemList from "../components/cart/CartItemList";

interface CartPageProps {
  cart: Array<CartItem>;
  setCart: Dispatch<SetStateAction<Array<CartItem>>>;
  products: Array<ProductWithUI>;
  coupons: Array<Coupon>;
  selectedCoupon: Coupon | null;
  setSelectedCoupon: Dispatch<SetStateAction<Coupon | null>>;
  filteredProducts: Array<ProductWithUI>;
  debouncedSearchTerm: string;
  addNotification: (
    message: string,
    type?: "error" | "success" | "warning"
  ) => void;
}

const CartPage = ({
  cart,
  setCart,
  products,
  coupons,
  selectedCoupon,
  setSelectedCoupon,
  filteredProducts,
  debouncedSearchTerm,
  addNotification,
}: CartPageProps) => {
  const { calculateItemTotal, calculateCartTotal } = cartHandler(
    cart,
    selectedCoupon
  );

  const { addToCart } = useAddToCart(
    getRemainingStock,
    addNotification,
    cart,
    setCart
  );

  const { removeFromCart } = useRemoveFromCart(setCart);
  const { updateQuantity } = useUpdateQuantity(
    removeFromCart,
    products,
    addNotification,
    setCart,
    getRemainingStock
  );

  const { applyCoupon } = useApplyCoupon(
    calculateCartTotal,
    addNotification,
    setSelectedCoupon
  );

  const { completeOrder } = useCompleteOrder(
    setCart,
    setSelectedCoupon,
    addNotification
  );

  const totals = calculateCartTotal();

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {/* 상품 목록 */}
          <section>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">
                전체 상품
              </h2>
              <div className="text-sm text-gray-600">
                총 {products.length}개 상품
              </div>
            </div>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  "{debouncedSearchTerm}"에 대한 검색 결과가 없습니다.
                </p>
              </div>
            ) : (
              <ProductList
                products={filteredProducts}
                cart={cart}
                addToCart={addToCart}
              />
            )}
          </section>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <section className="bg-white rounded-lg border border-gray-200 p-4">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <CartIcon type={"default"} strokeWidth={2} />
                장바구니
              </h2>
              {cart.length === 0 ? (
                <EmptyCart />
              ) : (
                <CartItemList
                  cart={cart}
                  calculateItemTotal={calculateItemTotal}
                  removeFromCart={removeFromCart}
                  updateQuantity={updateQuantity}
                />
              )}
            </section>

            {cart.length > 0 && (
              <>
                <section className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-700">
                      쿠폰 할인
                    </h3>
                    <button className="text-xs text-blue-600 hover:underline">
                      쿠폰 등록
                    </button>
                  </div>
                  {coupons.length > 0 && (
                    <select
                      className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                      value={selectedCoupon?.code || ""}
                      onChange={(e) => {
                        const coupon = coupons.find(
                          (c) => c.code === e.target.value
                        );
                        if (coupon) applyCoupon(coupon);
                        else setSelectedCoupon(null);
                      }}
                    >
                      <option value="">쿠폰 선택</option>
                      {coupons.map((coupon) => (
                        <option key={coupon.code} value={coupon.code}>
                          {coupon.name} (
                          {coupon.discountType === "amount"
                            ? `${coupon.discountValue.toLocaleString()}원`
                            : `${coupon.discountValue}%`}
                          )
                        </option>
                      ))}
                    </select>
                  )}
                </section>

                <section className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="text-lg font-semibold mb-4">결제 정보</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">상품 금액</span>
                      <span className="font-medium">
                        {totals.totalBeforeDiscount.toLocaleString()}원
                      </span>
                    </div>
                    {totals.totalBeforeDiscount - totals.totalAfterDiscount >
                      0 && (
                      <div className="flex justify-between text-red-500">
                        <span>할인 금액</span>
                        <span>
                          -
                          {(
                            totals.totalBeforeDiscount -
                            totals.totalAfterDiscount
                          ).toLocaleString()}
                          원
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between py-2 border-t border-gray-200">
                      <span className="font-semibold">결제 예정 금액</span>
                      <span className="font-bold text-lg text-gray-900">
                        {totals.totalAfterDiscount.toLocaleString()}원
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={completeOrder}
                    className="w-full mt-4 py-3 bg-yellow-400 text-gray-900 rounded-md font-medium hover:bg-yellow-500 transition-colors"
                  >
                    {totals.totalAfterDiscount.toLocaleString()}원 결제하기
                  </button>

                  <div className="mt-3 text-xs text-gray-500 text-center">
                    <p>* 실제 결제는 이루어지지 않습니다</p>
                  </div>
                </section>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default CartPage;
