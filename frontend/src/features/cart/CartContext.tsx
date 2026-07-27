import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { CartItem } from '@/types';

interface CartValue {
  items: CartItem[];
  count: number;
  total: number;
  add: (item: CartItem) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const add = useCallback((item: CartItem) => {
    setItems((current) => {
      const found = current.find((value) => value.productId === item.productId);
      if (!found) return [...current, item];
      return current.map((value) =>
        value.productId === item.productId
          ? { ...value, quantity: Math.min(value.quantity + item.quantity, value.maxQuantity) }
          : value,
      );
    });
  }, []);
  const remove = useCallback(
    (productId: string) =>
      setItems((current) => current.filter((item) => item.productId !== productId)),
    [],
  );
  const setQuantity = useCallback((productId: string, quantity: number) => {
    setItems((current) =>
      current.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.max(1, Math.min(quantity, item.maxQuantity)) }
          : item,
      ),
    );
  }, []);
  const clear = useCallback(() => setItems([]), []);
  const value = useMemo(
    () => ({
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      total: items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
      add,
      remove,
      setQuantity,
      clear,
    }),
    [items, add, remove, setQuantity, clear],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Provider and hook intentionally share this feature boundary.
// eslint-disable-next-line react-refresh/only-export-components
export function useCart(): CartValue {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
