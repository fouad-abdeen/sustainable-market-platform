import { AdminMessageRequest } from "./api-requests";
import { Category } from "./category";
import { CartItem, SellerItem } from "./item";
import { Order } from "./order";
import { User } from "./user";

export interface ApiResponse<T> {
  status: "success" | "error";
  data: T;
  error: {
    name: string;
    message: string;
  };
}

export interface AuthResponse {
  userInfo: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface CartResponse {
  id: string;
  ownerId: string;
  total: number;
  items: CartItem[];
  updatedAt?: number;
}

export interface OrderResponse extends Order {
  createdAt?: number;
  updatedAt?: number;
}

export interface SellerItemResponse extends SellerItem {
  createdAt?: number;
  updatedAt?: number;
  updatedBy?: string;
}

export interface CategoryResponse extends Category {
  createdAt?: number;
  updatedAt?: number;
}

export interface ItemCategoryResponse {
  id: string;
  name: string;
  description: string;
}

export interface AdminMessageResponse extends AdminMessageRequest {
  id: string;
  createdAt?: number;
}
