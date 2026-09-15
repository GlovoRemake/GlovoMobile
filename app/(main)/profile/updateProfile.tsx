import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Pressable,
    ScrollView,
    Image,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    useColorScheme,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import {
    ArrowLeft,
    Camera,
    Check,
    User,
    Phone, LogOut,
} from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import {router, useRouter} from "expo-router";

// Заміни шлях на той, який використовується у твоєму проєкті
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    useGetProfileQuery,
    useUpdateProfileMutation,
} from "@/store/service/apiAccount";
import {IUpdateProfile} from "@/types/account/IUpdateProfile";
import APP_ENV from "@/utils/env";

const PRIMARY = "#FFC244";

const colors = {
    light: {
        background: "#F9FAFB",
        card: "#FFFFFF",
        text: "#111827",
        secondaryText: "#6B7280",
        mutedText: "#9CA3AF",
        border: "#E5E7EB",
        icon: "#6B7280",
        inputBackground: "#FFFFFF",
        avatarBackground: "#FFF4D6",
        avatarIcon: "#8A6A1F",
        headerIconBackground: "#FFFFFF",
        divider: "#F3F4F6",
        error: "#EF4444",
        buttonText: "#111827",
    },
    dark: {
        background: "#09090B",
        card: "#18181B",
        text: "#FAFAFA",
        secondaryText: "#A1A1AA",
        mutedText: "#71717A",
        border: "#3F3F46",
        icon: "#A1A1AA",
        inputBackground: "#18181B",
        avatarBackground: "#3F351D",
        avatarIcon: "#FFC244",
        headerIconBackground: "#18181B",
        divider: "#27272A",
        error: "#F87171",
        buttonText: "#111827",
    },
};

export default function EditProfile() {
    const router = useRouter();
    const colorScheme = useColorScheme();

    const theme = colorScheme === "dark" ? colors.dark : colors.light;

    const { data, isLoading: isProfileLoading } = useGetProfileQuery();

    const [updateProfile, { isLoading: isUpdating }] =
        useUpdateProfileMutation();

    const profile = data;

    const [avatarUri, setAvatarUri] = useState<string | null>(
        `${APP_ENV.API_IMAGE_LARGE_URL}${profile?.avatarPath}` || null
    );

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<IUpdateProfile>({
        defaultValues: {
            firstName: "",
            lastName: "",
            phone: "",
            avatar: null,
        },
    });

    useEffect(() => {
        if (!profile) return;

        reset({
            firstName: profile.firstName ?? "",
            lastName: profile.lastName ?? "",
            phone: profile.phone ?? "",
            avatar: null,
        });

        setAvatarUri(`${APP_ENV.API_IMAGE_LARGE_URL}${profile?.avatarPath}` || null);
    }, [profile, reset]);

    const pickAvatar = async (
        onChange: (value: IUpdateProfile["avatar"]) => void
    ) => {
        const permission =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.85,
        });

        if (result.canceled) {
            return;
        }

        const asset = result.assets[0];

        setAvatarUri(asset.uri);

        const extension =
            asset.fileName?.split(".").pop()?.toLowerCase() || "jpg";

        const mimeType =
            asset.mimeType ||
            (extension === "png" ? "image/png" : "image/jpeg");

        onChange({
            uri: asset.uri,
            name: asset.fileName || `avatar-${Date.now()}.${extension}`,
            type: mimeType,
        });
    };


    const onSubmit = async (values: IUpdateProfile) => {
        try {
            await updateProfile(values).unwrap();

            router.back();
        } catch (error) {
            console.error("Failed to update profile", error);
        }
    };

    if (isProfileLoading) {
        return (
            <View
                className="flex-1 items-center justify-center"
                style={{ backgroundColor: theme.background }}
            >
                <ActivityIndicator
                    size="large"
                    color={PRIMARY}
                />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            className="flex-1"
            style={{ backgroundColor: theme.background }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerClassName="px-5 pt-14 pb-10"
            >
                {/* Header */}
                <View className="mb-8 flex-row items-center">
                    <Pressable
                        onPress={() => router.back()}
                        className="mr-4 h-11 w-11 items-center justify-center rounded-full"
                        style={({ pressed }) => ({
                            backgroundColor: theme.headerIconBackground,
                            opacity: pressed ? 0.6 : 1,
                        })}
                    >
                        <ArrowLeft
                            size={22}
                            color={theme.text}
                        />
                    </Pressable>

                    <Text
                        className="text-3xl font-extrabold"
                        style={{ color: theme.text }}
                    >
                        Редагування
                    </Text>
                </View>

                {/* Avatar */}
                <Controller
                    control={control}
                    name="avatar"
                    render={({ field: { onChange } }) => (
                        <View className="mb-8 items-center">
                            <Pressable
                                onPress={() => pickAvatar(onChange)}
                                className="relative"
                                style={({ pressed }) => ({
                                    opacity: pressed ? 0.75 : 1,
                                })}
                            >
                                <View
                                    className="h-32 w-32 overflow-hidden rounded-full border-4"
                                    style={{
                                        backgroundColor:
                                        theme.avatarBackground,
                                        borderColor: theme.card,
                                        shadowColor: "#000",
                                        shadowOffset: {
                                            width: 0,
                                            height: 6,
                                        },
                                        shadowOpacity:
                                            colorScheme === "dark"
                                                ? 0.3
                                                : 0.1,
                                        shadowRadius: 12,
                                        elevation: 4,
                                    }}
                                >
                                    {avatarUri ? (
                                        <Image
                                            source={{ uri: avatarUri }}
                                            className="h-full w-full"
                                        />
                                    ) : (
                                        <View className="h-full w-full items-center justify-center">
                                            <User
                                                size={52}
                                                color={theme.avatarIcon}
                                            />
                                        </View>
                                    )}
                                </View>

                                <View
                                    className="absolute bottom-0 right-0 h-11 w-11 items-center justify-center rounded-full border-4"
                                    style={{
                                        backgroundColor: PRIMARY,
                                        borderColor: theme.background,
                                    }}
                                >
                                    <Camera
                                        size={19}
                                        color="#111827"
                                    />
                                </View>
                            </Pressable>

                            <Text
                                className="mt-3 text-sm font-semibold"
                                style={{ color: theme.secondaryText }}
                            >
                                Змінити фото
                            </Text>
                        </View>
                    )}
                />

                {/* Personal information */}
                <Text
                    className="mb-3 text-lg font-bold"
                    style={{ color: theme.text }}
                >
                    Особиста інформація
                </Text>

                <View
                    className="rounded-[24px] p-4"
                    style={{ backgroundColor: theme.card }}
                >
                    <View>
                        <View className="mb-1 flex-row">
                            <Text className="text-sm font-nunito-semibold text-neutral-700 dark:text-[#D8DDE1]">
                                Ім&#39;я
                            </Text>
                        </View>

                        <Controller
                            control={control}
                            name="firstName"
                            rules={{
                                required: "Введіть ім'я",
                                minLength: {
                                    value: 2,
                                    message:
                                        "Ім'я має містити мінімум 2 символи",
                                },
                            }}
                            render={({ field: { value, onChange, onBlur } }) => (
                                <>
                                    <Input
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        style={{
                                            backgroundColor:
                                            theme.inputBackground,
                                        }}
                                        placeholderTextColor={theme.mutedText}
                                    />

                                    {errors.firstName && (
                                        <View className="mt-1 flex-row items-center">
                                            <Text className="mr-1 text-xs font-nunito-semibold text-red-500">
                                                !
                                            </Text>
                                            <Text className="text-xs font-nunito-semibold text-red-500">
                                                {errors.firstName.message}
                                            </Text>
                                        </View>
                                    )}
                                </>
                            )}
                        />
                    </View>

                    <View
                        className="my-4 h-px"
                        style={{ backgroundColor: theme.divider }}
                    />

                    <View>
                        <View className="mb-1 flex-row">
                            <Text className="text-sm font-nunito-semibold text-neutral-700 dark:text-[#D8DDE1]">
                                Прізвище
                            </Text>
                        </View>

                        <Controller
                            control={control}
                            name="lastName"
                            rules={{
                                required: "Введіть прізвище",
                                minLength: {
                                    value: 2,
                                    message:
                                        "Прізвище має містити мінімум 2 символи",
                                },
                            }}
                            render={({ field: { value, onChange, onBlur } }) => (
                                <>
                                    <Input
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        style={{
                                            backgroundColor:
                                            theme.inputBackground,
                                        }}
                                        placeholderTextColor={theme.mutedText}
                                    />

                                    {errors.lastName && (
                                        <View className="mt-1 flex-row items-center">
                                            <Text className="mr-1 text-xs font-nunito-semibold text-red-500">
                                                !
                                            </Text>
                                            <Text className="text-xs font-nunito-semibold text-red-500">
                                                {errors.lastName.message}
                                            </Text>
                                        </View>
                                    )}
                                </>
                            )}
                        />
                    </View>


                    <View
                        className="my-4 h-px"
                        style={{ backgroundColor: theme.divider }}
                    />

                    <View>
                        <View className="mb-1 flex-row">
                            <Text className="text-sm font-nunito-semibold text-neutral-700 dark:text-[#D8DDE1]">
                                Номер телефону
                            </Text>
                        </View>

                        <Controller
                            control={control}
                            name="phone"
                            rules={{
                                required: "Введіть номер телефону",
                                pattern: {
                                    value: /^\+?[0-9\s\-()]{10,18}$/,
                                    message: "Некоректний номер телефону",
                                },
                            }}
                            render={({ field: { value, onChange, onBlur } }) => (
                                <>
                                    <Input
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        keyboardType="phone-pad"
                                        style={{
                                            backgroundColor:
                                            theme.inputBackground,
                                        }}
                                        placeholderTextColor={theme.mutedText}
                                    />

                                    {errors.phone && (
                                        <View className="mt-1 flex-row items-center">
                                            <Text className="mr-1 text-xs font-nunito-semibold text-red-500">
                                                !
                                            </Text>
                                            <Text className="text-xs font-nunito-semibold text-red-500">
                                                {errors.phone.message}
                                            </Text>
                                        </View>
                                    )}
                                </>
                            )}
                        />
                    </View>
                </View>

                {/* Save button */}
                <Button
                    disabled={isUpdating}
                    onPress={handleSubmit(onSubmit)}
                    className="mt-7 h-16 rounded-[20px] font-nunito transition-all duration-200"
                    style={{
                        backgroundColor: PRIMARY,
                    }}
                >
                    {isUpdating ? (
                        <ActivityIndicator className={"text-white dark:text-[#0B0D0F]"} size={"small"}/>
                    ) : (
                        <>
                            <Check size={20} color={theme.buttonText} />
                            <Text className="ml-2 text-base font-bold">
                                Зберегти зміни
                            </Text>
                        </>
                    )}
                </Button>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}