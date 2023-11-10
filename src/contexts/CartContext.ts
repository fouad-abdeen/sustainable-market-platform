import { createContext, SetStateAction } from "react";
import { CartResponse } from "../types/api-responses";

interface CartContextType {
  cart: CartResponse;
  setCart: (cart: CartResponse) => SetStateAction<CartResponse>;
}

export const CartContext = createContext<CartContextType>({
  cart: {} as CartResponse,
  setCart: (cart: CartResponse) => cart,
});
