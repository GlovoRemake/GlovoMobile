import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {IAddress} from "@/types/address/IAddress";

export interface Address {
    id: string;
    title: string;
    address: string;
    latitude?: number;
    longitude?: number;
}

interface AddressState {
    addresses: IAddress[];
    selectedAddressId: number | null;
}

const initialState: AddressState = {
    addresses: [],
    selectedAddressId: null,
};

const addressSlice = createSlice({
    name: "address",

    initialState,

    reducers: {
        setSelectedAddress: (
            state,
            action: PayloadAction<number | null>
        ) => {
            state.selectedAddressId = action.payload;
        },

        addAddress: (
            state,
            action: PayloadAction<IAddress>
        ) => {
            state.addresses.push(action.payload);
        },

        removeAddress: (
            state,
            action: PayloadAction<number>
        ) => {
            state.addresses = state.addresses.filter(
                (address) => address.id !== action.payload
            );

            if (state.selectedAddressId === action.payload) {
                state.selectedAddressId = null;
            }
        },

        clearSelectedAddress: (state) => {
            state.selectedAddressId = null;
        },
    },
});

export const {
    setSelectedAddress,
    addAddress,
    removeAddress,
    clearSelectedAddress,
} = addressSlice.actions;

export default addressSlice.reducer;