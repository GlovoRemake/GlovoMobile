import React from "react";
import {
    Image,
    Pressable,
    Text,
    View,
} from "react-native";
import { Heart } from "lucide-react-native";
import { useColorScheme } from "react-native";
import APP_ENV from "@/utils/env";

export interface ICompany {
    id: string;
    name: string;
    description: string;
    iconPath: string;
    bannerPath: string;
}

interface RestaurantCardProps {
    company: ICompany;
    width?: number;
}

export default function RestaurantCard({
                                           company,
                                           width = 290,
                                       }: RestaurantCardProps) {
    const scheme = useColorScheme();
    const isDark = scheme === "dark";

    return (
        <>
            {/* Banner */}
            <View
                className="h-44 overflow-hidden rounded-3xl"
                style={{
                    backgroundColor: isDark ? "#27272A" : "#F1F2F4",
                }}
            >
                {company.bannerPath ? (
                    <Image
                        source={{
                            uri: `${APP_ENV.API_IMAGE_LARGE_URL}${company.bannerPath}`,
                        }}
                        className="h-full w-full"
                        resizeMode="cover"
                    />
                ) : (
                    <View
                        className="h-full w-full items-center justify-center"
                        style={{
                            backgroundColor: isDark
                                ? "#27272A"
                                : "#F1F2F4",
                        }}
                    >
                        <Text className="text-4xl">🍽️</Text>
                    </View>
                )}

                {/*/!* Gradient-like dark overlay *!/*/}
                {/*<View*/}
                {/*    className="absolute inset-x-0 bottom-0 h-20"*/}
                {/*    style={{*/}
                {/*        backgroundColor: "rgba(0,0,0,0.18)",*/}
                {/*    }}*/}
                {/*/>*/}

                {/* Company icon */}
                <View
                    className="absolute bottom-3 left-3 h-14 w-14 overflow-hidden rounded-2xl"
                    style={{
                        backgroundColor: isDark ? "#18181B" : "#FFFFFF",
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
                    {company.iconPath ? (
                        <Image
                            source={{
                                uri: `${APP_ENV.API_IMAGE_MEDIUM_URL}${company.iconPath}`,
                            }}
                            className="h-full w-full"
                            resizeMode="cover"
                        />
                    ) : (
                        <View className="h-full w-full items-center justify-center">
                            <Text className="text-xl">🏪</Text>
                        </View>
                    )}
                </View>

                {/*/!* Favorite *!/*/}
                {/*<Pressable*/}
                {/*    onPress={() => {}}*/}
                {/*    className="absolute right-3 top-3 h-10 w-10 items-center justify-center rounded-full"*/}
                {/*    style={{*/}
                {/*        backgroundColor: "rgba(255,255,255,0.92)",*/}
                {/*    }}*/}
                {/*>*/}
                {/*    <Heart*/}
                {/*        size={20}*/}
                {/*        color="#111827"*/}
                {/*        strokeWidth={2}*/}
                {/*    />*/}
                {/*</Pressable>*/}
            </View>

            {/* Info */}
            <View className="mt-3">
                <Text
                    numberOfLines={1}
                    className="text-[17px] font-bold"
                    style={{
                        color: isDark ? "#FFFFFF" : "#111827",
                    }}
                >
                    {company.name}
                </Text>

                {!!company.description && (
                    <Text
                        numberOfLines={2}
                        className="mt-1 text-sm leading-5"
                        style={{
                            color: isDark ? "#A1A1AA" : "#6B7280",
                        }}
                    >
                        {company.description}
                    </Text>
                )}
            </View>
        </>
    );
}