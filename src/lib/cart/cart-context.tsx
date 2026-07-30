"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";

import type { CartItem } from "@/types/cart";

const STORAGE_KEY = "alexandra-perfumaria:carrinho";

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: "LOAD"; items: CartItem[] }
  | { type: "ADD_ITEM"; item: Omit<CartItem, "quantity">; quantity: number }
  | { type: "REMOVE_ITEM"; productId: string }
  | { type: "SET_QUANTITY"; productId: string; quantity: number }
  | { type: "CLEAR" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "LOAD":
      return { items: action.items };

    case "ADD_ITEM": {
      const existing = state.items.find(
        (item) => item.productId === action.item.productId,
      );

      if (existing) {
        return {
          items: state.items.map((item) =>
            item.productId === action.item.productId
              ? { ...item, quantity: item.quantity + action.quantity }
              : item,
          ),
        };
      }

      return {
        items: [...state.items, { ...action.item, quantity: action.quantity }],
      };
    }

    case "REMOVE_ITEM":
      return {
        items: state.items.filter(
          (item) => item.productId !== action.productId,
        ),
      };

    case "SET_QUANTITY":
      return {
        items: state.items.map((item) =>
          item.productId === action.productId
            ? { ...item, quantity: Math.max(1, action.quantity) }
            : item,
        ),
      };

    case "CLEAR":
      return { items: [] };

    default:
      return state;
  }
}

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const skipFirstSave = useRef(true);

  // Carrega o carrinho salvo no navegador ao montar (só existe no cliente).
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    try {
      const items = JSON.parse(stored) as CartItem[];
      dispatch({ type: "LOAD", items });
    } catch {
      // carrinho salvo corrompido: ignora e começa vazio
    }
  }, []);

  // Salva a cada mudança, exceto na primeira renderização (antes do carregamento acima).
  useEffect(() => {
    if (skipFirstSave.current) {
      skipFirstSave.current = false;
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const value = useMemo<CartContextValue>(() => {
    const totalItems = state.items.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );
    const totalPrice = state.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    return {
      items: state.items,
      totalItems,
      totalPrice,
      addItem: (item, quantity = 1) =>
        dispatch({ type: "ADD_ITEM", item, quantity }),
      removeItem: (productId) => dispatch({ type: "REMOVE_ITEM", productId }),
      setQuantity: (productId, quantity) =>
        dispatch({ type: "SET_QUANTITY", productId, quantity }),
      clearCart: () => dispatch({ type: "CLEAR" }),
    };
  }, [state.items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart precisa ser usado dentro de um CartProvider.");
  }
  return context;
}
