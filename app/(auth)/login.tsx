import { View, Text, Pressable, ScrollView } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
    return (
        <View className="flex-1 bg-white dark:bg-[#0B0D0F]">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                {/* Hero */}
                <View className="h-[310px] overflow-hidden bg-[#FFC244] px-6 pt-14 dark:bg-[#171A1D]">
                    {/* Decorative circles */}
                    <View className="absolute -left-8 top-24 h-20 w-20 rounded-full bg-[#F5A623] dark:bg-[#FFC244] dark:opacity-80" />

                    <View className="absolute -right-8 top-12 h-24 w-24 rounded-full bg-[#FF8A65] dark:bg-[#00A082] dark:opacity-70" />

                    <View className="absolute left-1/2 top-20 h-40 w-40 -translate-x-1/2 rounded-full bg-white/10 dark:bg-[#FFC244]/10" />

                    <View className="flex-1 items-center justify-center">
                        <Text className="font-nunito mt-3 text-[38px] font-extrabold tracking-tight text-[#00A082] dark:text-[#FFC244]">
                            Glovo
                        </Text>

                        <Text className="mt-1 text-sm font-medium text-[#00A082]/60 dark:text-white/50">
                            Ласкаво просимо назад
                        </Text>
                    </View>
                </View>

                {/* Main card */}
                <View className="-mt-8 mx-2 rounded-[30px] bg-white px-6 pb-10 pt-7 dark:bg-[#121518]">
                    {/* Heading */}
                    <View className="items-center">
                        <Text className="text-[29px] font-extrabold tracking-tight text-neutral-950 dark:text-white">
                            Вітаємо!
                        </Text>

                        <Text className="mt-1 text-center text-[15px] text-neutral-500 dark:text-[#8B9298]">
                            Почнемо з email
                        </Text>
                    </View>

                    {/* Email */}
                    <View className="mt-7">
                        <View className="mb-2 flex-row">
                            <Text className="text-sm font-semibold text-neutral-700 dark:text-[#D8DDE1]">
                                Email
                            </Text>
                        </View>

                        <Input
                            className="h-14 flex-1 rounded-xl border-neutral-200 bg-white px-4 text-base text-neutral-950 dark:border-[#292E33] dark:bg-[#1B1F23] dark:text-white"
                            keyboardType="email-address"
                            placeholder="example@gmail.com"
                            placeholderTextColor="#A3A3A3"
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Continue */}
                    <Button className="mt-4 h-14 rounded-full bg-[#00A082] dark:bg-[#00A082]">
                        <Text className="text-[16px] font-bold text-white">
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
                    <Pressable className="h-14 flex-row items-center justify-center rounded-full border border-neutral-200 bg-white dark:border-[#30363B] dark:bg-[#1B1F23]">
                        <Text className="text-[16px] font-bold text-neutral-900 dark:text-[#F2F4F5]">
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
                </View>
            </ScrollView>
        </View>
    );
}
