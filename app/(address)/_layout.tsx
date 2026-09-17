import { Stack } from 'expo-router';

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="addAddress"
                options={{ headerShown: false }}
            />
        </Stack>
    );
}
