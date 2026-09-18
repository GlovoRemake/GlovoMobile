import { router } from "expo-router";
import { ArrowLeft, Check, MapPin, Plus, Trash2 } from "lucide-react-native";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    ScrollView,
    Text,
    View,
    useColorScheme,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "@/store";
import { useDeleteAddressMutation, useGetAddressesQuery } from "@/store/service/apiAddress";
import { setSelectedAddress } from "@/store/slices/addressSlice";
import type { IAddress } from "@/types/address/IAddress";

const PRIMARY = "#FFC244";

const COLORS = {
    light: {
        background: "#F8F9FA",
        surface: "#FFFFFF",
        text: "#111827",
        secondary: "#6B7280",
        border: "#E5E7EB",
        selected: "#FFF7D6",
    },
    dark: {
        background: "#000000",
        surface: "#18181B",
        text: "#FFFFFF",
        secondary: "#A1A1AA",
        border: "#27272A",
        selected: "#3A321E",
    },
};

export default function MyAddresses() {
    const scheme = useColorScheme();
    const colors = scheme === "dark" ? COLORS.dark : COLORS.light;
    const dispatch = useDispatch();
    const selectedAddressId = useSelector(
        (state: RootState) => state.address.selectedAddressId,
    );
    const { data: addresses = [], isLoading } = useGetAddressesQuery();
    const [deleteAddress, { isLoading: isDeleting }] = useDeleteAddressMutation();

    const selectAddress = (address: IAddress) => {
        dispatch(setSelectedAddress(address.id));
        router.back();
    };

    const handleDeleteAddress = (id: number) => {
        Alert.alert("Видалити адресу?", "Цю адресу буде видалено назавжди.", [
            { text: "Скасувати", style: "cancel" },
            {
                text: "Видалити",
                style: "destructive",
                onPress: async () => {
                    try {
                        await deleteAddress(id).unwrap();
                        if (selectedAddressId === id) {
                            dispatch(setSelectedAddress(null));
                        }
                    } catch {
                        Alert.alert(
                            "Помилка",
                            "Не вдалося видалити адресу. Спробуйте ще раз.",
                        );
                    }
                },
            },
        ]);
    };

    return (
        <View className="flex-1" style={{ backgroundColor: colors.background }}>
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 58, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="mb-6 flex-row items-center">
                    <Pressable
                        onPress={() => router.back()}
                        className="mr-3 h-10 w-10 items-center justify-center rounded-full"
                        style={{ backgroundColor: colors.surface }}
                        accessibilityLabel="Назад"
                    >
                        <ArrowLeft size={21} color={colors.text} />
                    </Pressable>
                    <Text className="text-3xl font-extrabold" style={{ color: colors.text }}>
                        Мої адреси
                    </Text>
                </View>

                {isLoading ? (
                    <ActivityIndicator size="large" color={PRIMARY} className="mt-10" />
                ) : addresses.length === 0 ? (
                    <View className="items-center px-5 py-12">
                        <View className="mb-4 h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: colors.surface }}>
                            <MapPin size={28} color={colors.secondary} />
                        </View>
                        <Text className="text-center text-lg font-semibold" style={{ color: colors.text }}>
                            Адрес ще немає
                        </Text>
                        <Text className="mt-1 text-center text-sm" style={{ color: colors.secondary }}>
                            Додайте адресу, щоб замовляти доставку
                        </Text>
                    </View>
                ) : (
                    addresses.map((address) => {
                        const selected = address.id === selectedAddressId;

                        return (
                            <View key={address.id} className="mb-3 flex-row items-center rounded-2xl border p-4" style={{ backgroundColor: selected ? colors.selected : colors.surface, borderColor: selected ? PRIMARY : colors.border }}>
                                <Pressable onPress={() => selectAddress(address)} className="flex-1 flex-row items-center">
                                    <View className="mr-3 h-11 w-11 items-center justify-center rounded-full" style={{ backgroundColor: selected ? PRIMARY : scheme === "dark" ? "#27272A" : "#F3F4F6" }}>
                                        <MapPin size={21} color={selected ? "#111111" : colors.text} />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="font-semibold" style={{ color: colors.text }} numberOfLines={1}>
                                            {address.address}, {address.city.name}
                                        </Text>
                                        <Text className="mt-1 text-sm" style={{ color: colors.secondary }} numberOfLines={1}>
                                            {address.address}
                                        </Text>
                                    </View>
                                    {selected && <Check size={22} color="#111111" strokeWidth={2.5} />}
                                </Pressable>
                                <Pressable onPress={() => handleDeleteAddress(address.id)} disabled={isDeleting} className="ml-3 h-10 w-10 items-center justify-center rounded-full" style={{ backgroundColor: "#FEE2E2", opacity: isDeleting ? 0.5 : 1 }} accessibilityLabel="Видалити адресу">
                                    <Trash2 size={18} color="#EF4444" />
                                </Pressable>
                            </View>
                        );
                    })
                )}

                <Pressable
                    onPress={() => router.push("/(address)/addAddress")}
                    disabled={isDeleting}
                    className="mt-2 flex-row items-center rounded-2xl border p-4"
                    style={{ backgroundColor: colors.surface, borderColor: colors.border, opacity: isDeleting ? 0.5 : 1 }}
                >
                    <View className="mr-3 h-11 w-11 items-center justify-center rounded-full" style={{ backgroundColor: scheme === "dark" ? "#27272A" : "#FFF4D6" }}>
                        <Plus size={22} color={scheme === "dark" ? PRIMARY : "#111111"} />
                    </View>
                    <Text className="font-semibold" style={{ color: colors.text }}>Додати адресу</Text>
                </Pressable>
            </ScrollView>
        </View>
    );
}