import { createContext, useContext, useEffect, useState } from "react";
import { useDebounce } from "react-use";

const Context = createContext({});

export function GlobalProvider({
  logined,
  setLogined,
  children,
}: {
  logined: boolean;
  setLogined: any;
  children: React.ReactNode;
}) {
  return (
    <Context.Provider
      value={{
        logined,
        setLogined,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useGlobalContext() {
  return useContext(Context);
}
