import { createContext, SetStateAction } from "react";
import { WishlistItem } from "../types/item";

interface WishlistContextType {
  wishlist: WishlistItem[];
  setWishlist: (Wishlist: WishlistItem[]) => SetStateAction<WishlistItem[]>;
}

export const WishlistContext = createContext<WishlistContextType>({
  wishlist: [],
  setWishlist: (wishlist: WishlistItem[]) => wishlist,
});
