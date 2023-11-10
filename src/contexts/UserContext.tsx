import { createContext, SetStateAction } from "react";
import { User } from "../types/user";

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => SetStateAction<User | null>;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: (user: User | null) => user,
});
