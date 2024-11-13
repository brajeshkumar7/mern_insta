import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, User } from "../types/auth";

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: {
    _id: null,
    name: null,
    email: null,
    roles: [],
  },
};

interface SetAuthDataPayload {
  accessToken: string;
  refreshToken: string;
  user: User | null;
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData: (state, action: PayloadAction<SetAuthDataPayload>) => {
      const { accessToken, refreshToken, user } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.user = user;
    },
    clearAuthData: (state) => {
      state.user = initialState.user;
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
});

export const { setAuthData, clearAuthData } = authSlice.actions;
export default authSlice.reducer;
