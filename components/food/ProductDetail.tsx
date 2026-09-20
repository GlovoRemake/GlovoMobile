import React, { useEffect, useMemo, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    Pressable,
    Image,
    ActivityIndicator,
} from "react-native";
import { Check, ChevronLeft } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

import { RoundButton, Price, DiscountBadge, FoodImage } from "./ui";
import { AddBar } from "./BottomBars";
import { GREEN, PRIMARY, RED } from "./theme";
import {useAddToCartMutation, useUpdateCartMutation} from "@/store/service/apiCart";

export interface ProductOption {
    id: number;
    name: string;
    price: number;
    oldPrice?: number;
}

export interface OptionGroup {
    id: number;
    name: string;
    minChoice: number;
    maxChoice: number;
    additionals: ProductOption[];
}

interface ProductDetailProps {
    productId: number;
    cartId?: number;
    name: string;
    price: number;
    oldPrice?: number;
    discount?: string;
    description?: string;
    imagePath?: string;
    emoji?: string;
    heroBg?: string;
    heroHeight?: number;
    groups?: OptionGroup[];
    initialSelectedIds?: number[];
    initialQuantity?: number;
    mode?: "create" | "edit";
    onAdd?: (additionalIds: number[], quantity: number) => Promise<void> | void;
}

const EMPTY_SELECTED_IDS: number[] = [];

export default function ProductDetail({
                                          productId,
                                          cartId,
                                          name,
                                          price,
                                          oldPrice,
                                          discount,
                                          description,
                                          imagePath,
                                          emoji = "🍔",
                                          heroBg = PRIMARY,
                                          heroHeight = 288,
                                          groups = [],
                                          initialSelectedIds = EMPTY_SELECTED_IDS,
                                          initialQuantity = 1,
                                          mode = "create",
                                          onAdd,
                                      }: ProductDetailProps) {
    const insets = useSafeAreaInsets();
    const [updateCart, { isLoading: isUpdating }] = useUpdateCartMutation();
    const [add, {isLoading: isAdding}] = useAddToCartMutation();

    const [selectedIds, setSelectedIds] = useState<number[]>(
        initialSelectedIds
    );
    const [quantity, setQuantity] = useState(initialQuantity);

    useEffect(() => {
        setSelectedIds(initialSelectedIds);
    }, [initialSelectedIds]);

    useEffect(() => {
        setQuantity(initialQuantity);
    }, [initialQuantity]);

    const isSelected = (id: number) => selectedIds.includes(id);

    const getGroupSelectedCount = (group: OptionGroup) =>
        group.additionals.filter(x => selectedIds.includes(x.id)).length;

    const toggleOption = (group: OptionGroup, option: ProductOption) => {
        const selected = isSelected(option.id);

        if (group.maxChoice === 1) {
            setSelectedIds(prev =>
                selected
                    ? prev.filter(id => id !== option.id)
                    : [
                        ...prev.filter(
                            id => !group.additionals.some(x => x.id === id)
                        ),
                        option.id,
                    ]
            );
            return;
        }

        if (selected) {
            setSelectedIds(prev => prev.filter(id => id !== option.id));
            return;
        }

        const count = getGroupSelectedCount(group);

        if (group.maxChoice > 0 && count >= group.maxChoice) return;

        setSelectedIds(prev => [...prev, option.id]);
    };

    const validation = useMemo(() => {
        for (const group of groups) {
            const count = getGroupSelectedCount(group);

            if (group.minChoice > 0 && count < group.minChoice) {
                return {
                    valid: false,
                    message: `Оберіть щонайменше ${group.minChoice} у групі "${group.name}"`,
                };
            }

            if (group.maxChoice > 0 && count > group.maxChoice) {
                return {
                    valid: false,
                    message: `Можна обрати максимум ${group.maxChoice} у групі "${group.name}"`,
                };
            }
        }

        return { valid: true, message: "" };
    }, [groups, selectedIds]);

    const additionalPrice = useMemo(
        () =>
            groups.reduce(
                (total, group) =>
                    total +
                    group.additionals
                        .filter(x => selectedIds.includes(x.id))
                        .reduce((sum, x) => sum + x.price, 0),
                0
            ),
        [groups, selectedIds]
    );

    const itemPrice = price + additionalPrice;
    const totalPrice = itemPrice * quantity;

    const handleSave = async () => {
        if (!validation.valid) return;

        if (mode === "edit" && cartId !== undefined) {
            try {
                await updateCart({
                    cartId,
                    body: {
                        count: quantity,
                        additionalIds: selectedIds,
                    },
                }).unwrap();

                router.back();
            } catch (error) {
                console.error("Failed to update cart", error);
            }
            return;
        }


        try {
            await add({
                productId: productId,
                count: quantity,
                additionalIds: selectedIds
            }).unwrap();
            router.back();
        } catch (error) {}
    };

    const buttonLabel = mode === "edit" ? "Зберегти зміни" : "Додати";

    return (
        <View className="flex-1 bg-white dark:bg-black">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 24 }}
            >
                <View style={{ height: heroHeight }}>
                    {imagePath ? (
                        <Image
                            source={{ uri: imagePath }}
                            className="h-full w-full"
                            resizeMode="cover"
                        />
                    ) : (
                        <FoodImage
                            className="h-full w-full"
                            emoji={emoji}
                            bg={heroBg}
                            emojiSize={110}
                        />
                    )}

                    <View
                        className="absolute left-5"
                        style={{ top: insets.top + 8 }}
                    >
                        <RoundButton onPress={() => router.back()}>
                            <ChevronLeft size={22} color="#111827" />
                        </RoundButton>
                    </View>
                </View>

                <View className="px-5 pb-5 pt-4">
                    {discount && (
                        <View className="mb-2">
                            <DiscountBadge value={discount} />
                        </View>
                    )}

                    <Text className="text-2xl font-extrabold text-gray-900 dark:text-white">
                        {name}
                    </Text>

                    <View className="mt-1">
                        <Price value={itemPrice} oldValue={oldPrice} large />
                    </View>

                    {description && (
                        <Text className="mt-2 text-sm leading-5 text-gray-500 dark:text-gray-400">
                            {description}
                        </Text>
                    )}
                </View>

                {groups.map(group => {
                    const selectedCount = getGroupSelectedCount(group);
                    const isRadio =
                        group.additionals.length > 1 && group.maxChoice === 1;

                    return (
                        <View key={group.id}>
                            <View className="flex-row items-center justify-between bg-gray-50 px-5 py-4 dark:bg-zinc-900">
                                <View className="flex-1 pr-3">
                                    <Text className="text-lg font-extrabold text-gray-900 dark:text-white">
                                        {group.name}
                                    </Text>

                                    <Text className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        {group.minChoice > 0
                                            ? `Обов'язково · мін. ${group.minChoice}`
                                            : "За бажанням"}
                                    </Text>
                                </View>

                                {group.minChoice > 0 && (
                                    <View
                                        className="rounded-md px-2 py-1"
                                        style={{ backgroundColor: RED }}
                                    >
                                        <Text className="text-[11px] font-bold text-white">
                                            Обов&#39;язково
                                        </Text>
                                    </View>
                                )}
                            </View>

                            {group.additionals.map(option => {
                                const selected = isSelected(option.id);

                                return (
                                    <Pressable
                                        key={option.id}
                                        onPress={() => toggleOption(group, option)}
                                        className="flex-row items-center border-b border-gray-100 px-5 py-4 dark:border-zinc-800"
                                    >
                                        {isRadio ? (
                                            <View
                                                className={`h-6 w-6 items-center justify-center rounded-full border-2 ${
                                                    selected
                                                        ? "border-[#0B6B3E]"
                                                        : "border-gray-300 dark:border-zinc-600"
                                                }`}
                                            >
                                                {selected && (
                                                    <View
                                                        className="h-3 w-3 rounded-full"
                                                        style={{
                                                            backgroundColor: GREEN,
                                                        }}
                                                    />
                                                )}
                                            </View>
                                        ) : (
                                            <View
                                                className={`h-6 w-6 items-center justify-center rounded-md border-2 ${
                                                    selected
                                                        ? "border-[#0B6B3E] bg-[#0B6B3E]"
                                                        : "border-gray-300 dark:border-zinc-600"
                                                }`}
                                            >
                                                {selected && (
                                                    <Check
                                                        size={14}
                                                        color="#FFFFFF"
                                                        strokeWidth={3}
                                                    />
                                                )}
                                            </View>
                                        )}

                                        <Text className="ml-3 flex-1 pr-3 text-[15px] text-gray-900 dark:text-white">
                                            {option.name}
                                        </Text>

                                        {option.price > 0 ? (
                                            <Price
                                                value={option.price}
                                                oldValue={option.oldPrice}
                                                prefix="+"
                                                stacked
                                            />
                                        ) : (
                                            <Text className="text-sm font-semibold text-gray-500">
                                                Безкоштовно
                                            </Text>
                                        )}
                                    </Pressable>
                                );
                            })}

                            {group.maxChoice > 1 && (
                                <View className="px-5 py-2">
                                    <Text className="text-xs text-gray-400">
                                        Обрано {selectedCount} / {group.maxChoice}
                                    </Text>
                                </View>
                            )}
                        </View>
                    );
                })}

                {!validation.valid && (
                    <View className="mx-5 mt-4 rounded-xl bg-red-50 px-4 py-3 dark:bg-red-950/30">
                        <Text className="text-sm font-semibold text-red-600 dark:text-red-400">
                            {validation.message}
                        </Text>
                    </View>
                )}
            </ScrollView>

            <AddBar
                total={totalPrice}
                quantity={quantity}
                onQuantityChange={setQuantity}
                onAdd={handleSave}
                disabled={!validation.valid || isUpdating || isAdding}
                buttonLabel={buttonLabel}
            />

            {isUpdating && (
                <View className="absolute inset-0 items-center justify-center bg-black/10">
                    <View className="rounded-xl bg-white p-4 dark:bg-zinc-900">
                        <ActivityIndicator color={GREEN} />
                    </View>
                </View>
            )}
        </View>
    );
}