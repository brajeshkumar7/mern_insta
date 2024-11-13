import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import postSlice from "./postSlice";
import globalSlice from "./globalSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  post: postSlice,
  global: globalSlice,
});

export default rootReducer;
