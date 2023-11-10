export interface User {
  id: string;
  email: string;
  role: UserRole;
  verified: boolean;
  profile: CustomerProfile | SellerProfile;
}

export interface CustomerProfile {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  wishlist: string[];
}

export interface SellerProfile {
  name: string;
  description: string;
  phoneNumber: string;
  address: string;
  businessEmail: string;
  categoryId: string;
  itemCategories?: string[];
  logoUrl?: string;
  websiteUrl?: string;
  itemsCount?: number;
}

export interface SellerInfo extends SellerProfile {
  id: string;
  categoryName: string;
}

export enum UserRole {
  CUSTOMER = "Customer",
  SELLER = "Seller",
  ADMIN = "Admin",
}
