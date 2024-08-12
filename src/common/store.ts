import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { PERSIST, persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import loaderReducer from "../slice/loaderSlice";
import treeReducer from "../slice/treeSlice";
import userReducer from "../slice/userSlice";
import modalReducer from "../slice/modalSlice";

const rootReducer = combineReducers({
  user: userReducer,
  loader: loaderReducer,
  tree: treeReducer,
  modal: modalReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "loader", "tree", "modal"], // only user and loader will be persisted
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [PERSIST],
      },
    }).concat(),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

// Create a persistor linked to the store
export const persistor = persistStore(store);

export default store;
