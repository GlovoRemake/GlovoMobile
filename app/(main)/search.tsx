import React, {useState} from "react";
import {
    Image,
    Pressable,
    ScrollView,
    Text,
    View,
    useColorScheme,
} from "react-native";
import {ArrowLeft} from "lucide-react-native";
import {router} from "expo-router";
import {useSelector} from "react-redux";

import {openAddressSheet} from "@/components/address/addressSheet";
import RestaurantCard from "@/components/food/RestaurantCard";
import type {RootState} from "@/store";
import {useGetAddressesQuery} from "@/store/service/apiAddress";
import {useGetCompaniesQuery, useGetCompanyTypesQuery} from "@/store/service/apiCompany";
import APP_ENV from "@/utils/env";

const PRIMARY = "#FFC244";

const COLORS = {
    light: {
        background: "#F8F9FA",
        surface: "#FFFFFF",
        text: "#111827",
        secondary: "#6B7280",
        border: "#F1F2F4",
    },
    dark: {
        background: "#000000",
        surface: "#18181B",
        text: "#FFFFFF",
        secondary: "#A1A1AA",
        border: "#27272A",
    },
};

export default function Search() {
    const scheme = useColorScheme();
    const colors = scheme === "dark" ? COLORS.dark : COLORS.light;
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | null>(null);
    const selectedAddressId = useSelector(
        (state: RootState) => state.address.selectedAddressId
    );

    const {data: addresses = []} = useGetAddressesQuery();
    const {data: companyTypes = [], isLoading: isCompanyTypesLoading, isError: isCompanyTypesError} =
        useGetCompanyTypesQuery();
    const categories = companyTypes.filter((companyType) => companyType.parentTypeId === null);
    const selectedCategory = categories.find((category) => category.id === selectedCategoryId);
    const subcategories = selectedCategory
        ? companyTypes.filter((companyType) => companyType.parentTypeId === selectedCategory.id)
        : [];
    const companyTypeIds = selectedCategory
        ? selectedSubcategoryId !== null
            ? [selectedSubcategoryId]
            : [selectedCategory.id, ...subcategories.map((subcategory) => subcategory.id)]
        : [];
    const selectedAddress = addresses.find((address) => address.id === selectedAddressId) ?? null;

    const {
        data: companies = [],
        isLoading: isCompaniesLoading,
        isError: isCompaniesError,
    } = useGetCompaniesQuery(
        {
            regionId: selectedAddress?.city.region.id ?? -1,
            companyTypeIds,
        },
        {skip: !selectedAddress}
    );

    return (
        <View className="flex-1 pt-14" style={{backgroundColor: colors.background}}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 120}}
            >
                <View className="flex-row items-center px-5 pt-5">
                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Назад"
                        onPress={() => router.back()}
                        className="mr-4 h-10 w-10 items-center justify-center rounded-full"
                        style={{backgroundColor: colors.surface}}
                    >
                        <ArrowLeft size={21} color={colors.text}/>
                    </Pressable>
                    <Text style={{color: colors.text}} className="text-2xl font-bold">
                        Пошук закладів
                    </Text>
                </View>

                <View className="pt-7">
                    <View className="mb-4 flex-row items-center justify-between px-5">
                        <Text style={{color: colors.text}} className="text-xl font-bold">
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
                                    color: selectedCategoryId === null ? colors.secondary : PRIMARY,
                                }}
                                className="font-semibold"
                            >
                                Усі
                            </Text>
                        </Pressable>
                    </View>

                    {isCompanyTypesLoading ? (
                        <Text style={{color: colors.secondary}} className="px-5 py-3">
                            Завантаження категорій...
                        </Text>
                    ) : isCompanyTypesError ? (
                        <Text style={{color: colors.secondary}} className="px-5 py-3">
                            Не вдалося завантажити категорії.
                        </Text>
                    ) : (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{paddingHorizontal: 20}}
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
                                                    scheme === "dark" ? "#27272A" : "#F8F9FA",
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
                    )}

                    {selectedCategory && subcategories.length > 0 && (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{paddingHorizontal: 20, paddingTop: 12}}
                        >
                            <Pressable
                                onPress={() => setSelectedSubcategoryId(null)}
                                style={{
                                    backgroundColor:
                                        selectedSubcategoryId === null ? PRIMARY : colors.surface,
                                    borderColor:
                                        selectedSubcategoryId === null ? PRIMARY : colors.border,
                                }}
                                className="mr-2 rounded-full border px-4 py-2"
                            >
                                <Text
                                    style={{
                                        color: selectedSubcategoryId === null ? "#111111" : colors.text,
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
                                            style={{color: isSelected ? "#111111" : colors.text}}
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

                <View className="px-5 pt-8">
                    <Text style={{color: colors.text}} className="mb-4 text-xl font-bold">
                        Заклади
                    </Text>

                    {!selectedAddress ? (
                        <Pressable
                            onPress={openAddressSheet}
                            style={{backgroundColor: colors.surface}}
                            className="rounded-2xl p-4"
                        >
                            <Text style={{color: colors.secondary}}>
                                Оберіть адресу доставки, щоб побачити доступні заклади.
                            </Text>
                        </Pressable>
                    ) : isCompaniesLoading ? (
                        <Text style={{color: colors.secondary}}>Завантаження закладів...</Text>
                    ) : isCompaniesError ? (
                        <Text style={{color: colors.secondary}}>
                            Не вдалося завантажити заклади.
                        </Text>
                    ) : companies.length > 0 ? (
                        <View className="gap-6">
                            {companies.map((company) => (
                                <Pressable
                                    key={company.id}
                                    onPress={() =>
                                        router.push({
                                            pathname: "/(food)/RestaurantScreen",
                                            params: {companyId: company.id},
                                        })
                                    }
                                >
                                    <RestaurantCard company={company}/>
                                </Pressable>
                            ))}
                        </View>
                    ) : (
                        <Text style={{color: colors.secondary}}>
                            За вибраними фільтрами закладів не знайдено.
                        </Text>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
