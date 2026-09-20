import {Stack, Tabs} from 'expo-router';

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="CartScreen"
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="ProductScreen"
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="HomeScreen"
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="RestaurantScreen"
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="SauceScreen"
                options={{ headerShown: false }}
            />
        </Stack>
    );
}
