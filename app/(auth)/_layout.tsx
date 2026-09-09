import { Stack } from "expo-router";

export default function AuthLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,

                // Прибираємо стандартний swipe-back
                gestureEnabled: false,

                // Власна анімація
                animation: "fade",
                animationDuration: 300,

                contentStyle: {
                    backgroundColor: "#FFC244",
                },
            }}
        />
    );
}