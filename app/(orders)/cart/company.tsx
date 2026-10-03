import React, {useMemo, useRef, useState} from "react";
import PaymentOption from "@/components/ui/custom/PaymentOption";
import {
    View,
    Text,
    ScrollView,
    Pressable,
    Image,
    Alert,
    ActivityIndicator, useColorScheme,
} from "react-native";
import {
    ChevronLeft,
    Minus,
    Plus,
    Trash2,
    CreditCard, Banknote, Smartphone, Check
} from "lucide-react-native";
import {
    router,
    useLocalSearchParams,
} from "expo-router";
import {
    useSafeAreaInsets,
} from "react-native-safe-area-context";


import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetView,
} from "@gorhom/bottom-sheet";

import {
    apiCart,
    useDeleteFromCartMutation,
    useGetCartsQuery,
    useUpdateCartMutation,
} from "@/store/service/apiCart";

import type { IUserCart } from "@/types/Cart/IUserCart";

import APP_ENV from "@/utils/env";
import {
    GREEN,
    money,
} from "@/components/food/theme";
import {useGetAddressesQuery} from "@/store/service/apiAddress";
import {useGetCompaniesQuery} from "@/store/service/apiCompany";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "@/store";
import {useConfirmOrderMutation} from "@/store/service/apiOrder";
import {IPaymentMethod} from "@/types/Order/IPaymentMethod";

type CartItem = IUserCart["carts"][number];

export default function CompanyCart() {
    const scheme = useColorScheme();
    const darkMode = scheme == "dark";

    const insets = useSafeAreaInsets();

    const { companyId } =
        useLocalSearchParams<{
            companyId: string;
        }>();

    const {
        data: carts,
        isLoading,
        isFetching,
    } = useGetCartsQuery();

    const [
        updateCart,
        {
            isLoading: isUpdating,
        },
    ] = useUpdateCartMutation();

    const [
        deleteFromCart,
        {
            isLoading: isDeleting,
        },
    ] = useDeleteFromCartMutation();

    /**
     * Знаходимо кошик конкретної компанії
     */
    const companyCart = useMemo(() => {
        return carts?.find(
            (item) =>
                String(item.company.id) ===
                String(companyId)
        );
    }, [carts, companyId]);

    /**
     * Вибрані додатки конкретного cart item
     */
    const getSelectedAdditionalIds = (
        cart: CartItem
    ): number[] => {
        return (
            cart.additionalGroups
                ?.flatMap((group) =>
                    group.additionals
                        ?.filter(
                            (additional) =>
                                additional.isSelected
                        )
                        .map(
                            (additional) =>
                                additional.id
                        ) ?? []
                ) ?? []
        );
    };

    /**
     * Ціна всіх вибраних додатків
     */
    const getAdditionalsPrice = (
        cart: CartItem
    ): number => {
        return (
            cart.additionalGroups?.reduce(
                (total, group) =>
                    total +
                    (group.additionals
                        ?.filter(
                            (additional) =>
                                additional.isSelected
                        )
                        .reduce(
                            (
                                sum,
                                additional
                            ) =>
                                sum +
                                additional.price,
                            0
                        ) ?? 0),
                0
            ) ?? 0
        );
    };

    /**
     * Ціна одного товару з додатками
     */
    const getItemPrice = (
        cart: CartItem
    ): number => {
        return (
            cart.product.price +
            getAdditionalsPrice(cart)
        );
    };

    /**
     * Загальна кількість товарів
     */
    const bottomSheetRef = useRef<BottomSheet>(null);

    const [paymentMethod, setPaymentMethod] =
        useState<"cash" | "applePay" | "googlePay" | "card">("card");

    const [tipPercent, setTipPercent] = useState(0);

    const snapPoints = useMemo(
        () => ["65%", "90%"],
        []
    );

    const totalCount = useMemo(() => {
        if (!companyCart) {
            return 0;
        }

        return companyCart.carts.reduce(
            (sum, cart) =>
                sum + cart.count,
            0
        );
    }, [companyCart]);

    const productsPrice = useMemo(() => {
        if (!companyCart) {
            return 0;
        }

        return companyCart.carts.reduce(
            (sum, cart) =>
                sum + getItemPrice(cart) * cart.count,
            0
        );
    }, [companyCart]);

    const totalWeight = useMemo(() => {
        if (!companyCart) {
            return 0;
        }

        return companyCart.carts.reduce(
            (sum, cart) =>
                sum + (cart.product.weight ?? 0) * cart.count,
            0
        );
    }, [companyCart]);

    const deliveryFee = useMemo(() => {
        return calculateDeliveryFee(totalWeight);
    }, [totalWeight]);

    const tipAmount = useMemo(() => {
        return productsPrice * tipPercent / 100;
    }, [productsPrice, tipPercent]);

    const totalPrice = useMemo(() => {
        return productsPrice + deliveryFee + tipAmount;
    }, [productsPrice, deliveryFee, tipAmount]);
    /**
     * Зміна кількості
     */
    const changeQuantity = async (
        cart: CartItem,
        newCount: number
    ) => {
        if (newCount < 1) {
            return;
        }

        try {
            await updateCart({
                cartId: cart.id,
                body: {
                    count: newCount,
                    additionalIds:
                        getSelectedAdditionalIds(
                            cart
                        ),
                },
            }).unwrap();
        } catch (error) {
            console.error(
                "Failed to update cart",
                error
            );

            Alert.alert(
                "Помилка",
                "Не вдалося змінити кількість товару"
            );
        }
    };

    /**
     * Видалення товару
     */
    const removeCartItem = (
        cart: CartItem
    ) => {
        Alert.alert(
            "Видалити товар?",
            cart.product.name,
            [
                {
                    text: "Скасувати",
                    style: "cancel",
                },
                {
                    text: "Видалити",
                    style: "destructive",
                    onPress:
                        async () => {
                            try {
                                await deleteFromCart(
                                    cart.id
                                ).unwrap();
                            } catch (error) {
                                console.error(
                                    "Failed to delete cart",
                                    error
                                );

                                Alert.alert(
                                    "Помилка",
                                    "Не вдалося видалити товар"
                                );
                            }
                        },
                },
            ]
        );
    };

    /**
     * Відкриття редагування додатків
     */
    const editProduct = (
        cart: CartItem
    ) => {
        router.push({
            pathname:
                "/(orders)/cart/product",
            params: {
                cartId:
                    String(cart.id),
                productId:
                    String(
                        cart.product.id
                    ),
            },
        });
    };




    const selectedAddressId =
        useSelector(
            (state: RootState) =>
                state.address
                    .selectedAddressId
        );

    const {data: addresses, isLoading: isAdressesLoading} = useGetAddressesQuery();

    const selectedAddress =
        addresses?.find(
            (address) =>
                address.id ===
                selectedAddressId
        ) ?? null;

    const dispatch = useAppDispatch();
    const [confirmOrder, {isLoading: isConfirming}] = useConfirmOrderMutation();
    const confirmOrderHandler = async () => {
        try {
            await confirmOrder({
                companyId: companyId,
                locationId: selectedAddress?.id ?? 0,
                paymentMethod: IPaymentMethod[paymentMethod],
                tipPercent: tipPercent,
            }).unwrap()

            dispatch(apiCart.util.invalidateTags(["Cart"]));
        } catch (error) {
            console.error(error)
        }
    }




    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-white dark:bg-black">
                <ActivityIndicator
                    size="large"
                    color={GREEN}
                />
            </View>
        );
    }

    if (!companyCart) {
        return (
            <View
                className="flex-1 items-center justify-center bg-white px-5 dark:bg-black"
                style={{
                    paddingTop:
                    insets.top,
                }}
            >
                <Text className="text-xl font-extrabold text-gray-900 dark:text-white">
                    Кошик порожній
                </Text>

                <Pressable
                    onPress={() =>
                        router.back()
                    }
                    className="mt-5 rounded-xl px-6 py-3"
                    style={{
                        backgroundColor:
                        GREEN,
                    }}
                >
                    <Text className="font-bold text-white">
                        Назад
                    </Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white dark:bg-black">
            {/* ================= HEADER ================= */}

            <View
                className="flex-row items-center border-b border-gray-100 bg-white px-5 pb-3 dark:border-zinc-800 dark:bg-black"
                style={{
                    paddingTop:
                        insets.top + 8,
                }}
            >
                <Pressable
                    onPress={() =>
                        router.back()
                    }
                    className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-900"
                >
                    <ChevronLeft
                        size={22}
                        color="#111827"
                    />
                </Pressable>

                <View className="flex-1">
                    <Text
                        numberOfLines={1}
                        className="text-xl font-extrabold text-gray-900 dark:text-white"
                    >
                        {
                            companyCart
                                .company
                                .name
                        }
                    </Text>

                    <Text className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                        {totalCount}{" "}
                        {getProductWord(
                            totalCount
                        )}
                    </Text>
                </View>
            </View>

            {/* ================= PRODUCTS ================= */}

            <ScrollView
                showsVerticalScrollIndicator={
                    false
                }
                contentContainerStyle={{
                    paddingBottom:
                        insets.bottom +
                        120,
                }}
            >
                {companyCart.carts.map(
                    (cart, index) => {
                        const selectedAdditionals =
                            cart.additionalGroups
                                ?.flatMap(
                                    (group) =>
                                        group.additionals?.filter(
                                            (
                                                additional
                                            ) =>
                                                additional.isSelected
                                        ) ?? []
                                ) ?? [];

                        const itemPrice =
                            getItemPrice(
                                cart
                            );

                        return (
                            <View
                                key={index}
                                className="border-b border-gray-100 px-5 py-4 dark:border-zinc-800"
                            >
                                {/* ================= PRODUCT ================= */}

                                <Pressable
                                    onPress={() =>
                                        editProduct(
                                            cart
                                        )
                                    }
                                >
                                    <View className="flex-row">
                                        {/* IMAGE */}

                                        <View className="h-24 w-24 overflow-hidden rounded-xl bg-gray-100 dark:bg-zinc-800">
                                            {cart
                                                .product
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
                                                    <Text className="text-3xl">
                                                        🍽️
                                                    </Text>
                                                </View>
                                            )}
                                        </View>

                                        {/* INFO */}

                                        <View className="ml-4 flex-1 pr-2">
                                            <Text
                                                numberOfLines={
                                                    2
                                                }
                                                className="text-base font-extrabold text-gray-900 dark:text-white"
                                            >
                                                {
                                                    cart
                                                        .product
                                                        .name
                                                }
                                            </Text>

                                            {selectedAdditionals.length >
                                                0 && (
                                                    <Text
                                                        numberOfLines={
                                                            3
                                                        }
                                                        className="mt-1 text-xs leading-4 text-gray-500 dark:text-gray-400"
                                                    >
                                                        {selectedAdditionals
                                                            .map(
                                                                (
                                                                    additional
                                                                ) =>
                                                                    additional.name
                                                            )
                                                            .join(
                                                                ", "
                                                            )}
                                                    </Text>
                                                )}

                                            <Text className="mt-2 text-base font-extrabold text-gray-900 dark:text-white">
                                                {money(
                                                    itemPrice
                                                )}
                                            </Text>
                                        </View>

                                        {/* DELETE */}

                                        <Pressable
                                            disabled={
                                                isDeleting
                                            }
                                            onPress={() =>
                                                removeCartItem(
                                                    cart
                                                )
                                            }
                                            className="h-9 w-9 items-center justify-center rounded-full"
                                        >
                                            {isDeleting ? (
                                                <ActivityIndicator
                                                    size="small"
                                                    color="#EF4444"
                                                />
                                            ) : (
                                                <Trash2
                                                    size={
                                                        19
                                                    }
                                                    color="#EF4444"
                                                />
                                            )}
                                        </Pressable>
                                    </View>
                                </Pressable>

                                {/* ================= BOTTOM ROW ================= */}

                                <View className="mt-4 flex-row items-center justify-between">
                                    <Text className="text-xs text-gray-400 dark:text-gray-500">
                                        {money(
                                            itemPrice
                                        )}{" "}
                                        / шт.
                                    </Text>

                                    {/* QUANTITY */}

                                    <View className="flex-row items-center rounded-xl bg-gray-100 px-1 dark:bg-zinc-800">
                                        <Pressable
                                            disabled={
                                                cart.count <=
                                                1 ||
                                                isUpdating
                                            }
                                            onPress={() =>
                                                changeQuantity(
                                                    cart,
                                                    cart.count -
                                                    1
                                                )
                                            }
                                            className="h-9 w-9 items-center justify-center"
                                        >
                                            <Minus
                                                size={
                                                    17
                                                }
                                                color={
                                                    cart.count <=
                                                    1 ||
                                                    isUpdating
                                                        ? "#9CA3AF"
                                                        : "#111827"
                                                }
                                            />
                                        </Pressable>

                                        <Text className="w-8 text-center text-sm font-bold text-gray-900 dark:text-white">
                                            {
                                                cart.count
                                            }
                                        </Text>

                                        <Pressable
                                            disabled={
                                                isUpdating
                                            }
                                            onPress={() =>
                                                changeQuantity(
                                                    cart,
                                                    cart.count +
                                                    1
                                                )
                                            }
                                            className="h-9 w-9 items-center justify-center"
                                        >
                                            <Plus
                                                size={
                                                    17
                                                }
                                                color={
                                                    isUpdating
                                                        ? "#9CA3AF"
                                                        : "#111827"
                                                }
                                            />
                                        </Pressable>
                                    </View>
                                </View>

                                {/* EDIT HINT */}

                                <Pressable
                                    onPress={() =>
                                        editProduct(
                                            cart
                                        )
                                    }
                                    className="mt-3"
                                >
                                    <Text
                                        className="text-sm font-semibold"
                                        style={{
                                            color: GREEN,
                                        }}
                                    >
                                        Редагувати додатки
                                    </Text>
                                </Pressable>
                            </View>
                        );
                    }
                )}
            </ScrollView>

            {/* ================= BOTTOM BAR ================= */}

            <View
                className="absolute bottom-0 left-0 right-0 border-t border-gray-100 bg-white px-5 pt-3 dark:border-zinc-800 dark:bg-zinc-950"
                style={{
                    paddingBottom:
                        Math.max(
                            insets.bottom,
                            12
                        ),
                }}
            >
                <View className="flex-row items-center justify-between">
                    <View>
                        <View className="mb-3">
                            <View className="flex-row justify-between">
                                <Text className="text-sm text-gray-500 dark:text-gray-400">
                                    Товари
                                </Text>

                                <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {money(productsPrice)}
                                </Text>
                            </View>

                            <View className="mt-1 flex-row justify-between">
                                <Text className="text-sm text-gray-500 dark:text-gray-400">
                                    Доставка
                                </Text>

                                <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {money(deliveryFee)}
                                </Text>
                            </View>

                            <View className="mt-2 flex-row justify-between gap-2">
                                <Text className="text-base font-bold text-gray-900 dark:text-white">
                                    Разом
                                </Text>

                                <Text className="text-xl font-extrabold text-gray-900 dark:text-white">
                                    {money(totalPrice)}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <Pressable
                        className="h-12 flex-1 mt-auto items-center justify-center rounded-xl"
                        style={{
                            backgroundColor:
                            GREEN,
                            marginLeft: 16,
                        }}
                        onPress={() => {
                            bottomSheetRef.current?.expand();
                        }}
                    >
                        <Text className="text-sm font-bold text-white">
                            Оформити замовлення
                        </Text>
                    </Pressable>
                </View>
            </View>

            {/* Якщо API зараз оновлюється */}
            {isFetching && (
                <View className="absolute right-5 top-20">
                    <ActivityIndicator
                        size="small"
                        color={GREEN}
                    />
                </View>
            )}


            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={snapPoints}
                enablePanDownToClose
                backgroundStyle={{
                    backgroundColor: darkMode ? "#111827" : "#FFFFFF",
                }}
                handleIndicatorStyle={{
                    backgroundColor: darkMode ? "#4B5563" : "#D1D5DB",
                    width: 40,
                }}
                backdropComponent={(props) => (
                    <BottomSheetBackdrop
                        {...props}
                        appearsOnIndex={0}
                        disappearsOnIndex={-1}
                        opacity={0.5}
                    />
                )}
            >
                <BottomSheetView
                    className="flex-1 px-5 pb-5"
                    style={{ backgroundColor: darkMode ? "#111827" : "#FFFFFF" }}
                >
                    {/* HEADER */}
                    <View className="mb-6">
                        <Text
                            className="text-2xl font-extrabold"
                            style={{ color: darkMode ? "#F9FAFB" : "#111827" }}
                        >
                            Оформлення замовлення
                        </Text>

                        <Text
                            className="mt-1 text-sm"
                            style={{ color: darkMode ? "#9CA3AF" : "#6B7280" }}
                        >
                            Оберіть спосіб оплати та чайові
                        </Text>
                    </View>

                    {/* PAYMENT */}
                    <Text
                        className="mb-3 text-base font-extrabold"
                        style={{ color: darkMode ? "#F9FAFB" : "#111827" }}
                    >
                        Спосіб оплати
                    </Text>

                    <View className="gap-2">
                        {[
                            {
                                value: "cash",
                                title: "Готівка",
                                subtitle: "Оплата кур'єру",
                                icon: <Banknote size={21} color={darkMode ? "#F9FAFB" : "#111827"} />,
                            },
                            {
                                value: "applePay",
                                title: "Apple Pay",
                                subtitle: "Швидка оплата",
                                icon: <Smartphone size={21} color={darkMode ? "#F9FAFB" : "#111827"} />,
                            },
                            {
                                value: "googlePay",
                                title: "Google Pay",
                                subtitle: "Швидка оплата",
                                icon: <Smartphone size={21} color={darkMode ? "#F9FAFB" : "#111827"} />,
                            },
                            {
                                value: "card",
                                title: "Банківська картка",
                                subtitle: "Visa / Mastercard",
                                icon: <CreditCard size={21} color={darkMode ? "#F9FAFB" : "#111827"} />,
                            },
                        ].map((item) => (
                            <PaymentOption
                                key={item.value}
                                title={item.title}
                                subtitle={item.subtitle}
                                icon={item.icon}
                                selected={paymentMethod === item.value}
                                onPress={() => setPaymentMethod(item.value)}
                                darkMode={darkMode}
                            />
                        ))}
                    </View>

                    {/* TIPS */}
                    <Text
                        className="mb-3 mt-6 text-base font-extrabold"
                        style={{ color: darkMode ? "#F9FAFB" : "#111827" }}
                    >
                        Чайові
                    </Text>

                    <View className="flex-row gap-2">
                        {[0, 5, 10, 15].map((percent) => {
                            const selected = tipPercent === percent;

                            return (
                                <Pressable
                                    key={percent}
                                    onPress={() => setTipPercent(percent)}
                                    className="h-12 flex-1 items-center justify-center rounded-xl border"
                                    style={{
                                        borderColor: selected
                                            ? GREEN
                                            : darkMode
                                                ? "#374151"
                                                : "#E5E7EB",
                                        backgroundColor: selected
                                            ? `${GREEN}15`
                                            : darkMode
                                                ? "#1F2937"
                                                : "#FFFFFF",
                                    }}
                                >
                                    <Text
                                        className="text-sm font-bold"
                                        style={{
                                            color: selected
                                                ? GREEN
                                                : darkMode
                                                    ? "#D1D5DB"
                                                    : "#374151",
                                        }}
                                    >
                                        {percent}%
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>

                    {/* SUMMARY */}
                    <View
                        className="mt-6 rounded-2xl p-4 bg-[#F9FAFB] dark:bg-[#1F2937]"
                    >
                        {[
                            ["Товари", money(productsPrice)],
                            ["Доставка", money(deliveryFee)],
                            ...(tipPercent > 0
                                ? [[`Чайові (${tipPercent}%)`, money(tipAmount)]]
                                : []),
                        ].map(([label, value], index) => (
                            <View
                                key={label}
                                className={`flex-row justify-between ${
                                    index > 0 ? "mt-2" : ""
                                }`}
                            >
                                <Text
                                    className="text-sm text-[#111827] dark:text-[#F9FAFB]"
                                >
                                    {label}
                                </Text>

                                <Text
                                    className="font-semibold text-[#111827] dark:text-[#F9FAFB]"
                                >
                                    {value}
                                </Text>
                            </View>
                        ))}

                        <View
                            className="my-3 h-px bg-[#E5E7EB] dark:bg-[#374151]"
                        />

                        <View className="flex-row items-center justify-between">
                            <Text
                                className="text-base font-extrabold text-[#111827] dark:text-[#F9FAFB]"
                            >
                                Разом
                            </Text>

                            <Text
                                className="text-xl font-extrabold text-[#111827] dark:text-[#F9FAFB]"
                            >
                                {money(totalPrice)}
                            </Text>
                        </View>
                    </View>

                    {/* CONFIRM */}
                    <Pressable
                        className="mt-4 h-14 items-center justify-center rounded-2xl"
                        style={{ backgroundColor: GREEN }}
                        onPress={async () => {
                            await confirmOrderHandler();
                            bottomSheetRef.current?.close();
                            router.back();
                        }}
                    >
                        {isConfirming ? (
                            <ActivityIndicator size={"small"} color={"#fff"} />
                        ) : (
                            <Text className="text-base font-extrabold text-white">
                                Підтвердити замовлення
                            </Text>
                        )}
                    </Pressable>
                </BottomSheetView>
            </BottomSheet>

        </View>
    );
}

/**
 * Українське відображення кількості
 */
function getProductWord(
    count: number
): string {
    const lastTwo = count % 100;
    const last = count % 10;

    if (
        lastTwo >= 11 &&
        lastTwo <= 14
    ) {
        return "товарів";
    }

    if (last === 1) {
        return "товар";
    }

    if (
        last >= 2 &&
        last <= 4
    ) {
        return "товари";
    }

    return "товарів";
}


const calculateDeliveryFee = (weight: number): number => {
    if (weight <= 2000) return 50;
    if (weight <= 3500) return 80;
    if (weight <= 6000) return 120;

    return 150;
};