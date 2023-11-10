import { CartItem } from "./item";

export interface Order {
  id: string;
  totalAmount: number;
  items: CartItem[];
  customerCheckoutInfo: CustomerCheckoutInfo;
  customerId: string;
  sellerId: string;
  status: OrderStatus;
}

export interface CustomerCheckoutInfo {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
}

export enum OrderStatus {
  PENDING = "Pending",
  PROCESSING = "Processing",
  CANCELLED = "Cancelled",
  COMPLETED = "Completed",
}
