import React, { useState } from "react";
import {Platform, View} from "react-native";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import AndroidTabs from "@/components/ui/custom/androidTabs";
import AddressBottomSheet, {
} from "@/components/address/AddressBottomSheet";
import { addressSheetRef } from "@/components/address/addressSheet";
import {Address} from "@/store/slices/addressSlice";
import IOSNativeTabs from "@/components/ui/custom/iosNativeTabs";
import {router} from "expo-router"

export default function TabLayout() {
    const [addresses, setAddresses] = useState<Address[]>([
        {
            id: "1",
            title: "Дім",
            address: "вул. Шевченка, 15",
        },
        {
            id: "2",
            title: "Робота",
            address: "вул. Соборна, 42",
        },
    ]);

    const [selectedAddressId, setSelectedAddressId] =
        useState<string | null>(null);

    const selectAddress = (address: Address) => {
        setSelectedAddressId(address.id);
        addressSheetRef.current?.dismiss();
    };

    const addAddress = () => {
        addressSheetRef.current?.dismiss();
        router.push("/(address)/addAddress");
    };

    if (Platform.OS === "ios") {
        return (
            <BottomSheetModalProvider>
                <View style={{ flex: 1 }}>
                    {/* Native Tabs */}
                    <IOSNativeTabs />

                    {/* Sheet знаходиться НАД Tabs */}
                    <AddressBottomSheet
                        ref={addressSheetRef}
                        onAddAddress={addAddress}
                    />
                </View>
            </BottomSheetModalProvider>
        );
    }

    return (
        <BottomSheetModalProvider>
            <View style={{ flex: 1 }}>
                {/* Native Tabs */}
                <AndroidTabs />

                {/* Sheet знаходиться НАД Tabs */}
                <AddressBottomSheet
                    ref={addressSheetRef}
                    onAddAddress={addAddress}
                />
            </View>
        </BottomSheetModalProvider>
    );
}