import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { api } from "./api";
import globalReducer from "@/state";

/* REDUX STORE */
// Persist configuration for the global reducer only
const persistConfig = {
  key: "global",
  storage,
  whitelist: ["user"], // Only persist the user data
};

// Create persisted global reducer
const persistedGlobalReducer = persistReducer(persistConfig, globalReducer);

const rootReducer = combineReducers({
  global: persistedGlobalReducer,
  [api.reducerPath]: api.reducer,
});

export const makeStore = () => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [
            "persist/PERSIST",
            "persist/REHYDRATE",
            "persist/PAUSE",
            "persist/PURGE",
            "persist/REGISTER",
            "api/executeMutation/pending",
            "api/executeMutation/fulfilled",
            "api/executeMutation/rejected",
          ],
          ignoredActionPaths: [
            "meta.arg.originalArgs.file",
            "meta.arg.originalArgs.formData",
            "meta.baseQueryMeta.request",
            "meta.baseQueryMeta.response",
            "register",
            "rehydrate",
          ],
          ignoredPaths: [
            "meta.baseQueryMeta.request",
            "meta.baseQueryMeta.response",
            "api.mutations",
            "_persist",
          ],
        },
      }).concat(api.middleware),
  });

  return store;
};

export const store = makeStore();
export const persistor = persistStore(store);

/* REDUX TYPES */
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

/* REDUX HOOKS */
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
