import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REHYDRATE,
} from "redux-persist";
import { mmkvReduxStorage } from "@utils/storage";
import authReducer from "@store/slices/authSlice";
import ownerDashboardReducer from "@store/slices/ownerDashboardSlice";
import ownerTablesReducer from "@store/slices/ownerTablesSlice";
import reservationReducer from "@store/slices/reservationSlice";
import waiterAuthReducer from "@store/slices/waiterAuthSlice";
import ownerBillSummaryReducer from "@store/slices/ownerBillSummarySlice";

import waiterDashboardReducer from "@store/slices/waiterDashboardSlice";
import waiterTablesReducer from "@store/slices/waiterTablesSlice";
import waiterMenuReducer from "@store/slices/waiterMenuSlice";
import waiterOrderReducer from "@store/slices/waiterOrderSlice";

const persistConfig = {
  key: "auth",
  storage: mmkvReduxStorage,
  whitelist: [
    "isAuthenticated",
    "token",
    "user",
    "sessionId",
    "role",
    "ownerId",
  ],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const waiterMenuPersistConfig = {
  key: "waiterMenu",
  storage: mmkvReduxStorage,
  whitelist: [
    "filters",
    "categories"
  ],
};

const persistedWaiterMenuReducer = persistReducer(
  waiterMenuPersistConfig,
  waiterMenuReducer,
);

const rootReducer = combineReducers({
  auth: persistedAuthReducer,
  ownerDashboard: ownerDashboardReducer,
  ownerTables: ownerTablesReducer,
  reservation: reservationReducer,
  waiterAuth: waiterAuthReducer,
  ownerBillSummary: ownerBillSummaryReducer,
  waiterDashboard: waiterDashboardReducer,
  waiterTables: waiterTablesReducer,
  waiterMenu: persistedWaiterMenuReducer,
  waiterOrder: waiterOrderReducer
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
