import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./slices";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: () => undefined;
  }
}

const devTools = window.__REDUX_DEVTOOLS_EXTENSION__
  ? window.__REDUX_DEVTOOLS_EXTENSION__()
  : undefined;

const store = configureStore({
  reducer: rootReducer,
  devTools: devTools,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
