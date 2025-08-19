import { Product } from "@/schemas/product";

// cart item
export interface CartItem {
  product: Product;
  quantity: number;
}

// global cart state
export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

// useReducer action types
export type CartAction =
  | { type: "ADD_ITEM"; payload: Product }
  | { type: "REMOVE_ITEM"; payload: string } // productId
  | {
      type: "UPDATE_QUANTITY";
      payload: { productId: string; quantity: number };
    }
  | { type: "DECREASE_QUANTITY"; payload: string } // productId
  | { type: "CLEAR_CART" }
  | { type: "RESTORE_CART"; payload: CartState };

// context type (state + actions)
export interface CartContextType {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  // helpers functions
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  decreaseQuantity: (productId: string) => void;
  clearCart: () => void;
  getItemQuantity: (productId: string) => number;
}

// initial state
export const initialCartState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};
