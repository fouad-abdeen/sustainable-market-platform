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
  imageUrl?: string;
  sellerId?: string;
}

export interface CartItem {
  id: string;
  quantity: number;
  sellerId: string;
  price: number;
  name: string;
  imageUrl?: string;
}
