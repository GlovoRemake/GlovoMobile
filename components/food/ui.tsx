import React from "react";
import { View, Text, Image, Pressable, ImageSourcePropType } from "react-native";
import { Minus, Plus, Trash2 } from "lucide-react-native";
import { RED, money } from "./theme";

/* ------------------------------------------------------------------ */
/* FoodImage — заглушка з емодзі. Передайте `source`, щоб показати фото */
/* ------------------------------------------------------------------ */
interface FoodImageProps {
    source?: ImageSourcePropType;
    emoji?: string;
    bg?: string;
    emojiSize?: number;
    className?: string;
}

export function FoodImage({
                              source,
                              emoji = "🍔",
                              bg = "#FFE7A8",
                              emojiSize = 36,
                              className = "",
                          }: FoodImageProps) {
    if (source) {
        return <Image source={source} resizeMode="cover" className={className} />;
    }

    return (
        <View
            className={`items-center justify-center ${className}`}
            style={{ backgroundColor: bg }}
        >
            <Text style={{ fontSize: emojiSize }}>{emoji}</Text>
        </View>
    );
}

/* ------------------------------------------------------------------ */
/* RoundButton — кругла кнопка з іконкою (назад, пошук, кошик...)      */
/* ------------------------------------------------------------------ */
interface RoundButtonProps {
    children: React.ReactNode;
    onPress?: () => void;
    bordered?: boolean;
}

export function RoundButton({ children, onPress, bordered = false }: RoundButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            className={`h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-zinc-800 ${
                bordered ? "border border-gray-200 dark:border-zinc-700" : ""
            }`}
            style={
                bordered
                    ? undefined
                    : {
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.12,
                        shadowRadius: 6,
                        elevation: 3,
                    }
            }
        >
            {children}
        </Pressable>
    );
}

/* ------------------------------------------------------------------ */
/* DiscountBadge — червоний "-30%"                                     */
/* ------------------------------------------------------------------ */
export function DiscountBadge({ value = "-30%" }: { value?: string }) {
    return (
        <View
            className="self-start rounded-md px-1.5 py-0.5"
            style={{ backgroundColor: RED }}
        >
            <Text className="text-[11px] font-bold text-white">{value}</Text>
        </View>
    );
}

/* ------------------------------------------------------------------ */
/* Price — ціна + закреслена стара ціна                                */
/* ------------------------------------------------------------------ */
interface PriceProps {
    value: number;
    oldValue?: number;
    prefix?: string;
    stacked?: boolean; // стара ціна під основною, вирівнювання вправо
    large?: boolean;
}

export function Price({
                          value,
                          oldValue,
                          prefix = "",
                          stacked = false,
                          large = false,
                      }: PriceProps) {
    return (
        <View className={stacked ? "items-end" : "flex-row items-baseline"}>
            <Text
                className={`${large ? "text-lg" : "text-sm"} font-extrabold text-gray-900 dark:text-white`}
            >
                {prefix}
                {money(value)}
            </Text>

            {oldValue !== undefined && (
                <Text
                    className={`text-xs text-gray-400 line-through ${stacked ? "mt-0.5" : "ml-2"}`}
                >
                    {prefix}
                    {money(oldValue)}
                </Text>
            )}
        </View>
    );
}

/* ------------------------------------------------------------------ */
/* QuantityStepper — [🗑 | − 1 +]                                      */
/* ------------------------------------------------------------------ */
interface QuantityStepperProps {
    value?: number;
    onRemove?: () => void;
    onMinus?: () => void;
    onPlus?: () => void;
}

export function QuantityStepper({
                                    value = 1,
                                    onRemove,
                                    onMinus,
                                    onPlus,
                                }: QuantityStepperProps) {
    return (
        <View className="h-9 flex-row items-center overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
            <Pressable
                onPress={onRemove}
                className="h-full w-9 items-center justify-center border-r border-gray-200 dark:border-zinc-700"
            >
                <Trash2 size={16} color="#6B7280" />
            </Pressable>

            <Pressable onPress={onMinus} className="h-full w-8 items-center justify-center">
                <Minus size={16} color="#6B7280" />
            </Pressable>

            <Text className="w-4 text-center text-sm font-bold text-gray-900 dark:text-white">
                {value}
            </Text>

            <Pressable onPress={onPlus} className="h-full w-8 items-center justify-center">
                <Plus size={16} color="#6B7280" />
            </Pressable>
        </View>
    );
}
