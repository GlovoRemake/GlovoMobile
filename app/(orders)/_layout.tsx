import { Stack } from 'expo-router';

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="cart"
                options={{ headerShown: false }}
            />
        </Stack>
    );
}
