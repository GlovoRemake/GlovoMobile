import React, {useState} from "react";

import {
    Image,
    Pressable,
    ScrollView,
    Text,
    View,
    useColorScheme,
} from "react-native";

import {
    ChevronDown,
    MapPin,
    Search,
} from "lucide-react-native";

import {router} from "expo-router";

import {
    useSelector,
} from "react-redux";

import type {
    RootState,
} from "@/store";

import {
    openAddressSheet,
} from "@/components/address/addressSheet";
import {useGetAddressesQuery} from "@/store/service/apiAddress";
import {useGetCompaniesQuery, useGetCompanyTypesQuery} from "@/store/service/apiCompany";
import RestaurantCard from "@/components/food/RestaurantCard";
import APP_ENV from "@/utils/env";

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

export default function HomeScreen() {
    const scheme = useColorScheme();
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | null>(null);

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

    const {data: addresses} = useGetAddressesQuery();
    const {data: companyTypes = []} = useGetCompanyTypesQuery();
    const categories = companyTypes.filter((companyType) => companyType.parentTypeId === null);
    const selectedCategory = categories.find((category) => category.id === selectedCategoryId);
    const subcategories = selectedCategory
        ? companyTypes.filter((companyType) => companyType.parentTypeId === selectedCategory.id)
        : [];
    const selectedCompanyTypeIds = selectedCategory
        ? selectedSubcategoryId !== null
            ? [selectedSubcategoryId]
            : [selectedCategory.id, ...subcategories.map((subcategory) => subcategory.id)]
        : [];

    const selectedAddress =
        addresses?.find(
            (address) =>
                address.id ===
                selectedAddressId
        ) ?? null;

    const {data: companies} = useGetCompaniesQuery({
        regionId: selectedAddress?.city.region.id ?? -1,
        companyTypeIds: selectedCompanyTypeIds
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

                                <Pressable
                                    onPress={() => {
                                        setSelectedCategoryId(null);
                                        setSelectedSubcategoryId(null);
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: selectedCategoryId === null
                                                ? colors.secondary
                                                : PRIMARY,
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
                                {categories.map((category) => {
                                    const isSelected = category.id === selectedCategoryId;

                                    return (
                                        <Pressable
                                            key={category.id}
                                            onPress={() => {
                                                setSelectedCategoryId((currentId) =>
                                                    currentId === category.id ? null : category.id
                                                );
                                                setSelectedSubcategoryId(null);
                                            }}
                                            style={{
                                                backgroundColor: colors.surface,
                                                borderColor: isSelected ? PRIMARY : colors.border,
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
                                                className="h-12 w-12 items-center justify-center overflow-hidden rounded-full"
                                            >
                                                {category.iconPath ? (
                                                    <Image
                                                        source={{
                                                            uri: `${APP_ENV.API_IMAGE_SMALL_URL}${category.iconPath}`,
                                                        }}
                                                        className="h-full w-full"
                                                        resizeMode="cover"
                                                    />
                                                ) : (
                                                    <Text className="text-xl">🏪</Text>
                                                )}
                                            </View>

                                            <Text
                                                style={{color: colors.text}}
                                                numberOfLines={1}
                                                className="mt-2 text-xs font-semibold"
                                            >
                                                {category.name}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </ScrollView>

                            {selectedCategory && subcategories.length > 0 && (
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{
                                        paddingHorizontal: 20,
                                        paddingTop: 12,
                                    }}
                                >
                                    <Pressable
                                        onPress={() => setSelectedSubcategoryId(null)}
                                        style={{
                                            backgroundColor: selectedSubcategoryId === null
                                                ? PRIMARY
                                                : colors.surface,
                                            borderColor: selectedSubcategoryId === null
                                                ? PRIMARY
                                                : colors.border,
                                        }}
                                        className="mr-2 rounded-full border px-4 py-2"
                                    >
                                        <Text
                                            style={{
                                                color: selectedSubcategoryId === null
                                                    ? "#111111"
                                                    : colors.text,
                                            }}
                                            className="text-sm font-semibold"
                                        >
                                            Усі
                                        </Text>
                                    </Pressable>

                                    {subcategories.map((subcategory) => {
                                        const isSelected = subcategory.id === selectedSubcategoryId;

                                        return (
                                            <Pressable
                                                key={subcategory.id}
                                                onPress={() => setSelectedSubcategoryId(subcategory.id)}
                                                style={{
                                                    backgroundColor: isSelected ? PRIMARY : colors.surface,
                                                    borderColor: isSelected ? PRIMARY : colors.border,
                                                }}
                                                className="mr-2 rounded-full border px-4 py-2"
                                            >
                                                <Text
                                                    style={{
                                                        color: isSelected ? "#111111" : colors.text,
                                                    }}
                                                    className="text-sm font-semibold"
                                                >
                                                    {subcategory.name}
                                                </Text>
                                            </Pressable>
                                        );
                                    })}
                                </ScrollView>
                            )}
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