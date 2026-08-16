'use client'

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { getSecureStore, saveSecureStore, deleteSecureStore } from "@/utils/secureStore"
import type {RootState} from "@/store";

interface AuthState {
    accessToken: string | null;
}

const ACCESS_TOKEN_EXPIRED_MIN = 15;
const TOKEN_EXPIRES_DAYS = 7;

const getInitialToken = (): string | null => {
    if (typeof window === "undefined") return null;
    return getSecureStore("accessToken") || null;
};

const initialState: AuthState = {
    accessToken: getInitialToken(),
};

const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers: {
        setAccessToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;

            saveSecureStore("accessToken", action.payload);
        },

        setRefreshToken: (_, action: PayloadAction<string>) => {
            saveSecureStore("refreshToken", action.payload);
        },

        logout: (state) => {
            deleteSecureStore("accessToken");
            deleteSecureStore("refreshToken");

            state.accessToken = null;
        },
    },
});

export const selectIsAuthenticated = (state: RootState) =>
    Boolean(state.auth.accessToken);

export const selectAccessToken = (state: RootState) =>
    state.auth.accessToken;

export const { setAccessToken, setRefreshToken, logout } = authSlice.actions;
export default authSlice.reducer;