import React, { forwardRef } from "react";
import {
    Alert,
    Pressable,
    Text,
    View,
    useColorScheme,
} from "react-native";

import {
    BottomSheetBackdrop,
    BottomSheetFlatList,
    BottomSheetModal,
} from "@gorhom/bottom-sheet";

import { Swipeable } from "react-native-gesture-handler";

import {
    Check,
    MapPin,
    Plus,
    Trash2,
} from "lucide-react-native";

import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "@/store";

import {
    setSelectedAddress,
} from "@/store/slices/addressSlice";

import { useGetAddressesQuery, useDeleteAddressMutation } from "@/store/service/apiAddress";

import type { IAddress } from "@/types/address/IAddress";

interface Props {
    onAddAddress: () => void;
}

interface AddressRowProps {
    item: IAddress;
    selected: boolean;
    colors: typeof COLORS.light;
    scheme: "light" | "dark" | null | undefined | "unspecified";
    onSelect: (address: IAddress) => void;
    onDelete: (id: number) => void;
}

const PRIMARY = "#FFC244";

const COLORS = {
    light: {
        sheet: "#FFFFFF",
        text: "#111827",
        secondary: "#6B7280",
        border: "#E5E7EB",
        selected: "#FFF7D6",
    },

    dark: {
        sheet: "#18181B",
        text: "#FFFFFF",
        secondary: "#A1A1AA",
        border: "#27272A",
        selected: "#3A321E",
    },
};




const AddressRow = ({
                        item,
                        selected,
                        colors,
                        scheme,
                        onSelect,
                        onDelete,
                    }: AddressRowProps) => {
    const renderRightActions = () => {
        return (
            <Pressable
                onPress={() => onDelete(item.id)}
                className="mb-3 ml-2 w-[76px] items-center justify-center rounded-2xl"
                style={{
                    backgroundColor: "#EF4444",
                }}
            >
                <Trash2
                    size={22}
                    color="#FFFFFF"
                    strokeWidth={2.2}
                />

                <Text
                    className="mt-1 text-xs font-semibold"
                    style={{
                        color: "#FFFFFF",
                    }}
                >
                    Видалити
                </Text>
            </Pressable>
        );
    };

    return (
        <Swipeable
            renderRightActions={renderRightActions}
            overshootRight={false}
            friction={2}
            rightThreshold={40}
            containerStyle={{
                overflow: "hidden",
                borderRadius: 16,
            }}
        >
            <Pressable
                onPress={() => onSelect(item)}
                style={{
                    backgroundColor: selected
                        ? colors.selected
                        : colors.sheet,

                    borderColor: selected
                        ? PRIMARY
                        : colors.border,
                }}
                className="mb-3 flex-row items-center rounded-2xl border p-4"
            >
                {/* Icon */}
                <View
                    style={{
                        backgroundColor: selected
                            ? PRIMARY
                            : scheme === "dark"
                                ? "#27272A"
                                : "#F3F4F6",
                    }}
                    className="mr-3 h-11 w-11 items-center justify-center rounded-full"
                >
                    <MapPin
                        size={21}
                        color={
                            selected
                                ? "#111111"
                                : colors.text
                        }
                    />
                </View>

                {/* Address information */}
                <View className="flex-1">
                    <Text
                        style={{
                            color: colors.text,
                        }}
                        className="font-semibold"
                        numberOfLines={1}
                    >
                        {item.address}, {item.city.name}
                    </Text>

                    <Text
                        style={{
                            color: colors.secondary,
                        }}
                        numberOfLines={1}
                        className="mt-1 text-sm"
                    >
                        {item.address}
                    </Text>
                </View>

                {/* Selected */}
                {selected && (
                    <View className="ml-3">
                        <Check
                            size={22}
                            color="#111111"
                            strokeWidth={2.5}
                        />
                    </View>
                )}
            </Pressable>
        </Swipeable>
    );
};

const AddressBottomSheet = forwardRef<
    BottomSheetModal,
    Props
>(({ onAddAddress }, ref) => {
    const scheme = useColorScheme();

    const colors =
        scheme === "dark"
            ? COLORS.dark
            : COLORS.light;

    const dispatch = useDispatch();

    const {
        data: addresses,
        isLoading,
    } = useGetAddressesQuery();

    const [
        deleteAddress,
        {
            isLoading: isDeleting,
        },
    ] = useDeleteAddressMutation();

    const selectedAddressId = useSelector(
        (state: RootState) =>
            state.address.selectedAddressId
    );

    /**
     * Закриття BottomSheet.
     */
    const closeSheet = () => {
        if (
            ref &&
            "current" in ref
        ) {
            ref.current?.dismiss();
        }
    };

    /**
     * Вибір адреси.
     */
    const selectAddress = (
        address: IAddress
    ) => {
        dispatch(
            setSelectedAddress(address.id)
        );

        closeSheet();
    };

    /**
     * Видалення адреси.
     */
    const handleDeleteAddress = (
        id: number
    ) => {
        Alert.alert(
            "Видалити адресу?",
            "Цю адресу буде видалено назавжди.",
            [
                {
                    text: "Скасувати",
                    style: "cancel",
                },
                {
                    text: "Видалити",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteAddress(
                                id
                            ).unwrap();

                            if (
                                selectedAddressId ===
                                id
                            ) {
                                dispatch(
                                    setSelectedAddress(null)
                                );
                            }
                        } catch (error) {
                            console.error(
                                "Failed to delete address:",
                                error
                            );

                            Alert.alert(
                                "Помилка",
                                "Не вдалося видалити адресу. Спробуйте ще раз."
                            );
                        }
                    },
                },
            ]
        );
    };

    return (
        <BottomSheetModal
            ref={ref}
            snapPoints={[
                "45%",
                "75%",
            ]}
            index={0}
            enablePanDownToClose
            backgroundStyle={{
                backgroundColor:
                colors.sheet,

                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
            }}
            handleIndicatorStyle={{
                width: 40,

                backgroundColor:
                    scheme === "dark"
                        ? "#52525B"
                        : "#D1D5DB",
            }}
            backdropComponent={(props) => (
                <BottomSheetBackdrop
                    {...props}
                    appearsOnIndex={0}
                    disappearsOnIndex={-1}
                    opacity={0.45}
                />
            )}
        >
            {/* Header */}
            <View className="px-5 pb-2">
                <Text
                    style={{
                        color: colors.text,
                    }}
                    className="text-2xl font-bold"
                >
                    Куди доставити?
                </Text>

                <Text
                    style={{
                        color:
                        colors.secondary,
                    }}
                    className="mt-1 text-sm"
                >
                    Оберіть адресу доставки
                </Text>
            </View>

            {/* Addresses */}
            <BottomSheetFlatList
                data={addresses ?? []}
                keyExtractor={(item) =>
                    item.id.toString()
                }
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingTop: 12,
                    paddingBottom: 30,
                }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                    const selected =
                        item.id ===
                        selectedAddressId;

                    return (
                        <AddressRow
                            item={item}
                            selected={
                                selected
                            }
                            colors={colors}
                            scheme={scheme}
                            onSelect={
                                selectAddress
                            }
                            onDelete={
                                handleDeleteAddress
                            }
                        />
                    );
                }}
                ListEmptyComponent={
                    !isLoading ? (
                        <View className="items-center px-5 py-10">
                            <View
                                style={{
                                    backgroundColor:
                                        scheme ===
                                        "dark"
                                            ? "#27272A"
                                            : "#F3F4F6",
                                }}
                                className="mb-4 h-16 w-16 items-center justify-center rounded-full"
                            >
                                <MapPin
                                    size={28}
                                    color={
                                        colors.secondary
                                    }
                                />
                            </View>

                            <Text
                                style={{
                                    color:
                                    colors.text,
                                }}
                                className="text-center text-lg font-semibold"
                            >
                                Адрес ще немає
                            </Text>

                            <Text
                                style={{
                                    color:
                                    colors.secondary,
                                }}
                                className="mt-1 text-center text-sm"
                            >
                                Додайте адресу,
                                щоб замовляти
                                доставку
                            </Text>
                        </View>
                    ) : null
                }
                ListFooterComponent={
                    <Pressable
                        onPress={
                            onAddAddress
                        }
                        disabled={
                            isDeleting
                        }
                        style={{
                            borderColor:
                            colors.border,
                            opacity:
                                isDeleting
                                    ? 0.5
                                    : 1,
                        }}
                        className="flex-row items-center rounded-2xl border p-4"
                    >
                        <View
                            style={{
                                backgroundColor:
                                    scheme ===
                                    "dark"
                                        ? "#27272A"
                                        : "#FFF4D6",
                            }}
                            className="mr-3 h-11 w-11 items-center justify-center rounded-full"
                        >
                            <Plus
                                size={22}
                                color={
                                    scheme ===
                                    "dark"
                                        ? PRIMARY
                                        : "#111111"
                                }
                            />
                        </View>

                        <Text
                            style={{
                                color:
                                colors.text,
                            }}
                            className="font-semibold"
                        >
                            Додати адресу
                        </Text>
                    </Pressable>
                }
            />
        </BottomSheetModal>
    );
});

AddressBottomSheet.displayName =
    "AddressBottomSheet";

export default AddressBottomSheet;