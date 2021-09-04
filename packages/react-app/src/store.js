import { configureStore } from "@reduxjs/toolkit";
import { networkReducer, userReducer } from "./actions";

export default configureStore({
  reducer: {
    user: userReducer,
    network: networkReducer,
  },
});
