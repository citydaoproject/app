import { configureStore } from "@reduxjs/toolkit";
import { Reducer } from "redux";
import { networkReducer, userReducer, debugReducer } from "./actions";

const store = configureStore({
  reducer: {
    user: userReducer,
    network: networkReducer,
    debug: debugReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
