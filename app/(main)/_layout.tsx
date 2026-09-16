import { Platform } from "react-native";
import IOSNativeTabs from "@/components/ui/custom/iosNativeTabs";
import AndroidTabs from "@/components/ui/custom/androidTabs";

export default function TabLayout() {
    if (Platform.OS === "ios") {
        return <IOSNativeTabs />;
    }

    return <AndroidTabs />;
}