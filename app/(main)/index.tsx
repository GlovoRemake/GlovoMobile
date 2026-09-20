import React from "react";

import {
    Pressable,
    ScrollView,
    Text,
    View,
    useColorScheme,
} from "react-native";

import {
    ChevronDown,
    Clock3,
    MapPin,
    Search,
    ShoppingBag,
    Sparkles,
} from "lucide-react-native";

import {router} from "expo-router";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import type {
    RootState,
} from "@/store";

import {
    openAddressSheet,
} from "@/components/address/addressSheet";
import {useGetAddressesQuery} from "@/store/service/apiAddress";
import {useGetCompaniesQuery} from "@/store/service/apiCompany";
import RestaurantCard from "@/components/food/RestaurantCard";

const PRIMARY = "#FFC244";

const COLORS = {
    light: {
        background: "#F8F9FA",
        surface: "#FFFFFF",
        text: "#111827",
        secondary: "#6B7280",
        muted: "#9CA3AF",
        border: "#F1F2F4",
    },

    dark: {
        background: "#000000",
        surface: "#18181B",
        text: "#FFFFFF",
        secondary: "#A1A1AA",
        muted: "#71717A",
        border: "#27272A",
    },
};

const categories = [
    {
        id: "food",
        title: "Їжа",
        icon: "🍔",
    },
    {
        id: "groceries",
        title: "Продукти",
        icon: "🛒",
    },
    {
        id: "pharmacy",
        title: "Аптека",
        icon: "💊",
    },
    {
        id: "shops",
        title: "Магазини",
        icon: "🛍️",
    },
    {
        id: "flowers",
        title: "Квіти",
        icon: "🌸",
    },
    {
        id: "more",
        title: "Ще",
        icon: "•••",
    },
];

export default function HomeScreen() {
    const scheme = useColorScheme();


    const colors =
        scheme === "dark"
            ? COLORS.dark
            : COLORS.light;

    const selectedAddressId =
        useSelector(
            (state: RootState) =>
                state.address
                    .selectedAddressId
        );

    const {data: addresses, isLoading} = useGetAddressesQuery();

    const selectedAddress =
        addresses?.find(
            (address) =>
                address.id ===
                selectedAddressId
        ) ?? null;

    const {data: companies, isLoading: isCompaniesLoading, isFetching} = useGetCompaniesQuery({
        regionId: selectedAddress?.city.region.id ?? -1,
        companyTypeIds: []
    }, {
        skip: !selectedAddress,
    });

    // @ts-ignore
    return (
        <View
            className={"pt-14"}
            style={{
                flex: 1,
                backgroundColor:
                colors.background,
            }}
        >
            <ScrollView
                showsVerticalScrollIndicator={
                    false
                }
                contentContainerStyle={{
                    paddingBottom: 120,
                }}
            >
                {/* HEADER */}

                <View className="px-5 pt-5">
                    <Pressable
                        onPress={
                            openAddressSheet
                        }
                        className="flex-row items-center"
                    >
                        <View
                            style={{
                                backgroundColor:
                                    scheme ===
                                    "dark"
                                        ? "#3A321E"
                                        : "#FFF4D6",
                            }}
                            className="h-11 w-11 items-center justify-center rounded-full"
                        >
                            <MapPin
                                size={21}
                                color={
                                    PRIMARY
                                }
                                strokeWidth={
                                    2.5
                                }
                            />
                        </View>

                        <View className="ml-3 flex-1">
                            <Text
                                style={{
                                    color:
                                    colors.secondary,
                                }}
                                className="text-xs"
                            >
                                Доставити сюди
                            </Text>

                            <Text
                                style={{
                                    color:
                                    colors.text,
                                }}
                                numberOfLines={1}
                                className="mt-0.5 text-base font-bold"
                            >
                                {selectedAddress
                                    ? selectedAddress.address
                                    : "Оберіть адресу"}
                            </Text>
                        </View>

                        <ChevronDown
                            size={21}
                            color={
                                colors.text
                            }
                            strokeWidth={2}
                        />
                    </Pressable>
                </View>

                {/* NO ADDRESS */}

                {!selectedAddress ? (
                    <View className={"flex justify-center items-center"}>
                        <View className="px-5 pt-6 w-full">
                            <Pressable
                                onPress={
                                    openAddressSheet
                                }
                                style={{
                                    backgroundColor:
                                    colors.surface,
                                    borderColor:
                                    colors.border,
                                }}
                                className="rounded-3xl border p-5"
                            >
                                <View className="flex-row items-center">
                                    <View
                                        style={{
                                            backgroundColor:
                                            PRIMARY,
                                        }}
                                        className="h-12 w-12 items-center justify-center rounded-2xl"
                                    >
                                        <MapPin
                                            size={23}
                                            color="#111111"
                                            strokeWidth={
                                                2.5
                                            }
                                        />
                                    </View>

                                    <View className="ml-4 flex-1">
                                        <Text
                                            style={{
                                                color:
                                                colors.text,
                                            }}
                                            className="text-base font-bold"
                                        >
                                            Куди
                                            доставити?
                                        </Text>

                                        <Text
                                            style={{
                                                color:
                                                colors.secondary,
                                            }}
                                            className="mt-1 text-sm"
                                        >
                                            Оберіть
                                            адресу,
                                            щоб
                                            побачити
                                            доступні
                                            заклади
                                        </Text>
                                    </View>
                                </View>

                                <View
                                    style={{
                                        backgroundColor:
                                        PRIMARY,
                                    }}
                                    className="mt-4 h-12 items-center justify-center rounded-2xl"
                                >
                                    <Text className="font-bold text-[#111111]">
                                        Обрати адресу
                                    </Text>
                                </View>
                            </Pressable>
                        </View>
                    </View>
                ) : (
                    <>

                        {/* SEARCH */}

                        <View className="px-5 pt-6">
                            <Pressable
                                style={{
                                    backgroundColor:
                                    colors.surface,
                                    borderColor:
                                    colors.border,
                                }}
                                onPress={() => router.push("/(main)/search")}
                                className="h-14 flex-row items-center rounded-2xl border px-4"
                            >
                                <Search
                                    size={21}
                                    color={
                                        colors.secondary
                                    }
                                />

                                <Text
                                    style={{
                                        color:
                                        colors.secondary,
                                    }}
                                    className="ml-3 text-base"
                                >
                                    Пошук закладів або
                                    страв
                                </Text>
                            </Pressable>
                        </View>

                        {/* CATEGORIES */}

                        <View className="pt-7">
                            <View className="mb-4 flex-row items-center justify-between px-5">
                                <Text
                                    style={{
                                        color:
                                        colors.text,
                                    }}
                                    className="text-xl font-bold"
                                >
                                    Категорії
                                </Text>

                                <Pressable>
                                    <Text
                                        style={{
                                            color:
                                            PRIMARY,
                                        }}
                                        className="font-semibold"
                                    >
                                        Усі
                                    </Text>
                                </Pressable>
                            </View>

                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={
                                    false
                                }
                                contentContainerStyle={{
                                    paddingHorizontal: 20,
                                }}
                            >
                                {categories.map(
                                    (category) => (
                                        <Pressable
                                            key={
                                                category.id
                                            }
                                            style={{
                                                backgroundColor:
                                                colors.surface,
                                                borderColor:
                                                colors.border,
                                            }}
                                            className="mr-3 w-[82px] items-center rounded-2xl border py-4"
                                        >
                                            <View
                                                style={{
                                                    backgroundColor:
                                                        scheme ===
                                                        "dark"
                                                            ? "#27272A"
                                                            : "#F8F9FA",
                                                }}
                                                className="h-12 w-12 items-center justify-center rounded-full"
                                            >
                                                <Text className="text-2xl">
                                                    {
                                                        category.icon
                                                    }
                                                </Text>
                                            </View>

                                            <Text
                                                style={{
                                                    color:
                                                    colors.text,
                                                }}
                                                numberOfLines={
                                                    1
                                                }
                                                className="mt-2 text-xs font-semibold"
                                            >
                                                {
                                                    category.title
                                                }
                                            </Text>
                                        </Pressable>
                                    )
                                )}
                            </ScrollView>
                        </View>

                        {companies && companies.length > 0 && (
                            <View className="px-5 pt-8">
                                <View className="mb-4 flex-row items-center justify-between">
                                    <View>
                                        <Text
                                            style={{ color: colors.text }}
                                            className="text-xl font-bold"
                                        >
                                            Заклади
                                        </Text>
                                    </View>
                                </View>

                                <View className="gap-6">
                                    {companies.map((company) => (
                                        <Pressable
                                            key={company.id}
                                            onPress={() => router.push({
                                                pathname: `/(food)/RestaurantScreen`,
                                                params: { companyId: company.id }
                                            })}
                                        >
                                            <RestaurantCard company={company} />
                                        </Pressable>

                                    ))}
                                </View>
                            </View>
                        )}
                    </>
                )}
            </ScrollView>
        </View>
    );
}