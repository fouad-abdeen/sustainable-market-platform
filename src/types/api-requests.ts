import { CategoryType } from "./category";
import { OrderStatus } from "./order";
import { UserRole } from "./user";

export interface SigninRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  sellerName?: string;
  categoryId?: string;
}

export interface ItemQueryParams {
  sellerId?: string;
  categoryId?: string;
  isAvailable?: boolean;
}

export interface CartItemRequest {
  id: string;
  quantity: number;
}

export interface SellerItemCreateRequest {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  sellerId: string;
  isAvailable?: boolean;
  quantity?: number;
  imageUrl?: string;
}

export interface SellerItemUpdateRequest {
  name?: string;
  description?: string;
  price?: number;
  categoryId?: string;
  isAvailable?: boolean;
  quantity?: number;
  imageUrl?: string;
}

export interface OrderPlacementRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
}

export interface OrderQueryParams {
  sellerId?: string;
  customerId?: string;
  status?: OrderStatus;
}

export interface OrderUpdateRequest {
  id: string;
  status: OrderStatus;
}

export interface CategoryCreateRequest {
  name: string;
  type: CategoryType;
  description?: string;
}

export interface CategoryUpdateRequest {
  name?: string;
  type?: CategoryType;
  description?: string;
}

export interface CustomerProfileUpdateRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
}

export interface SellerProfileUpdateRequest {
  name?: string;
  description?: string;
  phoneNumber?: string;
  address?: string;
  businessEmail?: string;
  menuImageUrl?: string;
  logoUrl?: string;
  websiteUrl?: string;
}

export interface SellersQueryParams {
  activeSellers?: boolean;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
  terminateAllSessions: boolean;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface AdminMessageRequest {
  name: string;
  email: string;
  message: string;
}
