import { configureStore } from "@reduxjs/toolkit";
import { type TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import {apiAccount} from "@/store/service/apiAccount"
import authSlice from "@/store/slices/authSlice";
import addressReducer from "@/store/slices/addressSlice";
import {apiAddress} from "@/store/service/apiAddress";
import {apiCompany} from "@/store/service/apiCompany";
import {apiAffiliate} from "@/store/service/apiAffiliate";
import {apiCart} from "@/store/service/apiCart";

export const store = configureStore({
    reducer: {
        [apiAccount.reducerPath]: apiAccount.reducer,
        [apiAddress.reducerPath]: apiAddress.reducer,
        [apiCompany.reducerPath]: apiCompany.reducer,
        [apiAffiliate.reducerPath]: apiAffiliate.reducer,
        [apiCart.reducerPath]: apiCart.reducer,
        auth: authSlice,
        address: addressReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiAccount.middleware).concat(apiAddress.middleware).concat(apiCompany.middleware).concat(apiAffiliate.middleware).concat(apiCart.middleware),
});

// Типи, які знаходяться у Redux
export type RootState = ReturnType<typeof store.getState>;
// Метод, який дає команди для reducer - залогінь, вийди із акаунта
export type AppDispatch = typeof store.dispatch;

// виклик різних методів із глобального стора
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Отримуємо дані із глобального стора на основі типів, які там є
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;