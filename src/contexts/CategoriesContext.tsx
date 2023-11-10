import { createContext, SetStateAction } from "react";
import { CategoryResponse } from "../types/api-responses";

interface CategoriesContextType {
  categories: CategoryResponse[];
  setCategories: (Categories: CategoryResponse[]) => SetStateAction<CategoryResponse[]>;
}

export const CategoriesContext = createContext<CategoriesContextType>({
  categories: {} as CategoryResponse[],
  setCategories: (Categories: CategoryResponse[]) => Categories,
});
