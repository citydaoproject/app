import { configureStore } from "@reduxjs/toolkit";
import { networkReducer, userReducer, debugReducer } from "./actions";

export default configureStore({
  reducer: {
    user: userReducer,
    network: networkReducer,
    debug: debugReducer,
  },
});
