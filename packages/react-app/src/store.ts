import { configureStore } from "@reduxjs/toolkit";
import { networkReducer, userReducer, debugReducer, parcelsReducer } from "./actions";

const store = configureStore({
  reducer: {
    user: userReducer,
    network: networkReducer,
    debug: debugReducer,
    parcels: parcelsReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
