export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  description?: string;
}

export enum CategoryType {
  ITEM = "Item",
  PRODUCT = "Product",
  SERVICE = "Service",
}
