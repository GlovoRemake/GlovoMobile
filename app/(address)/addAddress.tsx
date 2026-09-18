import React, {
    useCallback,
    useEffect, useReducer,
    useRef,
    useState,
} from "react";

import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
    useColorScheme,
} from "react-native";

import MapView, {
    MapPressEvent,
    PROVIDER_GOOGLE,
    Region,
} from "react-native-maps";

import * as Location from "expo-location";

import {
    ArrowLeft,
    Check,
    Crosshair,
    MapPin,
    Search,
} from "lucide-react-native";

import { router } from "expo-router";

import { useDispatch } from "react-redux";
import {useAddAddressMutation} from "@/store/service/apiAddress";

const PRIMARY = "#FFC244";

const DEFAULT_REGION: Region = {
    latitude: 50.6199,
    longitude: 26.2516,
    latitudeDelta: 0.012,
    longitudeDelta: 0.012,
};

const COLORS = {
    light: {
        background: "#F8F9FA",
        surface: "#FFFFFF",
        text: "#111827",
        secondary: "#6B7280",
        muted: "#9CA3AF",
        border: "#E5E7EB",
        input: "#F3F4F6",
    },

    dark: {
        background: "#000000",
        surface: "#18181B",
        text: "#FFFFFF",
        secondary: "#A1A1AA",
        muted: "#71717A",
        border: "#27272A",
        input: "#27272A",
    },
};

export default function addNewAddress() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [addAddress, {isLoading}] = useAddAddressMutation();


    const scheme = useColorScheme();

    const colors =
        scheme === "dark"
            ? COLORS.dark
            : COLORS.light;

    const dispatch = useDispatch();

    const mapRef = useRef<MapView>(null);

    const [region, setRegion] =
        useState<Region>(DEFAULT_REGION);

    const [address, setAddress] =
        useState<string>("Визначення адреси...");

    const [city, setCity] =
        useState<string>("");

    const [loadingAddress, setLoadingAddress] =
        useState(false);

    const [loadingLocation, setLoadingLocation] =
        useState(false);

    const [locationPermission, setLocationPermission] =
        useState(false);

    const [addressTitle, setAddressTitle] =
        useState("Дім");

    const [showTitleInput, setShowTitleInput] =
        useState(false);

    /*
     * Reverse geocoding
     *
     * Беремо координати центру карти
     * і перетворюємо їх у адресу.
     */
    const getAddressFromCoordinates =
        useCallback(
            async (
                latitude: number,
                longitude: number
            ) => {
                try {
                    setLoadingAddress(true);

                    const result =
                        await Location.reverseGeocodeAsync(
                            {
                                latitude,
                                longitude,
                            }
                        );

                    if (!result.length) {
                        setAddress(
                            "Не вдалося визначити адресу"
                        );

                        setCity("");

                        return;
                    }

                    const location = result[0];

                    const street =
                        location.street ?? "";

                    const streetNumber =
                        location.streetNumber ?? "";

                    const district =
                        location.district ?? "";

                    const cityName =
                        location.city ??
                        location.subregion ??
                        "";

                    let formattedAddress = "";

                    if (street) {
                        formattedAddress = street;

                        if (streetNumber) {
                            formattedAddress +=
                                `, ${streetNumber}`;
                        }
                    } else if (
                        district
                    ) {
                        formattedAddress =
                            district;
                    } else {
                        formattedAddress =
                            "Обрана точка на карті";
                    }

                    setAddress(
                        formattedAddress
                    );

                    setCity(cityName);
                } catch (error) {
                    console.error(
                        "Reverse geocoding error:",
                        error
                    );

                    setAddress(
                        "Не вдалося визначити адресу"
                    );
                } finally {
                    setLoadingAddress(false);
                }
            },
            []
        );

    /*
     * Отримуємо поточну позицію користувача.
     */
    const getCurrentLocation =
        useCallback(async () => {
            try {
                setLoadingLocation(true);

                const {
                    status,
                } =
                    await Location.requestForegroundPermissionsAsync();

                if (
                    status !==
                    Location.PermissionStatus.GRANTED
                ) {
                    setLocationPermission(false);

                    return;
                }

                setLocationPermission(true);

                const current =
                    await Location.getCurrentPositionAsync(
                        {
                            accuracy:
                            Location.Accuracy.High,
                        }
                    );

                const nextRegion: Region = {
                    latitude:
                    current.coords
                        .latitude,

                    longitude:
                    current.coords
                        .longitude,

                    latitudeDelta:
                        0.012,

                    longitudeDelta:
                        0.012,
                };

                setRegion(nextRegion);

                mapRef.current?.animateToRegion(
                    nextRegion,
                    500
                );

                await getAddressFromCoordinates(
                    current.coords.latitude,
                    current.coords.longitude
                );
            } catch (error) {
                console.error(
                    "Location error:",
                    error
                );
            } finally {
                setLoadingLocation(false);
            }
        }, [
            getAddressFromCoordinates,
        ]);

    /*
     * При відкритті сторінки
     * одразу пробуємо отримати позицію.
     */
    useEffect(() => {
        getCurrentLocation();
    }, [getCurrentLocation]);

    /*
     * Користувач закінчив рухати карту.
     *
     * Беремо координати ЦЕНТРУ карти.
     */
    const handleRegionChangeComplete = (
        nextRegion: Region
    ) => {
        setRegion(nextRegion);

        getAddressFromCoordinates(
            nextRegion.latitude,
            nextRegion.longitude
        );
    };

    /*
     * Якщо користувач натиснув
     * на карту — переміщуємо центр туди.
     */
    const handleMapPress = (
        event: MapPressEvent
    ) => {
        const coordinate =
            event.nativeEvent.coordinate;

        const nextRegion: Region = {
            ...region,

            latitude:
            coordinate.latitude,

            longitude:
            coordinate.longitude,
        };

        mapRef.current?.animateToRegion(
            nextRegion,
            300
        );
    };

    const handleConfirm = async () => {
        if (
            !region.latitude ||
            !region.longitude
        ) {
            return;
        }

        try {
            await addAddress({
                address,
                latitude: region.latitude,
                longitude: region.longitude,
            }).unwrap()

            router.back();
        } catch (error) {}

    };

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor:
                    colors.background,
                },
            ]}
        >
            {/* MAP */}

            <MapView
                ref={mapRef}
                provider={
                    Platform.OS === "android"
                        ? PROVIDER_GOOGLE
                        : undefined
                }
                style={StyleSheet.absoluteFill}
                initialRegion={
                    DEFAULT_REGION
                }
                onRegionChangeComplete={
                    handleRegionChangeComplete
                }
                onPress={handleMapPress}
                showsUserLocation={
                    locationPermission
                }
                showsMyLocationButton={false}
                showsCompass={false}
                toolbarEnabled={false}
            />

            {/* TOP GRADIENT-LIKE AREA */}

            <View
                pointerEvents="box-none"
                style={styles.topContainer}
            >
                {/* BACK */}

                <Pressable
                    onPress={() =>
                        router.back()
                    }
                    style={[
                        styles.circleButton,
                        {
                            backgroundColor:
                            colors.surface,
                        },
                    ]}
                >
                    <ArrowLeft
                        size={23}
                        color={colors.text}
                        strokeWidth={2.4}
                    />
                </Pressable>
            </View>

            {/* CENTER PIN */}

            <View
                pointerEvents="none"
                style={styles.centerPinContainer}
            >
                <View
                    style={[
                        styles.pinShadow,
                        {
                            backgroundColor:
                                "rgba(0,0,0,0.18)",
                        },
                    ]}
                />

                <View
                    style={[
                        styles.pin,
                        {
                            backgroundColor:
                            PRIMARY,
                        },
                    ]}
                >
                    <MapPin
                        size={27}
                        color="#111111"
                        fill="#111111"
                        strokeWidth={2}
                    />
                </View>

                <View
                    style={[
                        styles.pinTip,
                        {
                            borderTopColor:
                            PRIMARY,
                        },
                    ]}
                />
            </View>

            {/* MY LOCATION */}

            <Pressable
                onPress={
                    getCurrentLocation
                }
                style={[
                    styles.locationButton,
                    {
                        backgroundColor:
                        colors.surface,
                    },
                ]}
            >
                {loadingLocation ? (
                    <ActivityIndicator
                        size="small"
                        color={colors.text}
                    />
                ) : (
                    <Crosshair
                        size={22}
                        color={colors.text}
                        strokeWidth={2.2}
                    />
                )}
            </Pressable>

            {/* BOTTOM CARD */}

            <KeyboardAvoidingView
                behavior={
                    Platform.OS === "ios"
                        ? "padding"
                        : undefined
                }
                style={styles.bottomContainer}
                pointerEvents="box-none"
            >
                <View
                    style={[
                        styles.bottomCard,
                        {
                            backgroundColor:
                            colors.surface,
                        },
                    ]}
                >
                    {/* HANDLE */}

                    <View
                        style={[

                            styles.handle,
                            {
                                backgroundColor:
                                    scheme ===
                                    "dark"
                                        ? "#52525B"
                                        : "#D1D5DB",
                            },
                        ]}
                    />

                    <Text
                        style={[
                            styles.title,
                            {
                                color:
                                colors.text,
                            },
                        ]}
                    >
                        Куди доставити?
                    </Text>

                    <Text
                        style={[
                            styles.description,
                            {
                                color:
                                colors.secondary,
                            },
                        ]}
                    >
                        Перемістіть карту так,
                        щоб pin був точно над
                        потрібним місцем
                    </Text>

                    {/* ADDRESS */}

                    <View
                        style={[
                            styles.addressBox,
                            {
                                backgroundColor:
                                colors.input,
                            },
                        ]}
                    >
                        <View
                            style={[
                                styles.addressIcon,
                                {
                                    backgroundColor:
                                        scheme ===
                                        "dark"
                                            ? "#3A321E"
                                            : "#FFF4D6",
                                },
                            ]}
                        >
                            <MapPin
                                size={21}
                                color={
                                    PRIMARY
                                }
                            />
                        </View>

                        <View
                            style={
                                styles.addressContent
                            }
                        >
                            <Text
                                style={[
                                    styles.addressLabel,
                                    {
                                        color:
                                        colors.secondary,
                                    },
                                ]}
                            >
                                Адреса
                            </Text>

                            {loadingAddress ? (
                                <View className="mt-1 flex-row items-center">
                                    <ActivityIndicator
                                        size="small"
                                        color={
                                            PRIMARY
                                        }
                                    />

                                    <Text
                                        style={{
                                            color:
                                            colors.secondary,
                                            marginLeft: 8,
                                        }}
                                    >
                                        Визначення...
                                    </Text>
                                </View>
                            ) : (
                                <>
                                    <Text
                                        style={[
                                            styles.addressText,
                                            {
                                                color:
                                                colors.text,
                                            },
                                        ]}
                                        numberOfLines={
                                            2
                                        }
                                    >
                                        {
                                            address
                                        }
                                    </Text>

                                    {city ? (
                                        <Text
                                            style={[
                                                styles.cityText,
                                                {
                                                    color:
                                                    colors.secondary,
                                                },
                                            ]}
                                        >
                                            {
                                                city
                                            }
                                        </Text>
                                    ) : null}
                                </>
                            )}
                        </View>
                    </View>

                    {/* CONFIRM */}

                    <Pressable
                        onPress={
                            handleConfirm
                        }
                        disabled={
                            loadingAddress || isLoading
                        }
                        style={[
                            styles.confirmButton,
                            {
                                backgroundColor:
                                    loadingAddress || isLoading
                                        ? scheme ===
                                        "dark"
                                            ? "#3F3F46"
                                            : "#E5E7EB"
                                        : PRIMARY,
                            },
                        ]}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" />
                        ) : (
                            <Text
                                style={{
                                    color:
                                        loadingAddress
                                            ? colors.muted
                                            : "#111111",
                                }}
                                className="text-base font-bold"
                            >
                                Підтвердити адресу
                            </Text>
                        )}
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    topContainer: {
        position: "absolute",
        top: 55,
        left: 16,
        right: 16,

        flexDirection: "row",
        alignItems: "center",

        gap: 10,
    },

    circleButton: {
        width: 48,
        height: 48,

        borderRadius: 24,

        alignItems: "center",
        justifyContent: "center",

        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 10,
        shadowOffset: {
            width: 0,
            height: 4,
        },

        elevation: 5,
    },

    searchButton: {
        flex: 1,

        height: 48,

        borderRadius: 24,

        paddingHorizontal: 16,

        flexDirection: "row",
        alignItems: "center",

        shadowColor: "#000",
        shadowOpacity: 0.12,
        shadowRadius: 10,
        shadowOffset: {
            width: 0,
            height: 4,
        },

        elevation: 5,
    },

    searchText: {
        marginLeft: 9,
        fontSize: 14,
        fontWeight: "500",
    },

    centerPinContainer: {
        position: "absolute",

        left: "50%",
        top: "43%",

        marginLeft: -23,
        marginTop: -50,

        alignItems: "center",
    },

    pin: {
        width: 46,
        height: 46,

        borderRadius: 23,

        alignItems: "center",
        justifyContent: "center",

        borderWidth: 3,
        borderColor: "#FFFFFF",

        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 8,
        shadowOffset: {
            width: 0,
            height: 4,
        },

        elevation: 8,
    },

    pinTip: {
        width: 0,
        height: 0,

        borderLeftWidth: 7,
        borderRightWidth: 7,
        borderTopWidth: 10,

        borderLeftColor:
            "transparent",
        borderRightColor:
            "transparent",

        marginTop: -1,
    },

    pinShadow: {
        position: "absolute",

        width: 18,
        height: 7,

        borderRadius: 10,

        bottom: -17,
    },

    locationButton: {
        position: "absolute",

        right: 18,
        bottom: 365,

        width: 48,
        height: 48,

        borderRadius: 24,

        alignItems: "center",
        justifyContent: "center",

        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 10,
        shadowOffset: {
            width: 0,
            height: 4,
        },

        elevation: 6,
    },

    bottomContainer: {
        position: "absolute",

        left: 0,
        right: 0,
        bottom: 0,

        paddingHorizontal: 10,
        paddingBottom: 10,
    },

    bottomCard: {
        borderRadius: 28,

        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 28,

        marginBottom: 12,

        shadowColor: "#000",
        shadowOpacity: 0.18,
        shadowRadius: 20,
        shadowOffset: {
            width: 0,
            height: -5,
        },

        elevation: 12,
    },

    handle: {
        width: 38,
        height: 4,

        borderRadius: 4,

        alignSelf: "center",

        marginBottom: 17,
    },

    title: {
        fontSize: 23,
        fontWeight: "800",
    },

    description: {
        fontSize: 13,
        lineHeight: 18,

        marginTop: 5,
        marginBottom: 14,
    },

    addressBox: {
        borderRadius: 18,

        padding: 12,

        flexDirection: "row",
        alignItems: "center",
    },

    addressIcon: {
        width: 44,
        height: 44,

        borderRadius: 14,

        alignItems: "center",
        justifyContent: "center",
    },

    addressContent: {
        flex: 1,

        marginLeft: 12,
    },

    addressLabel: {
        fontSize: 11,
        fontWeight: "500",
    },

    addressText: {
        marginTop: 2,

        fontSize: 15,
        fontWeight: "700",
    },

    cityText: {
        marginTop: 2,

        fontSize: 12,
    },

    inputContainer: {
        minHeight: 50,

        borderRadius: 15,

        borderWidth: 1,

        marginTop: 10,

        paddingHorizontal: 14,

        flexDirection: "row",
        alignItems: "center",
    },

    input: {
        flex: 1,

        fontSize: 14,

        minHeight: 48,
    },

    changeTitleButton: {
        marginTop: 12,
        alignSelf: "flex-start",
    },

    confirmButton: {
        height: 54,

        borderRadius: 17,

        alignItems: "center",
        justifyContent: "center",

        marginTop: 14,
    },
});