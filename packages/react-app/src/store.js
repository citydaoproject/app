import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./actions";

export default configureStore({
  reducer: {
    user: userReducer,
  },
});
