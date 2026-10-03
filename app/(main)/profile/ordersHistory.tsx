import { router } from "expo-router";
import {
    ActivityIndicator,
    FlatList,
    Image,
    Pressable,
    RefreshControl,
    Text,
    View,
    useColorScheme,
} from "react-native";
import { useState } from "react";

import {
    ArrowLeft,
    ChevronDown,
    ChevronUp,
    Package,
    RefreshCw,
} from "lucide-react-native";

import {
    useOrderHistoryQuery,
} from "@/store/service/apiOrder";

import {
    useGetAffiliateProductsQuery,
} from "@/store/service/apiAffiliate";

import APP_ENV from "@/utils/env";

import { IOrder } from "@/types/Order/IOrder";

const PRIMARY = "#FFC244";

const COLORS = {
    light: {
        background: "#F8F9FA",
        surface: "#FFFFFF",
        surface2: "#F1F1F3",
        text: "#111827",
        secondary: "#6B7280",
        border: "#E5E7EB",
        green: "#22C55E",
    },

    dark: {
        background: "#09090B",
        surface: "#18181B",
        surface2: "#27272A",
        text: "#FFFFFF",
        secondary: "#A1A1AA",
        border: "#27272A",
        green: "#22C55E",
    },
};

export default function OrdersHistory() {
    const scheme = useColorScheme();

    const colors =
        scheme === "dark"
            ? COLORS.dark
            : COLORS.light;

    const {
        data: orders = [],
        isLoading,
        isFetching,
        refetch,
    } = useOrderHistoryQuery();

    const [refreshing, setRefreshing] =
        useState(false);

    const onRefresh = async () => {
        setRefreshing(true);

        try {
            await refetch();
        } finally {
            setRefreshing(false);
        }
    };

    /*
     * =========================
     * LOADING
     * =========================
     */

    if (isLoading) {
        return (
            <View
                className="flex-1"
                style={{
                    backgroundColor:
                    colors.background,
                }}
            >
                <View
                    className="flex-row items-center px-5"
                    style={{
                        paddingTop: 58,
                    }}
                >
                    <Pressable
                        onPress={() => router.back()}
                        className="mr-3 h-10 w-10 items-center justify-center rounded-full"
                        style={{
                            backgroundColor:
                            colors.surface,
                        }}
                    >
                        <ArrowLeft
                            size={21}
                            color={colors.text}
                        />
                    </Pressable>

                    <Text
                        className="text-3xl font-extrabold"
                        style={{
                            color: colors.text,
                        }}
                    >
                        Історія замовлень
                    </Text>
                </View>

                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator
                        size="large"
                        color={PRIMARY}
                    />

                    <Text
                        className="mt-3 text-sm"
                        style={{
                            color:
                            colors.secondary,
                        }}
                    >
                        Завантаження замовлень...
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View
            className="flex-1"
            style={{
                backgroundColor:
                colors.background,
            }}
        >
            <FlatList
                data={orders}
                keyExtractor={(item) =>
                    String(item.id)
                }
                showsVerticalScrollIndicator={
                    false
                }

                alwaysBounceVertical
                bounces
                overScrollMode="always"

                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingTop: 58,
                    paddingBottom: 100,
                    flexGrow: 1,
                }}

                /*
                 * =========================
                 * PULL TO REFRESH
                 * =========================
                 */

                refreshControl={
                    <RefreshControl
                        refreshing={
                            refreshing ||
                            (isFetching &&
                                !isLoading)
                        }
                        onRefresh={onRefresh}
                        tintColor={PRIMARY}
                        colors={[PRIMARY]}
                        progressBackgroundColor={
                            colors.surface
                        }
                    />
                }

                /*
                 * =========================
                 * HEADER
                 * =========================
                 */

                ListHeaderComponent={
                    <View className="mb-6 flex-row items-center">
                        <Pressable
                            onPress={() =>
                                router.back()
                            }
                            className="mr-3 h-10 w-10 items-center justify-center rounded-full"
                            style={{
                                backgroundColor:
                                colors.surface,
                            }}
                            accessibilityLabel="Назад"
                        >
                            <ArrowLeft
                                size={21}
                                color={
                                    colors.text
                                }
                            />
                        </Pressable>

                        <View className="flex-1">
                            <Text
                                className="text-3xl font-extrabold"
                                style={{
                                    color:
                                    colors.text,
                                }}
                            >
                                Історія замовлень
                            </Text>

                            {isFetching &&
                                !refreshing && (
                                    <View className="mt-1 flex-row items-center">
                                        <RefreshCw
                                            size={12}
                                            color={
                                                PRIMARY
                                            }
                                        />

                                        <Text
                                            className="ml-1 text-xs"
                                            style={{
                                                color:
                                                colors.secondary,
                                            }}
                                        >
                                            Оновлення...
                                        </Text>
                                    </View>
                                )}
                        </View>
                    </View>
                }

                /*
                 * =========================
                 * EMPTY
                 * =========================
                 */

                ListEmptyComponent={
                    <View className="flex-1 items-center justify-center px-5 py-20">
                        <View
                            className="mb-4 h-16 w-16 items-center justify-center rounded-full"
                            style={{
                                backgroundColor:
                                colors.surface,
                            }}
                        >
                            <Package
                                size={28}
                                color={
                                    colors.secondary
                                }
                            />
                        </View>

                        <Text
                            className="text-center text-lg font-semibold"
                            style={{
                                color:
                                colors.text,
                            }}
                        >
                            Замовлень ще немає
                        </Text>

                        <Text
                            className="mt-1 text-center text-sm"
                            style={{
                                color:
                                colors.secondary,
                            }}
                        >
                            Тут з&#39;явиться історія
                            ваших замовлень
                        </Text>
                    </View>
                }

                renderItem={({ item }) => (
                    <OrderHistoryCard
                        order={item}
                        colors={colors}
                    />
                )}
            />
        </View>
    );
}

/*
 * =========================
 * ORDER CARD
 * =========================
 */

function OrderHistoryCard({
                              order,
                              colors,
                          }: {
    order: IOrder;
    colors:
        | typeof COLORS.light
        | typeof COLORS.dark;
}) {
    const [expanded, setExpanded] =
        useState(false);

    /*
     * Тягнемо товари affiliate'а так само,
     * як у твоєму ActiveOrders.
     */
    const {
        data: affiliateProducts = [],
        isLoading: productsLoading,
    } = useGetAffiliateProductsQuery(
        order.affiliate.id
    );

    return (
        <View
            className="mb-3 overflow-hidden rounded-[22px] border"
            style={{
                backgroundColor:
                colors.surface,
                borderColor: colors.border,
            }}
        >
            <Pressable
                onPress={() =>
                    setExpanded(
                        (value) => !value
                    )
                }
                className="p-4"
            >
                <View className="flex-row items-center">
                    <View
                        className="h-12 w-12 items-center justify-center rounded-[16px]"
                        style={{
                            backgroundColor:
                            colors.surface2,
                        }}
                    >
                        {order.company
                            ?.iconPath ? (
                            <Image
                                source={{
                                    uri:
                                        APP_ENV
                                            .API_IMAGE_MEDIUM_URL +
                                        order.company
                                            .iconPath,
                                }}
                                className="h-12 w-12 rounded-[16px]"
                            />
                        ) : (
                            <Package
                                size={22}
                                color={
                                    colors.green
                                }
                            />
                        )}
                    </View>

                    <View className="ml-3 flex-1">
                        <Text
                            className="text-[15px] font-extrabold"
                            style={{
                                color:
                                colors.text,
                            }}
                            numberOfLines={1}
                        >
                            {
                                order.company
                                    ?.name
                            }
                        </Text>

                        <Text
                            className="mt-1 text-xs"
                            style={{
                                color:
                                colors.secondary,
                            }}
                        >
                            Замовлення #
                            {order.id}
                        </Text>
                    </View>

                    {expanded ? (
                        <ChevronUp
                            size={20}
                            color={
                                colors.secondary
                            }
                        />
                    ) : (
                        <ChevronDown
                            size={20}
                            color={
                                colors.secondary
                            }
                        />
                    )}
                </View>

                <View className="mt-4 flex-row items-center justify-between">
                    <View>
                        <Text
                            className="text-xs"
                            style={{
                                color:
                                colors.secondary,
                            }}
                        >
                            {order.products
                                ?.length ?? 0}{" "}
                            товарів
                        </Text>

                        <Text
                            className="mt-1 text-xs"
                            style={{
                                color:
                                colors.secondary,
                            }}
                        >
                            Замовлення #
                            {order.id}
                        </Text>
                    </View>

                    <Text
                        className="text-base font-black"
                        style={{
                            color:
                            colors.text,
                        }}
                    >
                        {order.totalPrice.toFixed(
                            2
                        )}{" "}
                        ₴
                    </Text>
                </View>
            </Pressable>

            {expanded && (
                <View
                    className="border-t px-4 pb-4 pt-4"
                    style={{
                        borderColor:
                        colors.border,
                    }}
                >
                    <Text
                        className="mb-3 text-[17px] font-extrabold"
                        style={{
                            color:
                            colors.text,
                        }}
                    >
                        Замовлені товари
                    </Text>

                    {productsLoading ? (
                        <View className="items-center py-5">
                            <ActivityIndicator
                                size="small"
                                color={
                                    PRIMARY
                                }
                            />
                        </View>
                    ) : (
                        <View className="gap-2">
                            {order.products.map(
                                (
                                    product,
                                    index
                                ) => (
                                    <HistoryProductRow
                                        key={`${product.productId}-${index}`}
                                        product={
                                            product
                                        }
                                        affiliateProducts={
                                            affiliateProducts
                                        }
                                        colors={
                                            colors
                                        }
                                    />
                                )
                            )}
                        </View>
                    )}

                    {/*
                     * =========================
                     * PRICE
                     * =========================
                     */}

                    <View
                        className="mt-4 rounded-[18px] p-4"
                        style={{
                            backgroundColor:
                            colors.surface2,
                        }}
                    >
                        <PriceRow
                            title="Товари"
                            value={
                                order.productsPrice
                            }
                            colors={colors}
                        />

                        <PriceRow
                            title="Доставка"
                            value={
                                order.deliveryFee
                            }
                            colors={colors}
                        />

                        {order.fee > 0 && (
                            <PriceRow
                                title="Комісія"
                                value={
                                    order.fee
                                }
                                colors={
                                    colors
                                }
                            />
                        )}

                        {order.tipAmount >
                            0 && (
                                <PriceRow
                                    title={`Чайові (${order.tipPercent}%)`}
                                    value={
                                        order.tipAmount
                                    }
                                    colors={
                                        colors
                                    }
                                />
                            )}

                        <View
                            className="my-3 h-px"
                            style={{
                                backgroundColor:
                                colors.border,
                            }}
                        />

                        <View className="flex-row items-center justify-between">
                            <Text
                                className="text-base font-extrabold"
                                style={{
                                    color:
                                    colors.text,
                                }}
                            >
                                Всього
                            </Text>

                            <Text
                                className="text-lg font-black"
                                style={{
                                    color:
                                    colors.green,
                                }}
                            >
                                {order.totalPrice.toFixed(
                                    2
                                )}{" "}
                                ₴
                            </Text>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}

/*
 * =========================
 * PRODUCT
 * =========================
 */

function HistoryProductRow({
                               product,
                               affiliateProducts,
                               colors,
                           }: {
    product: IOrder["products"][number];
    affiliateProducts: any[];
    colors:
        | typeof COLORS.light
        | typeof COLORS.dark;
}) {
    /*
     * Знаходимо реальний товар у базі
     * через productId.
     */
    const affiliateProduct =
        affiliateProducts.find(
            (x) =>
                x.id == product.productId
        );

    const imagePath =
        affiliateProduct?.imagePath;

    const productName =
        affiliateProduct?.name ??
        `Товар #${product.productId}`;

    /*
     * Ціна додаткових опцій.
     */
    const additionalsPrice =
        product.additionals?.reduce(
            (sum, additional) =>
                sum + additional.price,
            0
        ) ?? 0;

    /*
     * Ціна однієї позиції.
     */
    const unitPrice =
        product.price +
        additionalsPrice;

    /*
     * Загальна ціна цього товару.
     */
    const productTotal =
        unitPrice * product.count;

    return (
        <View
            className="flex-row items-center rounded-[18px] p-3"
            style={{
                backgroundColor:
                colors.surface2,
            }}
        >
            {imagePath ? (
                <Image
                    source={{
                        uri:
                            APP_ENV
                                .API_IMAGE_MEDIUM_URL +
                            imagePath,
                    }}
                    className="h-14 w-14 rounded-[14px]"
                />
            ) : (
                <View
                    className="h-14 w-14 items-center justify-center rounded-[14px]"
                    style={{
                        backgroundColor:
                        colors.surface,
                    }}
                >
                    <Package
                        size={22}
                        color={
                            colors.green
                        }
                    />
                </View>
            )}

            <View className="ml-3 flex-1">
                <Text
                    className="text-sm font-bold"
                    style={{
                        color:
                        colors.text,
                    }}
                    numberOfLines={2}
                >
                    {productName}
                </Text>

                {product.additionals &&
                    product.additionals
                        .length > 0 && (
                        <Text
                            className="mt-1 text-[11px]"
                            style={{
                                color:
                                colors.secondary,
                            }}
                            numberOfLines={1}
                        >
                            +
                            {
                                product
                                    .additionals
                                    .length
                            }{" "}
                            дод.
                        </Text>
                    )}

                <Text
                    className="mt-1 text-xs"
                    style={{
                        color:
                        colors.secondary,
                    }}
                >
                    {product.count} ×{" "}
                    {unitPrice.toFixed(2)} ₴
                </Text>
            </View>

            <Text
                className="ml-2 text-sm font-extrabold"
                style={{
                    color:
                    colors.text,
                }}
            >
                {productTotal.toFixed(2)} ₴
            </Text>
        </View>
    );
}

/*
 * =========================
 * PRICE ROW
 * =========================
 */

function PriceRow({
                      title,
                      value,
                      colors,
                  }: {
    title: string;
    value: number;
    colors:
        | typeof COLORS.light
        | typeof COLORS.dark;
}) {
    return (
        <View className="mb-2 flex-row justify-between">
            <Text
                className="text-sm"
                style={{
                    color:
                    colors.secondary,
                }}
            >
                {title}
            </Text>

            <Text
                className="text-sm font-bold"
                style={{
                    color:
                    colors.text,
                }}
            >
                {value.toFixed(2)} ₴
            </Text>
        </View>
    );
}
