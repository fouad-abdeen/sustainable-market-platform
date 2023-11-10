import { createContext, SetStateAction } from "react";
import { CustomerCheckoutInfo } from "../types/order";

interface CheckoutContextType {
  checkoutInfo: CustomerCheckoutInfo;
  setCheckoutInfo: (checkoutInfo: CustomerCheckoutInfo) => SetStateAction<CustomerCheckoutInfo>;
}

export const CheckoutContext = createContext<CheckoutContextType>({
  checkoutInfo: {} as CustomerCheckoutInfo,
  setCheckoutInfo: (checkoutInfo: CustomerCheckoutInfo) => checkoutInfo,
});
