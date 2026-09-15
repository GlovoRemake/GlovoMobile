import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useColorScheme } from "react-native";

const GLOVO_COLORS = {
    yellow: "#FFC244",
    orange: "#F5A623",
};

const THEME_COLORS = {
    light: {
        text: "#1A1A1A",
        background: "#FFFFFF",
        inactive: "#9A9A9A",
        indicator: "#FFF1CC",
    },

    dark: {
        text: "#FFFFFF",
        background: "#121212",
        inactive: "#777777",
        indicator: "#3A2D16",
    },
};

export default function IOSNativeTabs() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const colors = isDark ? THEME_COLORS.dark : THEME_COLORS.light;

    return (
        <NativeTabs
            activeIndicatorColor={colors.indicator}
            tintColor={GLOVO_COLORS.orange}

            labelStyle={{
                color: colors.inactive,
                fontSize: 10,
                fontWeight: "600",
                fontFamily: "Nunito"
            }}

            barTintColor={colors.background}
            unselectedItemTintColor={colors.inactive}
        >
            {/* ===== ГОЛОВНА ===== */}
            <NativeTabs.Trigger name="index">
                <NativeTabs.Trigger.Label>
                    Головна
                </NativeTabs.Trigger.Label>

                <NativeTabs.Trigger.Icon
                    sf={{
                        default: "house",
                        selected: "house.fill",
                    }}
                    md={{
                        default: "home",
                        selected: "home",
                    }}
                />
            </NativeTabs.Trigger>

            {/* ===== СПРОБУВАТИ ===== */}
            <NativeTabs.Trigger name="search">
                <NativeTabs.Trigger.Label>
                    Спробувати
                </NativeTabs.Trigger.Label>

                <NativeTabs.Trigger.Icon
                    sf={{
                        default: "magnifyingglass",
                        selected: "magnifyingglass",
                    }}
                    md={{
                        default: "search",
                        selected: "search",
                    }}
                />
            </NativeTabs.Trigger>

            {/* ===== ЗАМОВЛЕННЯ ===== */}
            <NativeTabs.Trigger name="orders">
                <NativeTabs.Trigger.Label>
                    Замовлення
                </NativeTabs.Trigger.Label>

                <NativeTabs.Trigger.Icon
                    sf={{
                        default: "bag",
                        selected: "bag.fill",
                    }}
                    md={{
                        default: "shopping_bag",
                        selected: "shopping_bag",
                    }}
                />
            </NativeTabs.Trigger>

            {/* ===== ПРОФІЛЬ ===== */}
            <NativeTabs.Trigger name="profile">
                <NativeTabs.Trigger.Label>
                    Профіль
                </NativeTabs.Trigger.Label>

                <NativeTabs.Trigger.Icon
                    sf={{
                        default: "person",
                        selected: "person.fill",
                    }}
                    md={{
                        default: "person",
                        selected: "person",
                    }}
                />
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}