"use client";

import React, {
  createContext,
  useReducer,
  useContext,
  useCallback,
} from "react";
import {
  CartState,
  CartAction,
  initialCartState,
  CartContextType,
  CartItem,
} from "@/types/cart";
import { Product } from "@/schemas/product";

// reducer function
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItemIndex = state.items.findIndex(
        (item) => item.product._id === action.payload._id
      );

      let newItems: CartItem[];

      if (existingItemIndex >= 0) {
        // product already in cart, increase quantity
        newItems = state.items.map((item, index) => {
          return index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item;
        });
      } else {
        // new product, add to cart
        newItems = [...state.items, { product: action.payload, quantity: 1 }];
      }

      return {
        items: newItems,
        totalItems: newItems.reduce((total, item) => total + item.quantity, 0),
        totalPrice: newItems.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        ),
      };
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter(
        (item) => item.product._id !== action.payload
      );

      return {
        items: newItems,
        totalItems: newItems.reduce((total, item) => total + item.quantity, 0),
        totalPrice: newItems.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        ),
      };
    }

    case "UPDATE_QUANTITY": {
      const newItems = state.items
        .map((item) =>
          item.product._id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
        .filter((item) => item.quantity > 0); // delete if quantity = 0

      return {
        items: newItems,
        totalItems: newItems.reduce((total, item) => total + item.quantity, 0),
        totalPrice: newItems.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        ),
      };
    }

    case "DECREASE_QUANTITY": {
      const newItems = state.items
        .map((item) =>
          item.product._id === action.payload
            ? { ...item, quantity: Math.max(0, item.quantity - 1) }
            : item
        )
        .filter((item) => item.quantity > 0);

      return {
        items: newItems,
        totalItems: newItems.reduce((total, item) => total + item.quantity, 0),
        totalPrice: newItems.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        ),
      };
    }

    case "CLEAR_CART": {
      return initialCartState;
    }

    default:
      return state;
  }
};

// create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// cart provider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  // helper functions
  const addItem = useCallback((product: Product) => {
    dispatch({ type: "ADD_ITEM", payload: product });
  }, []);

  const removeItem = useCallback((productId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: productId });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
  }, []);

  const decreaseQuantity = useCallback((productId: string) => {
    dispatch({ type: "DECREASE_QUANTITY", payload: productId });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const getItemQuantity = useCallback(
    (productId: string): number => {
      const item = state.items.find((item) => item.product._id === productId);
      return item ? item.quantity : 0;
    },
    [state.items]
  );

  const value: CartContextType = {
    state,
    dispatch,
    addItem,
    removeItem,
    updateQuantity,
    decreaseQuantity,
    clearCart,
    getItemQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// personlized hook
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
