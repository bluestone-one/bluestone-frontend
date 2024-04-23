"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useDebounce } from "react-use";

const initState: {
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  eventTarget?: any;
  setEventTarget?: React.Dispatch<React.SetStateAction<any>>;
} = {};

const Context = createContext(initState);

export function EventDrawerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [eventTarget, setEventTarget] = useState();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Context.Provider
      value={{ eventTarget, setEventTarget, isOpen, setIsOpen }}
    >
      {children}
    </Context.Provider>
  );
}

export function useEventDrawerContext() {
  return useContext(Context);
}
