import React, {
    useMemo,
} from "react";
import {
    View,
    Text,
    ActivityIndicator,
} from "react-native";
import {
    useLocalSearchParams,
} from "expo-router";

import ProductDetail, {
    OptionGroup,
} from "@/components/food/ProductDetail";

import {
    useGetCartsQuery,
} from "@/store/service/apiCart";

import APP_ENV from "@/utils/env";

export default function EditProductScreen() {
    const {
        cartId,
        productId,
    } =
        useLocalSearchParams<{
            cartId: string;
            productId: string;
        }>();

    const {
        data: carts,
        isLoading,
    } = useGetCartsQuery();

    const cart = useMemo(() => {
        if (!carts || !cartId) {
            return undefined;
        }

        for (const company of carts) {
            const found =
                company.carts.find(
                    (item) =>
                        String(
                            item.id
                        ) ===
                        String(
                            cartId
                        )
                );

            if (found) {
                return found;
            }
        }

        return undefined;
    }, [carts, cartId]);

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-white dark:bg-black">
                <ActivityIndicator
                    size="large"
                    color="#0B6B3E"
                />
            </View>
        );
    }

    if (!cart) {
        return (
            <View className="flex-1 items-center justify-center bg-white px-5 dark:bg-black">
                <Text className="text-lg font-bold text-gray-900 dark:text-white">
                    Товар не знайдено
                </Text>
            </View>
        );
    }

    const groups: OptionGroup[] =
        cart.additionalGroups.map(
            (group) => ({
                id: group.id,

                name: group.name,

                minChoice:
                group.minChoice,

                maxChoice:
                group.maxChoice,

                additionals:
                    group.additionals.map(
                        (additional) => ({
                            id: additional.id,
                            name: additional.name,
                            price: additional.price,
                        })
                    ),
            })
        );

    const initialSelectedIds =
        cart.additionalGroups.flatMap(
            (group) =>
                group.additionals
                    .filter(
                        (additional) =>
                            additional.isSelected
                    )
                    .map(
                        (additional) =>
                            additional.id
                    )
        );

    return (
        <ProductDetail
            mode="edit"
            cartId={cart.id}
            productId={
                cart.product.id
            }
            name={
                cart.product.name
            }
            price={
                cart.product.price
            }
            description={
                cart.product
                    .description
            }
            imagePath={
                cart.product
                    .imagePath
                    ? `${APP_ENV.API_IMAGE_LARGE_URL}${cart.product.imagePath}`
                    : undefined
            }
            groups={groups}
            initialSelectedIds={
                initialSelectedIds
            }
            initialQuantity={
                cart.count
            }
        />
    );
}