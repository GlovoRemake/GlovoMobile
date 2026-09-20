import { ChevronRight, Minus, Plus, Trash2 } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GREEN, money } from "./theme";
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Pressable,
} from "react-native";

/* ------------------------------------------------------------------ */
/* CartBar — сума зліва, зелена кнопка справа ("Кошик >" / "Перейти до оплати") */
/* ------------------------------------------------------------------ */
interface CartBarProps {
    total: number;
    oldTotal?: number;
    label: string;
    chevron?: boolean;
    wide?: boolean;
    onPress?: () => void;
}

export function CartBar({ total, oldTotal, label, chevron = false, wide = false, onPress }: CartBarProps) {
    const insets = useSafeAreaInsets();

    return (
        <View
            className="flex-row items-center justify-between border-t border-gray-100 bg-white px-5 pt-3 dark:border-zinc-800 dark:bg-zinc-950"
            style={{ paddingBottom: Math.max(insets.bottom, 12) }}
        >
            <View>
                <Text className="text-base font-extrabold text-gray-900 dark:text-white">
                    {money(total)}
                </Text>
                {oldTotal !== undefined && (
                    <Text className="text-xs text-gray-400 line-through">
                        {money(oldTotal)}
                    </Text>
                )}
            </View>

            <Pressable
                onPress={onPress}
                className={`h-12 flex-row items-center justify-center rounded-xl px-6 ${
                    wide ? "ml-6 flex-1" : ""
                }`}
                style={{ backgroundColor: GREEN, minWidth: wide ? undefined : 150 }}
            >
                <Text className="text-base font-bold text-white">{label}</Text>
                {chevron && <ChevronRight size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />}
            </Pressable>
        </View>
    );
}

/* ------------------------------------------------------------------ */
/* AddBar — [🗑] [− 1 +] [Додати / сума]                                */
/* ------------------------------------------------------------------ */
interface AddBarProps {
    total: number;
    quantity?: number;

    onQuantityChange?: (
        quantity: number
    ) => void;

    onAdd?: () => void;

    disabled?: boolean;

    buttonLabel?: string;
}

export function AddBar({
                           total,
                           quantity = 1,
                           onQuantityChange,
                           onAdd,
                           disabled = false,
                           buttonLabel = "Додати",
                       }: AddBarProps) {
    const insets =
        useSafeAreaInsets();

    const decrease = () => {
        if (
            quantity <= 1 ||
            disabled
        ) {
            return;
        }

        onQuantityChange?.(
            quantity - 1
        );
    };

    const increase = () => {
        if (disabled) {
            return;
        }

        onQuantityChange?.(
            quantity + 1
        );
    };

    return (
        <View
            className="flex-row items-center border-t border-gray-100 bg-white px-5 pt-3 dark:border-zinc-800 dark:bg-zinc-950"
            style={{
                paddingBottom:
                    Math.max(
                        insets.bottom,
                        12
                    ),
            }}
        >
            {/* MINUS */}

            <Pressable
                onPress={decrease}
                disabled={
                    disabled ||
                    quantity <= 1
                }
                className="h-10 w-9 items-center justify-center"
            >
                <Minus
                    size={20}
                    color={
                        quantity <= 1 ||
                        disabled
                            ? "#9CA3AF"
                            : "#111827"
                    }
                />
            </Pressable>

            {/* QUANTITY */}

            <Text className="w-8 text-center text-base font-bold text-gray-900 dark:text-white">
                {quantity}
            </Text>

            {/* PLUS */}

            <Pressable
                onPress={increase}
                disabled={disabled}
                className="h-10 w-9 items-center justify-center"
            >
                <Plus
                    size={20}
                    color={
                        disabled
                            ? "#9CA3AF"
                            : "#111827"
                    }
                />
            </Pressable>

            {/* BUTTON */}

            <Pressable
                onPress={
                    disabled
                        ? undefined
                        : onAdd
                }
                disabled={disabled}
                className="ml-4 h-12 flex-1 items-center justify-center rounded-xl"
                style={{
                    backgroundColor:
                        disabled
                            ? "#9CA3AF"
                            : GREEN,
                }}
            >
                <Text className="text-xs font-semibold text-white/90">
                    {buttonLabel}
                </Text>

                <Text className="text-sm font-bold text-white">
                    {money(total)}
                </Text>
            </Pressable>
        </View>
    );
}