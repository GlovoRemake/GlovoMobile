import { View, Text, Pressable, ScrollView } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
    return (
        <View className="flex-1 bg-white">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <View className="h-[310px] bg-[#FFC244] px-6 pt-14 fle items-center justify-center">
                    <View className="absolute -left-8 top-24 h-20 w-20 rounded-full bg-[#F5A623]" />
                    <View className="absolute -right-8 top-12 h-24 w-24 rounded-full bg-[#FF8A65]" />

                    <View className="items-center justify-center">
                        <Text className="font-nunito mt-3 text-[34px] font-extrabold tracking-tight text-[#00A082]">
                            Glovo
                        </Text>
                    </View>
                </View>

                {/* Main card */}
                <View className="-mt-8 mx-2 rounded-t-[28px] bg-white px-6 pb-8 pt-6">
                    {/* Heading */}
                    <View className="items-center">
                        <Text className="text-[29px] font-extrabold tracking-tight text-neutral-950">
                            Вітаємо!
                        </Text>

                        <Text className="mt-1 text-center text-[15px] text-neutral-500">
                            Почнемо з email
                        </Text>
                    </View>

                    {/* Phone */}
                    <View className="mt-6">
                        <View className="mb-2 flex-row">
                            <Text className="w-[125px] text-sm font-semibold text-neutral-700">
                                Email
                            </Text>
                        </View>

                        <View className="flex-row gap-3">
                            {/* Phone */}
                            <Input
                                className="h-14 flex-1 rounded-xl border-neutral-200 bg-white px-4 text-base"
                                keyboardType="email-address"
                                placeholder="example@gmail.com"
                                placeholderTextColor="#A3A3A3"
                            />
                        </View>
                    </View>

                    {/* Continue */}
                    <Button className="mt-4 h-14 rounded-full bg-[#00A082]">
                        <Text className="text-[16px] font-bold text-white">
                            Продовжити
                        </Text>
                    </Button>

                    {/* Divider */}
                    <View className="my-6 flex-row items-center">
                        <View className="h-[1px] flex-1 bg-neutral-200" />

                        <Text className="mx-4 text-[14px] text-neutral-400">
                            або
                        </Text>

                        <View className="h-[1px] flex-1 bg-neutral-200" />
                    </View>

                    {/* Google */}
                    <Pressable className="h-14 flex-row items-center justify-center rounded-full border border-neutral-200 bg-white">
                        <Text className="text-[16px] font-bold text-neutral-900">
                            Увійти за допомогою пароля
                        </Text>
                    </Pressable>

                    {/* Terms */}
                    <View className="mt-3 px-1">
                        <Text className="text-center text-[11px] leading-4 text-neutral-400">
                            Продовжуючи, ви автоматично погоджуєтесь з{" "}
                            <Text className="underline">
                                Умовами та положеннями
                            </Text>{" "}
                            та{" "}
                            <Text className="underline">
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
