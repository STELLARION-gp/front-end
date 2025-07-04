import { createContext } from "react";
import type { AuthContextType } from "../types/auth";

// Create context with default undefined
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
