export interface SellerItem {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  sellerId: string;
  isAvailable: boolean;
  quantity: number;
  imageUrl?: string;
}

export interface WishlistItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  isAvailable: boolean;
  sellerId: string;
  imageUrl?: string;
}

export interface CartItem {
  id: string;
  quantity: number;
  sellerId: string;
  price: number;
  name: string;
  imageUrl?: string;
}
