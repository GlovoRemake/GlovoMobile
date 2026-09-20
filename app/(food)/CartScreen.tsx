import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { ChevronLeft, Trash2 } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { DiscountBadge, FoodImage, Price, QuantityStepper, RoundButton } from "@/components/food/ui";
import { CartBar } from "@/components/food/BottomBars";
import { money } from "@/components/food/theme";

const ITEMS = [
    {
        name: "Біг Мак Меню",
        description:
            "Без чашки Картопля по-селянськи велика McFizz Сакура 400 мл Курячі крильця 3 шт додатково до меню БЕЗ Соус Біг Мак",
        price: 352.4,
        oldPrice: 440.0,
        discount: "-30%",
        emoji: "🍔",
        qty: 1,
    },
    {
        name: "Соус сирний",
        description: "",
        price: 25.0,
        oldPrice: undefined,
        discount: undefined,
        emoji: "🥣",
        qty: 1,
    },
];

const SUGGESTIONS = [
    { name: "Соус Хабанеро", price: 36, emoji: "🥣", bg: "#F3F4F6" },
    { name: "Соус сирний", price: 25, emoji: "🥣", bg: "#F3F4F6" },
];

export default function CartScreen() {
    const insets = useSafeAreaInsets();

    return (
        <View className="flex-1 bg-white dark:bg-black">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 24 }}
            >
                {/* Header */}
                <View className="px-5" style={{ paddingTop: insets.top + 8 }}>
                    <View className="flex-row items-center justify-between">
                        <RoundButton onPress={() => router.back()}>
                            <ChevronLeft size={22} color="#111827" />
                        </RoundButton>

                        <RoundButton bordered>
                            <Trash2 size={19} color="#6B7280" />
                        </RoundButton>
                    </View>

                    <Text className="mt-4 text-3xl font-extrabold text-gray-900 dark:text-white">
                        Ваш кошик
                    </Text>
                    <Text className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        продукт зі McDonald's: {ITEMS.length}
                    </Text>
                </View>

                {/* Items */}
                <View className="mt-3">
                    {ITEMS.map((item) => (
                        <View key={item.name} className="flex-row px-5 py-4">
                            <FoodImage className="h-16 w-16 rounded-xl" emoji={item.emoji} />

                            <View className="ml-3 flex-1">
                                <View className="flex-row items-start justify-between">
                                    <Text className="flex-1 pr-2 text-[15px] font-bold text-gray-900 dark:text-white">
                                        {item.name}
                                    </Text>
                                    <QuantityStepper value={item.qty} />
                                </View>

                                {item.description ? (
                                    <Text className="mt-1 text-xs leading-4 text-gray-500 dark:text-gray-400">
                                        {item.description}
                                    </Text>
                                ) : null}

                                <View className="mt-2 flex-row items-center justify-between">
                                    <Price value={item.price} oldValue={item.oldPrice} />
                                    {item.discount ? <DiscountBadge value={item.discount} /> : null}
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>

            <CartBar total={377.4} oldTotal={465.0} label="Перейти до оплати" wide />
        </View>
    );
}
