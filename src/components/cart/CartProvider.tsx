"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  handle: string;
  title: string;
  sku: string | null;
  image: string;
  priceUsd: number;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  ready: boolean; // true once localStorage has been read (avoids empty-cart flash)
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (handle: string, qty: number) => void;
  remove: (handle: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "lpd_cart_v1";
const MAX_QTY = 99;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed.filter((x) => x && x.handle && x.qty > 0));
      }
    } catch {
      /* ignore malformed storage */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage may be full/blocked */
    }
  }, [items, ready]);

  const add = useCallback<CartContextValue["add"]>((item, qty = 1) => {
    setItems((prev) => {
      const i = prev.findIndex((x) => x.handle === item.handle);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: Math.min(MAX_QTY, next[i].qty + qty) };
        return next;
      }
      return [...prev, { ...item, qty: Math.min(MAX_QTY, Math.max(1, qty)) }];
    });
  }, []);

  const setQty = useCallback<CartContextValue["setQty"]>((handle, qty) => {
    setItems((prev) =>
      prev.map((x) => (x.handle === handle ? { ...x, qty: Math.max(1, Math.min(MAX_QTY, qty)) } : x))
    );
  }, []);

  const remove = useCallback<CartContextValue["remove"]>((handle) => {
    setItems((prev) => prev.filter((x) => x.handle !== handle));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      ready,
      count: items.reduce((a, x) => a + x.qty, 0),
      subtotal: items.reduce((a, x) => a + x.qty * x.priceUsd, 0),
      add,
      setQty,
      remove,
      clear,
    }),
    [items, ready, add, setQty, remove, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
