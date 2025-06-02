"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { setupListeners } from "@reduxjs/toolkit/query";
import { store, persistor } from "./store";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  setupListeners(store.dispatch);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}