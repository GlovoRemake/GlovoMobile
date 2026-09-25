import { Pressable, View, Text } from "react-native";
import { Check } from "lucide-react-native";
import { GREEN } from "@/components/food/theme";

type PaymentOptionProps = {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    selected: boolean;
    onPress: () => void;
    darkMode?: boolean;
};

export default function PaymentOption({
                                          title,
                                          subtitle,
                                          icon,
                                          selected,
                                          onPress,
                                          darkMode = false,
                                      }: PaymentOptionProps) {
    const colors = {
        border: selected ? GREEN : darkMode ? "#374151" : "#E5E7EB",
        background: selected
            ? `${GREEN}10`
            : darkMode
                ? "#1F2937"
                : "#FFFFFF",
        iconBackground: selected
            ? `${GREEN}20`
            : darkMode
                ? "#374151"
                : "#F3F4F6",
        title: darkMode ? "#F9FAFB" : "#111827",
        subtitle: darkMode ? "#9CA3AF" : "#6B7280",
        radioBorder: selected ? GREEN : darkMode ? "#6B7280" : "#D1D5DB",
    };

    return (
        <Pressable
            onPress={onPress}
            className="flex-row items-center rounded-2xl border p-3"
            style={{
                borderColor: colors.border,
                backgroundColor: colors.background,
            }}
        >
            <View
                className="mr-3 h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: colors.iconBackground }}
            >
                {icon}
            </View>

            <View className="flex-1">
                <Text
                    className="text-sm font-bold"
                    style={{ color: colors.title }}
                >
                    {title}
                </Text>

                <Text
                    className="mt-0.5 text-xs"
                    style={{ color: colors.subtitle }}
                >
                    {subtitle}
                </Text>
            </View>

            <View
                className="h-6 w-6 items-center justify-center rounded-full border-2"
                style={{
                    borderColor: colors.radioBorder,
                    backgroundColor: selected ? GREEN : "transparent",
                }}
            >
                {selected && (
                    <Check
                        size={14}
                        color="#FFFFFF"
                        strokeWidth={3}
                    />
                )}
            </View>
        </Pressable>
    );
}