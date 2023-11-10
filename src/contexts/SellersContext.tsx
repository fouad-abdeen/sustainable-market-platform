import { createContext, SetStateAction } from "react";
import { SellerInfo } from "../types/user";

interface SellersContextType {
  sellers: SellerInfo[];
  setSellers: (sellers: SellerInfo[]) => SetStateAction<SellerInfo[]>;
}

export const SellersContext = createContext<SellersContextType>({
  sellers: {} as SellerInfo[],
  setSellers: (sellers: SellerInfo[]) => sellers,
});
