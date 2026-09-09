import {View, Text, Pressable, ScrollView, Platform, KeyboardAvoidingView} from "react-native";
import * as WebBrowser from "expo-web-browser";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { router } from 'expo-router';
import {AuthHero} from "@/components/ui/custom/authHero";
import {AuthCard} from "@/components/ui/custom/authCard";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
    return (
        <View className="flex-1 bg-white dark:bg-[#0B0D0F]">

            <AuthHero />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{
                        flexGrow: 1,
                        paddingTop: 278,
                        paddingBottom: 20,
                    }}
                    className="z-10"
                >
                    <AuthCard>
                        {/* Heading */}
                        <View className="items-center">
                            <Text className="text-[29px] font-nunito-extrabold tracking-tight text-neutral-950 dark:text-white">
                                Вітаємо!
                            </Text>

                            <Text className="mt-1 text-center text-[15px] text-neutral-500 dark:text-[#8B9298]">
                                Почнемо з email
                            </Text>
                        </View>

                        {/* Email */}
                        <View className="mt-7">
                            <View className="mb-2 flex-row">
                                <Text className="text-sm font-nunito-semibold text-neutral-700 dark:text-[#D8DDE1]">
                                    Email
                                </Text>
                            </View>

                            <Input
                                className="h-14 flex-1 border-neutral-200 bg-white px-4 text-neutral-950 dark:border-[#292E33] dark:bg-[#1B1F23] dark:text-white"
                                keyboardType="email-address"
                                placeholder="example@gmail.com"
                                placeholderTextColor="#A3A3A3"
                                autoCapitalize="none"
                                autoComplete={"email"}
                            />
                        </View>

                        {/* Continue */}
                        <Button className="mt-4 h-14 rounded-full bg-[#00A082] dark:bg-[#00A082] dark:active:bg-[#00A082]/30">
                            <Text className="text-[16px] font-nunito-bold text-white">
                                Продовжити
                            </Text>
                        </Button>

                        {/* Divider */}
                        <View className="my-6 flex-row items-center">
                            <View className="h-[1px] flex-1 bg-neutral-200 dark:bg-[#292E33]" />

                            <Text className="mx-4 text-[14px] text-neutral-400 dark:text-[#686F76]">
                                або
                            </Text>

                            <View className="h-[1px] flex-1 bg-neutral-200 dark:bg-[#292E33]" />
                        </View>

                        {/* Password */}
                        <Pressable onPress={() => router.push('/(auth)/loginWithPassword')} className="h-14 flex-row items-center justify-center rounded-full border border-neutral-200 bg-white dark:border-[#30363B] dark:bg-[#1B1F23]">
                            <Text className="text-[16px] font-nunito-bold text-neutral-900 dark:text-[#F2F4F5]">
                                Увійти за допомогою пароля
                            </Text>
                        </Pressable>

                        {/* Terms */}
                        <View className="mt-4 px-1">
                            <Text className="text-center text-[11px] leading-4 text-neutral-400 dark:text-[#686F76]">
                                Продовжуючи, ви автоматично погоджуєтесь з{" "}
                                <Text className="underline dark:text-[#9CA3A8]">
                                    Умовами та положеннями
                                </Text>{" "}
                                та{" "}
                                <Text className="underline dark:text-[#9CA3A8]">
                                    Політикою конфіденційності
                                </Text>
                                .
                            </Text>
                        </View>
                    </AuthCard>
                </ScrollView>
            </ScrollView>
        </View>
    );
}
