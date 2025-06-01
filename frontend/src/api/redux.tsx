"use client";

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { api } from "./api";
import { Provider } from "react-redux";
import { setupListeners } from "@reduxjs/toolkit/query";
import { useRef } from "react";

/* REDUX STORE */
const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
});

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [
            "api/executeMutation/pending",
            "api/executeMutation/fulfilled",
            "api/executeMutation/rejected",
          ],
          ignoredActionPaths: [
            "meta.arg.originalArgs.file",
            "meta.arg.originalArgs.formData",
            "meta.baseQueryMeta.request",
            "meta.baseQueryMeta.response",
          ],
          ignoredPaths: [
            "meta.baseQueryMeta.request",
            "meta.baseQueryMeta.response",
            "api.mutations",
          ],
        },
      }).concat(api.middleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
    setupListeners(storeRef.current.dispatch);
  }
  return <Provider store={storeRef.current}>{children}</Provider>;
}
