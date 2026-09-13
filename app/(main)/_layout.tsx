import { NativeTabs } from "expo-router/unstable-native-tabs";
import { DynamicColorIOS } from "react-native";

const ACTIVE_TINT = DynamicColorIOS({
    light: "#111111",
    dark: "#FFFFFF",
});

export default function TabLayout() {
    return (
        <NativeTabs
            iconColor={{
                default: ACTIVE_TINT,
                selected: ACTIVE_TINT,
            }}
            labelStyle={{ color: ACTIVE_TINT }}
        >
            <NativeTabs.Trigger name="index">
                <NativeTabs.Trigger.Label>Головна</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon
                    renderingMode="template"
                    src={{
                        default: require("../../assets/ic_house_foreground.png"),
                        selected: require("../../assets/ic_house_foreground_filled.png"),
                    }}
                />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="search">
                <NativeTabs.Trigger.Label>Спробувати</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon
                    renderingMode="template"
                    src={{
                        default: require("../../assets/ic_magnifying_glass_foreground.png"),
                        selected: require("../../assets/ic_magnifying_glass_foreground_filled.png"),
                    }}
                />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="orders">
                <NativeTabs.Trigger.Label>Замовлення</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon
                    renderingMode="template"
                    src={{
                        default: require("../../assets/ic_bag_foreground.png"),
                        selected: require("../../assets/ic_bag_foreground_filled.png"),
                    }}
                />
            </NativeTabs.Trigger>

            <NativeTabs.Trigger name="profile">
                <NativeTabs.Trigger.Label>Профіль</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon
                    renderingMode="template"
                    src={{
                        default: require("../../assets/ic_person_foreground.png"),
                        selected: require("../../assets/ic_person_foreground_filled.png"),
                    }}
                />
            </NativeTabs.Trigger>
        </NativeTabs>
    );
}