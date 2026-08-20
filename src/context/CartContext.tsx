"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useSession } from "../lib/auth-client";

interface AddToCartInput {
  productId: string;
  name: string;
  price: number;
  image?: string;
  qty?: number;
}

interface CartContextType {
  cartCount: number;
  addToCart: (item: AddToCartInput) => Promise<boolean>;
  refreshCart: () => void;
}

const CartContext = createContext<CartContextType>({
  cartCount: 0,
  addToCart: async () => false,
  refreshCart: () => {},
});

export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [cartCount, setCartCount] = useState(0);

  function refreshCart() {
    if (!session) {
      setCartCount(0);
      return;
    }
    fetch("/api/cart", { credentials: "include" })
      .then((r) => r.json())
      .then((items: { qty: number }[]) => {
        const total = Array.isArray(items)
          ? items.reduce((sum, i) => sum + i.qty, 0)
          : 0;
        setCartCount(total);
      })
      .catch(() => setCartCount(0));
  }

  // লগইন স্টেট বদলালে (লগইন/লগআউট) কার্ট রিফ্রেশ হবে
  useEffect(() => {
    refreshCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  async function addToCart(item: AddToCartInput) {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ qty: 1, ...item }),
      });
      if (!res.ok) return false;

      // Navbar badge সাথে সাথে আপডেট হওয়ার জন্য optimistic update
      setCartCount((c) => c + (item.qty ?? 1));
      return true;
    } catch {
      return false;
    }
  }

  return (
    <CartContext.Provider value={{ cartCount, addToCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
