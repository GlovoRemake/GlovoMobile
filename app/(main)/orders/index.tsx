import React from "react";
import {
    View,
    Text,
    ScrollView,
    Pressable,
    Image,
} from "react-native";
import { router } from "expo-router";
import { useGetCartsQuery } from "@/store/service/apiCart";
import APP_ENV from "@/utils/env";
import { money } from "@/components/food/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
    const insets = useSafeAreaInsets();

    const {
        data: carts,
        isLoading,
        isFetching,
    } = useGetCartsQuery();

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-white dark:bg-black">
                <Text className="text-gray-500 dark:text-gray-400">
                    Завантаження...
                </Text>
            </View>
        );
    }

    if (!carts || carts.length === 0) {
        return (
            <View
                className="flex-1 items-center justify-center bg-white px-5 dark:bg-black"
                style={{
                    paddingTop: insets.top,
                }}
            >
                <Text className="text-2xl font-extrabold text-gray-900 dark:text-white">
                    Кошик порожній
                </Text>

                <Text className="mt-2 text-center text-gray-500 dark:text-gray-400">
                    Додайте товари з ресторанів,
                    щоб вони з&#39;явилися тут
                </Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white dark:bg-black">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingTop: insets.top + 16,
                    paddingBottom: insets.bottom + 24,
                }}
            >
                <Text className="px-5 text-3xl font-extrabold text-gray-900 dark:text-white">
                    Кошик
                </Text>

                <View className="mt-5">
                    {carts.map((companyCart) => {
                        const totalCount =
                            companyCart.carts.reduce(
                                (sum, cart) =>
                                    sum + cart.count,
                                0
                            );

                        const totalPrice =
                            companyCart.carts.reduce(
                                (total, cart) => {
                                    const productPrice =
                                        cart.product.price;

                                    const additionalsPrice =
                                        cart.additionalGroups?.reduce(
                                            (
                                                groupTotal,
                                                group
                                            ) =>
                                                groupTotal +
                                                (group.additionals?.reduce(
                                                    (
                                                        sum,
                                                        additional
                                                    ) =>
                                                        additional.isSelected
                                                            ? sum +
                                                            additional.price
                                                            : sum,
                                                    0
                                                ) ?? 0),
                                            0
                                        ) ?? 0;

                                    return (
                                        total +
                                        (productPrice +
                                            additionalsPrice) *
                                        cart.count
                                    );
                                },
                                0
                            );

                        return (
                            <Pressable
                                key={companyCart.company.id}
                                onPress={() =>
                                    router.push({
                                        pathname:
                                            "/(orders)/cart/company",
                                        params: {
                                            companyId:
                                            companyCart
                                                .company
                                                .id,
                                        },
                                    })
                                }
                                className="mx-5 mb-4 overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-zinc-800 dark:bg-zinc-900"
                            >
                                {/* Company */}

                                <View className="flex-row items-center p-4">
                                    <View className="h-14 w-14 overflow-hidden rounded-xl bg-gray-100 dark:bg-zinc-800">
                                        {companyCart.company
                                            .iconPath ? (
                                            <Image
                                                source={{
                                                    uri: `${APP_ENV.API_IMAGE_MEDIUM_URL}${companyCart.company.iconPath}`,
                                                }}
                                                className="h-full w-full"
                                                resizeMode="cover"
                                            />
                                        ) : (
                                            <View className="h-full w-full items-center justify-center">
                                                <Text className="text-2xl">
                                                    🏪
                                                </Text>
                                            </View>
                                        )}
                                    </View>

                                    <View className="ml-3 flex-1">
                                        <Text className="text-lg font-extrabold text-gray-900 dark:text-white">
                                            {
                                                companyCart
                                                    .company
                                                    .name
                                            }
                                        </Text>

                                        <Text className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            {totalCount}{" "}
                                            {getProductWord(
                                                totalCount
                                            )}
                                        </Text>
                                    </View>

                                    <Text className="text-base font-bold text-gray-900 dark:text-white">
                                        {money(
                                            totalPrice
                                        )}
                                    </Text>
                                </View>

                                {/* Products preview */}

                                <View className="border-t border-gray-100 px-4 py-3 dark:border-zinc-800">
                                    {companyCart.carts
                                        .slice(0, 3)
                                        .map((cart, index) => (
                                            <View
                                                key={`${index}-${getCartKey(
                                                    cart
                                                )}`}
                                                className="flex-row items-center py-2"
                                            >
                                                <View className="h-12 w-12 overflow-hidden rounded-lg bg-gray-100 dark:bg-zinc-800">
                                                    {cart.product
                                                        .imagePath ? (
                                                        <Image
                                                            source={{
                                                                uri: `${APP_ENV.API_IMAGE_MEDIUM_URL}${cart.product.imagePath}`,
                                                            }}
                                                            className="h-full w-full"
                                                            resizeMode="cover"
                                                        />
                                                    ) : (
                                                        <View className="h-full w-full items-center justify-center">
                                                            <Text>
                                                                🍽️
                                                            </Text>
                                                        </View>
                                                    )}
                                                </View>

                                                <View className="ml-3 flex-1">
                                                    <Text
                                                        numberOfLines={
                                                            1
                                                        }
                                                        className="font-semibold text-gray-900 dark:text-white"
                                                    >
                                                        {
                                                            cart
                                                                .product
                                                                .name
                                                        }
                                                    </Text>

                                                    <Text className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                                                        ×{" "}
                                                        {
                                                            cart.count
                                                        }
                                                    </Text>
                                                </View>
                                            </View>
                                        ))}

                                    {companyCart.carts
                                        .length > 3 && (
                                        <Text className="mt-1 text-sm font-semibold text-gray-500 dark:text-gray-400">
                                            Ще{" "}
                                            {companyCart
                                                    .carts
                                                    .length -
                                                3}{" "}
                                            товарів
                                        </Text>
                                    )}
                                </View>
                            </Pressable>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
}

function getProductWord(count: number) {
    if (count === 1) {
        return "товар";
    }

    if (
        count >= 2 &&
        count <= 4
    ) {
        return "товари";
    }

    return "товарів";
}

function getCartKey(cart: any) {
    return cart.additionalGroups
        ?.flatMap(
            (group: any) =>
                group.additionals
                    ?.filter(
                        (additional: any) =>
                            additional.isSelected
                    )
                    .map(
                        (additional: any) =>
                            additional.id
                    ) ?? []
        )
        .sort()
        .join("-");
}