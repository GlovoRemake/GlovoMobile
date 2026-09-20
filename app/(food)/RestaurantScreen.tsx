import React, { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Pressable,
    ScrollView,
    Text,
    View,
    useColorScheme,
} from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { useSelector } from "react-redux";

import {
    DiscountBadge,
    Price,
    RoundButton,
} from "@/components/food/ui";
import { CartBar } from "@/components/food/BottomBars";
import { PRIMARY } from "@/components/food/theme";
import type { RootState } from "@/store";

import { useGetAddressesQuery } from "@/store/service/apiAddress";
import { useGetCompaniesQuery } from "@/store/service/apiCompany";
import {
    useGetAffiliateCategoriesQuery,
    useGetAffiliateProductsQuery,
    useGetAffiliatesQuery,
} from "@/store/service/apiAffiliate";

import APP_ENV from "@/utils/env";
import {useGetCartsQuery} from "@/store/service/apiCart";

const colors = {
    light: {
        background: "#F9FAFB",
        card: "#FFFFFF",
        text: "#111827",
        secondaryText: "#6B7280",
        border: "#E5E7EB",
        icon: "#6B7280",
        placeholder: "#F1F2F4",
    },
    dark: {
        background: "#09090B",
        card: "#18181B",
        text: "#FAFAFA",
        secondaryText: "#A1A1AA",
        border: "#3F3F46",
        icon: "#A1A1AA",
        placeholder: "#27272A",
    },
};

export default function RestaurantScreen() {
    const insets = useSafeAreaInsets();
    const scheme = useColorScheme();
    const isDark = scheme === "dark";
    const theme = isDark ? colors.dark : colors.light;

    const params = useLocalSearchParams<{ companyId?: string | string[] }>();

    const companyId = Array.isArray(params.companyId)
        ? params.companyId[0]
        : params.companyId;

    const selectedAddressId = useSelector(
        (state: RootState) => state.address.selectedAddressId
    );

    /*
     * ---------------------------------------------------------
     * Address
     * ---------------------------------------------------------
     */

    const {data: carts} = useGetCartsQuery();
    const totalPrice =
        carts
            ?.find(
                (x) =>
                    String(x.company.id) ===
                    String(companyId)
            )
            ?.carts.reduce((total, cart) => {
            const productPrice = cart.product.price;

            const additionalsPrice =
                cart.additionalGroups?.reduce(
                    (groupsTotal, group) =>
                        groupsTotal +
                        (group.additionals?.reduce(
                            (sum, additional) =>
                                additional.isSelected
                                    ? sum + additional.price
                                    : sum,
                            0
                        ) ?? 0),
                    0
                ) ?? 0;

            const itemPrice =
                productPrice + additionalsPrice;

            return total + itemPrice * cart.count;
        }, 0) ?? 0;



    const {
        data: addresses = [],
        isLoading: isAddressesLoading,
    } = useGetAddressesQuery();

    const selectedAddress = useMemo(() => {
        if (!selectedAddressId) {
            return null;
        }

        return (
            addresses.find(
                (address) => address.id === selectedAddressId
            ) ?? null
        );
    }, [addresses, selectedAddressId]);

    /*
     * ---------------------------------------------------------
     * Company
     * ---------------------------------------------------------
     */

    const {
        data: companies = [],
        isLoading: isCompaniesLoading,
        isFetching: isCompaniesFetching,
    } = useGetCompaniesQuery(
        {
            regionId: selectedAddress?.city?.region?.id ?? -1,
            companyTypeIds: [],
        },
        {
            skip: !selectedAddress,
        }
    );

    const selectedCompany = useMemo(() => {
        if (!companyId) {
            return null;
        }

        return (
            companies.find(
                (company) => String(company.id) === String(companyId)
            ) ?? null
        );
    }, [companies, companyId]);

    /*
     * ---------------------------------------------------------
     * Affiliate
     * ---------------------------------------------------------
     */

    const {
        data: affiliates = [],
        isLoading: isAffiliatesLoading,
    } = useGetAffiliatesQuery(
        {
            companyId: selectedCompany?.id ?? "",
            cityId: selectedAddress?.city?.id ?? -1,
        },
        {
            skip: !selectedCompany || !selectedAddress,
        }
    );

    const affiliate = affiliates[0];

    /*
     * ---------------------------------------------------------
     * Categories
     * ---------------------------------------------------------
     */

    const {
        data: categories = [],
        isLoading: isCategoriesLoading,
    } = useGetAffiliateCategoriesQuery(
        affiliate?.id ?? "",
        {
            skip: !affiliate?.id,
        }
    );

    const [activeTab, setActiveTab] = useState<number | null>(null);

    useEffect(() => {
        const set = () => {
            if (!categories.length) {
                setActiveTab(null);
                return;
            }

            setActiveTab((current) => {
                const stillExists = categories.some(
                    (category) => category.id === current
                );

                return stillExists
                    ? current
                    : categories[0].id;
            });
        }

        set();
    }, [categories]);

    /*
     * ---------------------------------------------------------
     * Products
     * ---------------------------------------------------------
     */

    const {
        data: products = [],
        isLoading: isProductsLoading,
    } = useGetAffiliateProductsQuery(
        affiliate?.id ?? "",
        {
            skip: !affiliate?.id,
        }
    );

    const activeCategory = useMemo(() => {
        if (activeTab == null) {
            return null;
        }

        return (
            categories.find(
                (category) => category.id === activeTab
            ) ?? null
        );
    }, [categories, activeTab]);

    const visibleProducts = useMemo(() => {
        if (activeTab == null) {
            return [];
        }

        return products.filter(
            (product) => product.category?.id === activeTab
        );
    }, [products, activeTab]);

    /*
     * ---------------------------------------------------------
     * Loading
     * ---------------------------------------------------------
     */

    const isLoading =
        isAddressesLoading ||
        isCompaniesLoading ||
        isCompaniesFetching ||
        isAffiliatesLoading ||
        isCategoriesLoading ||
        isProductsLoading;

    /*
     * ---------------------------------------------------------
     * Guards
     * ---------------------------------------------------------
     */

    if (isLoading && !selectedCompany) {
        return (
            <View
                className="flex-1 items-center justify-center"
                style={{ backgroundColor: theme.background }}
            >
                <ActivityIndicator
                    size="large"
                    color={PRIMARY}
                />
            </View>
        );
    }

    if (!selectedAddress) {
        return (
            <View
                className="flex-1 items-center justify-center px-6"
                style={{ backgroundColor: theme.background }}
            >
                <Text
                    className="text-center text-lg font-bold"
                    style={{ color: theme.text }}
                >
                    Оберіть адресу доставки
                </Text>

                <Text
                    className="mt-2 text-center"
                    style={{ color: theme.secondaryText }}
                >
                    Щоб переглянути доступні ресторани, спочатку потрібно
                    вибрати адресу.
                </Text>
            </View>
        );
    }

    if (!selectedCompany) {
        return (
            <View
                className="flex-1 items-center justify-center px-6"
                style={{ backgroundColor: theme.background }}
            >
                <Text
                    className="text-center text-lg font-bold"
                    style={{ color: theme.text }}
                >
                    Ресторан не знайдено
                </Text>

                <Pressable
                    onPress={() => router.back()}
                    className="mt-4 rounded-xl px-5 py-3"
                    style={{ backgroundColor: PRIMARY }}
                >
                    <Text className="font-bold text-white">
                        Назад
                    </Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View
            className="flex-1"
            style={{ backgroundColor: theme.background }}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 100,
                }}
            >
                {/* ------------------------------------------------
                    Hero
                ------------------------------------------------ */}

                <View className="h-60">
                    {selectedCompany.bannerPath ? (
                        <Image
                            source={{
                                uri: `${APP_ENV.API_IMAGE_LARGE_URL}${selectedCompany.bannerPath}`,
                            }}
                            className="h-full w-full"
                            resizeMode="cover"
                        />
                    ) : (
                        <View
                            className="h-full w-full items-center justify-center"
                            style={{
                                backgroundColor: theme.placeholder,
                            }}
                        >
                            <Text className="text-4xl">
                                🍽️
                            </Text>
                        </View>
                    )}

                    {/* Header */}
                    <View
                        className="absolute left-5 right-5 flex-row items-center"
                        style={{
                            top: insets.top + 8,
                        }}
                    >
                        <RoundButton
                            onPress={() => router.back()}
                        >
                            <ArrowLeft
                                size={22}
                                color={theme.text}
                            />
                        </RoundButton>
                    </View>

                    {/* Logo */}
                    <View
                        className="absolute bottom-3 left-3 h-14 w-14 overflow-hidden rounded-2xl"
                        style={{
                            backgroundColor: theme.card,
                            shadowColor: "#000",
                            shadowOpacity: 0.15,
                            shadowRadius: 8,
                            shadowOffset: {
                                width: 0,
                                height: 3,
                            },
                            elevation: 5,
                        }}
                    >
                        {selectedCompany.iconPath ? (
                            <Image
                                source={{
                                    uri: `${APP_ENV.API_IMAGE_MEDIUM_URL}${selectedCompany.iconPath}`,
                                }}
                                className="h-full w-full"
                                resizeMode="cover"
                            />
                        ) : (
                            <View className="h-full w-full items-center justify-center">
                                <Text className="text-xl">
                                    🏪
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* ------------------------------------------------
                    Company info
                ------------------------------------------------ */}

                <View className="px-5 pt-5">
                    <Text
                        className="text-2xl font-extrabold"
                        style={{ color: theme.text }}
                    >
                        {selectedCompany.name}
                    </Text>

                    {!!selectedCompany.description && (
                        <Text
                            className="mt-2 text-base leading-6"
                            style={{ color: theme.secondaryText }}
                        >
                            {selectedCompany.description}
                        </Text>
                    )}
                </View>

                {/* ------------------------------------------------
                    Categories
                ------------------------------------------------ */}

                {categories.length > 0 && (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="mt-4"
                        contentContainerStyle={{
                            width: "100%",
                            paddingHorizontal: 8,
                            borderBottomWidth: 1,
                            borderBottomColor: theme.border,
                        }}
                    >
                        {categories.map((category) => {
                            const active =
                                category.id === activeTab;

                            return (
                                <Pressable
                                    key={category.id}
                                    onPress={() =>
                                        setActiveTab(category.id)
                                    }
                                    className="px-3 py-3"
                                    style={{
                                        borderBottomWidth: active
                                            ? 2
                                            : 0,
                                        borderBottomColor: theme.text,
                                    }}
                                >
                                    <Text
                                        className={`text-sm ${
                                            active
                                                ? "font-bold"
                                                : "font-medium"
                                        }`}
                                        style={{
                                            color: active
                                                ? theme.text
                                                : theme.secondaryText,
                                        }}
                                    >
                                        {category.name}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </ScrollView>
                )}

                {/* ------------------------------------------------
                    Products
                ------------------------------------------------ */}

                {activeCategory && (
                    <View className="mt-5">
                        <Text
                            className="px-5 text-2xl font-extrabold"
                            style={{ color: theme.text }}
                        >
                            {activeCategory.name}
                        </Text>

                        {isProductsLoading ? (
                            <View className="items-center py-10">
                                <ActivityIndicator
                                    color={PRIMARY}
                                />
                            </View>
                        ) : visibleProducts.length === 0 ? (
                            <View className="items-center px-5 py-10">
                                <Text className="text-4xl">
                                    🍽️
                                </Text>

                                <Text
                                    className="mt-3 text-center font-semibold"
                                    style={{
                                        color: theme.text,
                                    }}
                                >
                                    У цій категорії поки немає товарів
                                </Text>
                            </View>
                        ) : (
                            <View className="mt-2">
                                {visibleProducts.map((product) => (
                                    <ProductRow
                                        key={product.id}
                                        product={product}
                                        isDark={isDark}
                                        theme={theme}
                                        affiliateId={affiliate?.id ?? ""}
                                    />
                                ))}
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>

            {/* ------------------------------------------------
                Cart
            ------------------------------------------------ */}

            <CartBar
                total={totalPrice}
                label="Кошик"
                chevron
                onPress={() => router.push("/(main)/orders")}
            />
        </View>
    );
}

/* ================================================================
   Product Row
================================================================ */

function ProductRow({
                        product,
                        isDark,
                        theme,
                        affiliateId
                    }: {
    product: any;
    isDark: boolean;
    theme: (typeof colors)["light"] | (typeof colors)["dark"];
    affiliateId: string;
}) {
    const imageUri = product.imagePath
        ? `${APP_ENV.API_IMAGE_MEDIUM_URL}${product.imagePath}`
        : null;

    return (
        <Pressable
            onPress={() => router.push({
                pathname: `/(food)/ProductScreen`,
                params: { productId: product.id, affiliateId: affiliateId},
            })}
        >
            <View
                className="flex-row border-b px-5 py-4"
                style={{
                    borderBottomColor: theme.border,
                }}
            >
                {/* Info */}
                <View className="flex-1 justify-center pr-4">
                    <Text
                        className="text-[15px] font-bold"
                        style={{ color: theme.text }}
                    >
                        {product.name}
                    </Text>

                    {!!product.description && (
                        <Text
                            numberOfLines={2}
                            className="mt-1 text-sm"
                            style={{
                                color: theme.secondaryText,
                            }}
                        >
                            {product.description}
                        </Text>
                    )}

                    <View className="mt-2">
                        <Price value={product.price} />
                    </View>

                    {product.oldPrice &&
                        product.oldPrice > product.price && (
                            <View className="mt-1.5">
                                <DiscountBadge />
                            </View>
                        )}
                </View>

                {/* Image */}
                <View
                    className="h-28 w-28 overflow-hidden rounded-2xl"
                    style={{
                        backgroundColor: isDark
                            ? "#27272A"
                            : "#F1F2F4",
                    }}
                >
                    {imageUri ? (
                        <Image
                            source={{ uri: imageUri }}
                            className="h-full w-full"
                            resizeMode="cover"
                        />
                    ) : (
                        <View className="h-full w-full items-center justify-center">
                            <Text className="text-3xl">
                                🍽️
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </Pressable>
    );
}
