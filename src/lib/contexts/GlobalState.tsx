"use client";

import { ReactNode, useContext, createContext, useState } from "react";

export const GlobalStateContext = createContext<GlobalStateContextType | null>(
  null
);

export function useGlobalState() {
  return useContext(GlobalStateContext) as GlobalStateContextType;
}

export function GlobalStateContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const drawerState = { drawerOpen, setDrawerOpen };

  const value = {
    drawerState,
  };

  return (
    <GlobalStateContext.Provider value={value}>
      {children}
    </GlobalStateContext.Provider>
  );
}
