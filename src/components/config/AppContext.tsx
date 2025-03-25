"use client"
// context/AppContext.tsx
import { createContext, useContext } from "react";

const AppContext = createContext<{ appName: string } | undefined>(undefined);

export const AppProvider = ({ appName, children }: { appName: string; children: React.ReactNode }) => {
  return <AppContext.Provider value={{ appName }}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within an AppProvider");
  return context;
};