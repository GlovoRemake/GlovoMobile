import { Button } from "@/components/ui/button";
import { useGetProfileQuery } from "@/store/service/apiAccount";
import APP_ENV from "@/utils/env";
import { deleteSecureStore } from "@/utils/secureStore";
import { router } from "expo-router";
import {
    ChevronRight,
    KeyRound,
    LogOut,
    MapPin,
    Pencil,
    RotateCw
} from "lucide-react-native";
import React from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from "react-native";

export interface IProfile {
    firstName: string;
    lastName: string;
    phone: string;
    avatarPath: string;
    roles: string[];
}

const PRIMARY = "#FFC244";

export default function Index() {
    const { data, isLoading, isFetching, refetch } = useGetProfileQuery();

    if (isLoading || isFetching) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-black">
                <ActivityIndicator size="large" color={PRIMARY} />
            </View>
        );
    }

    const profile = data as IProfile | undefined;

    if (!profile) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-50 px-6 dark:bg-black">
                <Text className="text-center text-base text-gray-500 dark:text-gray-400">
                    Не вдалося завантажити профіль
                </Text>

                <Button
                    onPress={() => refetch()}
                    className="mt-4 h-10 rounded-[20px] font-nunito transition-all duration-200"
                    style={{
                        backgroundColor: PRIMARY,
                    }}
                >
                    <RotateCw size={16} strokeWidth={3} />
                    <Text className="text-base font-bold">
                        Повторити спробу
                    </Text>
                </Button>
            </View>
        );
    }

    const fullName = `${profile.firstName} ${profile.lastName}`.trim();

    return (
        <ScrollView
            className="flex-1 bg-gray-50 dark:bg-black"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
                paddingHorizontal: 0,
                paddingTop: 15,
                paddingBottom: 60,
            }}
        >
            <View className="px-5 pt-14">
                {/* Header */}
                <View className="mb-6 flex-row items-center justify-between">
                    <Text className="text-3xl font-extrabold text-gray-900 dark:text-white">
                        Профіль
                    </Text>
                </View>

                {/* Profile card */}
                <View
                    className="overflow-hidden rounded-[28px] bg-white dark:bg-zinc-900"
                    style={{
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 8 },
                        shadowOpacity: 0.06,
                        shadowRadius: 20,
                        elevation: 3,
                    }}
                >
                    <View
                        className="h-24"
                        style={{ backgroundColor: PRIMARY }}
                    >
                        <Pressable
                            className="absolute top-3 right-3 h-10 w-10 items-center justify-center rounded-full border border-1 border-black/10"
                            style={{ backgroundColor: PRIMARY }}
                            onPress={() => router.push("/(main)/profile/updateProfile")}
                        >
                            <Pencil size={18} color="#111827" />
                        </Pressable>
                    </View>

                    <View className="px-5 pb-5">
                        {/* Avatar */}
                        <View className="-mt-12 mb-4 flex-row items-end justify-between">
                            <View
                                className="h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-gray-100 dark:border-zinc-900"
                            >
                                {profile.avatarPath ? (
                                    <Image
                                        source={{ uri: `${APP_ENV.API_IMAGE_LARGE_URL}${profile.avatarPath}` }}
                                        className="h-full w-full"
                                    />
                                ) : (
                                    <View
                                        className="h-full w-full items-center justify-center"
                                        style={{ backgroundColor: "#FFE7A8" }}
                                    >
                                        <Text className="text-3xl font-bold text-gray-900">
                                            {profile.firstName?.[0]}
                                            {profile.lastName?.[0]}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        <Text className="text-2xl font-extrabold text-gray-900 dark:text-white">
                            {fullName}
                        </Text>

                        <Text className="mt-1 text-base text-gray-500 dark:text-gray-400">
                            {profile.phone}
                        </Text>
                    </View>
                </View>

                {/* Quick actions */}
                <Text className="mb-3 mt-7 text-lg font-bold text-gray-900 dark:text-white">
                    Мій акаунт
                </Text>

                <View
                    className="overflow-hidden rounded-[24px] bg-white dark:bg-zinc-900"
                >
                    <ProfileRow
                        icon={<MapPin size={21} color="#111827" />}
                        iconBackground="#FFF4D6"
                        title="Мої адреси"
                        subtitle="Керування адресами доставки"
                        onPress={() => router.push("/(main)/profile/myAddresses")}
                    />

                    <Divider />

                    <ProfileRow
                        icon={<KeyRound size={21} color="#111827" />}
                        iconBackground="#E8F7ED"
                        title="Зміна пароля"
                        subtitle="Змінити свій пароль на новий"
                        onPress={() => { }}
                    />
                </View>

                {/* Logout */}

                <Button className="mt-5 mb-10 h-14 flex-row items-center justify-center rounded-2xl bg-white dark:bg-zinc-900" onPress={() => {
                    deleteSecureStore("accessToken");
                    deleteSecureStore("refreshToken");
                    router.replace("/(auth)/login");
                }}>
                    <LogOut size={20} color="#EF4444" />
                    <Text className="ml-2 text-base font-bold text-red-500">
                        Вийти з акаунта
                    </Text>
                </Button>
            </View>
        </ScrollView>
    );
}

function Divider() {
    return (
        <View className="ml-[68px] h-px bg-gray-100 dark:bg-zinc-800" />
    );
}

interface ProfileRowProps {
    icon: React.ReactNode;
    iconBackground: string;
    title: string;
    subtitle: string;
    onPress: () => void;
}

function ProfileRow({
    icon,
    iconBackground,
    title,
    subtitle,
    onPress,
}: ProfileRowProps) {
    return (
        <Pressable
            onPress={onPress}
            className="flex-row items-center px-4 py-4"
            style={({ pressed }) => ({
                opacity: pressed ? 0.65 : 1,
            })}
        >
            <View
                className="h-11 w-11 items-center justify-center rounded-2xl"
                style={{ backgroundColor: iconBackground }}
            >
                {icon}
            </View>

            <View className="ml-3 flex-1">
                <Text className="text-[15px] font-bold text-gray-900 dark:text-white">
                    {title}
                </Text>

                <Text className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    {subtitle}
                </Text>
            </View>

            <ChevronRight size={20} color="#9CA3AF" />
        </Pressable>
    );
}
