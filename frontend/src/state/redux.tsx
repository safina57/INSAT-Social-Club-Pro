"use client";

import { Provider } from "react-redux";
import { setupListeners } from "@reduxjs/toolkit/query";
import { useRef } from "react";
import { makeStore, type AppStore } from "./store";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = makeStore();
    setupListeners(storeRef.current.dispatch);
  }
  return <Provider store={storeRef.current}>{children}</Provider>;
}
