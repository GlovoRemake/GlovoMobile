"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Pressable,
    ScrollView,
    Text,
    View,
    useColorScheme,
} from "react-native";

import {
    ChevronDown,
    ChevronUp,
    CircleAlert,
    MapPin,
    Package,
    Truck,
} from "lucide-react-native";

import {
    HubConnectionBuilder,
    LogLevel,
} from "@microsoft/signalr";

import { WebView } from "react-native-webview";

import APP_ENV from "@/utils/env";
import { getSecureStore } from "@/utils/secureStore";

import {
    useGetActiveOrdersQuery,
} from "@/store/service/apiOrder";

import { IOrder } from "@/types/Order/IOrder";
import { OrderStatus } from "@/types/Order/OrderStatus";
import {useGetAffiliateProductsQuery} from "@/store/service/apiAffiliate";

const SIGNALR_URL = `${APP_ENV.API_URL}/hubs/courier`;

type Coordinates = {
    latitude: number;
    longitude: number;
};

export default function ActiveOrders() {
    const scheme = useColorScheme();
    const dark = scheme === "dark";

    const {
        data: initialOrders = [],
        isLoading,
        isError,
    } = useGetActiveOrdersQuery();

    const [orders, setOrders] = useState<IOrder[]>([]);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const connectionRef = useRef<any>(null);

    const theme = useMemo(
        () => ({
            bg: dark ? "#09090B" : "#F7F7F8",
            card: dark ? "#121214" : "#FFFFFF",
            card2: dark ? "#18181B" : "#F1F1F3",
            border: dark ? "#27272A" : "#E4E4E7",

            text: dark ? "#FAFAFA" : "#18181B",
            muted: dark ? "#A1A1AA" : "#71717A",

            green: "#22C55E",
            greenBg: dark ? "#17261D" : "#EAF8EF",

            red: "#EF4444",
            redBg: dark ? "#301719" : "#FDECEC",

            orange: "#F59E0B",
            orangeBg: dark ? "#302611" : "#FFF7E6",
        }),
        [dark]
    );

    useEffect(() => {
        setOrders(initialOrders);
    }, [isLoading]);

    /*
     * =========================
     * SIGNALR
     * =========================
     */

    useEffect(() => {
        if (!orders.length) return;

        let cancelled = false;

        const connect = async () => {
            const token = getSecureStore("accessToken");

            if (!token || cancelled || connectionRef.current) {
                return;
            }

            const connection = new HubConnectionBuilder()
                .withUrl(SIGNALR_URL, {
                    accessTokenFactory: () =>
                        getSecureStore("accessToken") ?? "",
                })
                .withAutomaticReconnect([
                    0,
                    2000,
                    5000,
                    10000,
                    30000,
                ])
                .configureLogging(LogLevel.Warning)
                .build();

            connection.on("OrderStatusUpdated", (data) => {
                console.log(data);

                if (!data?.id || data?.status === undefined) {
                    return;
                }

                setOrders((prev) =>
                    prev
                        .map((order) =>
                            order.id === data.id
                                ? {
                                    ...order,
                                    status: data.status,
                                }
                                : order
                        )
                        .filter(
                            (order) =>
                                order.status !== OrderStatus.Completed &&
                                order.status !== OrderStatus.Cancelled
                        )
                );
            });

            connection.on("OrderUpdated", (data) => {
                if (!data?.id) {
                    return;
                }

                setOrders((prev) =>
                    prev
                        .map((order) =>
                            order.id === data.id
                                ? {
                                    ...order,
                                    ...data,
                                }
                                : order
                        )
                        .filter(
                            (order) =>
                                order.status !== OrderStatus.Completed &&
                                order.status !== OrderStatus.Cancelled
                        )
                );
            });

            connection.onreconnecting(() => {
                console.log(
                    "🟡 ACTIVE ORDERS SIGNALR RECONNECTING"
                );
            });

            connection.onreconnected(async () => {
                console.log(
                    "🟢 ACTIVE ORDERS SIGNALR RECONNECTED"
                );

                for (const order of orders) {
                    try {
                        await connection.invoke(
                            "JoinOrder",
                            order.id
                        );
                    } catch (error) {
                        console.log(
                            "JOIN ORDER ERROR:",
                            error
                        );
                    }
                }
            });

            connection.onclose(() => {
                console.log(
                    "🔴 ACTIVE ORDERS SIGNALR CLOSED"
                );

                connectionRef.current = null;
            });

            try {
                await connection.start();

                if (cancelled) {
                    await connection.stop();
                    return;
                }

                for (const order of orders) {
                    try {
                        await connection.invoke(
                            "JoinOrder",
                            order.id
                        );
                    } catch (error) {
                        console.log(
                            "JOIN ORDER ERROR:",
                            error
                        );
                    }
                }

                connectionRef.current = connection;

                console.log(
                    "🟢 ACTIVE ORDERS SIGNALR CONNECTED"
                );
            } catch (error) {
                console.log(
                    "ACTIVE ORDERS SIGNALR ERROR:",
                    error
                );
            }
        };

        connect();

        return () => {
            cancelled = true;

            const connection = connectionRef.current;

            connectionRef.current = null;

            if (connection) {
                connection.stop().catch(() => {});
            }
        };
    }, [orders.length]);

    if (isLoading) {
        return (
            <View className="mb-5">
                <Text
                    className="mb-3 text-[25px] font-extrabold"
                    style={{ color: theme.text }}
                >
                    Замовлення
                </Text>

                <View
                    className="h-28 items-center justify-center rounded-[22px] border"
                    style={{
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                    }}
                >
                    <ActivityIndicator
                        size="small"
                        color={theme.green}
                    />
                </View>
            </View>
        );
    }

    if (isError) {
        return null;
    }

    if (!orders.length) {
        return null;
    }

    return (
        <View className="mb-6">
            <Text
                className="mb-3 text-[25px] font-extrabold"
                style={{ color: theme.text }}
            >
                Замовлення
            </Text>

            <View className="gap-3">
                {/* eslint-disable-next-line react-hooks/refs */}
                {orders.map((order) => (
                    <ActiveOrderCard
                        key={order.id}
                        order={order}
                        expanded={expandedId === order.id}
                        onPress={() =>
                            setExpandedId((current) =>
                                current === order.id
                                    ? null
                                    : order.id
                            )
                        }
                        theme={theme}
                        connection={connectionRef.current}
                    />
                ))}
            </View>
        </View>
    );
}

/*
 * =========================
 * ORDER CARD
 * =========================
 */

function ActiveOrderCard({
                             order,
                             expanded,
                             onPress,
                             theme,
                             connection,
                         }: {
    order: IOrder;
    expanded: boolean;
    onPress: () => void;
    theme: any;
    connection: any;
}) {
    const isDelivering =
        order.status === OrderStatus.Delivering;

    return (
        <View
            className="overflow-hidden rounded-[22px] border"
            style={{
                backgroundColor: theme.card,
                borderColor: theme.border,
            }}
        >
            <Pressable
                onPress={onPress}
                className="p-4"
            >
                <View className="flex-row items-center">
                    <View
                        className="h-12 w-12 items-center justify-center rounded-[16px]"
                        style={{
                            backgroundColor:
                            theme.greenBg,
                        }}
                    >
                        {order.company.iconPath ? (
                            <Image
                                source={{
                                    uri: `${APP_ENV.API_IMAGE_MEDIUM_URL}${order.company.iconPath}`,
                                }}
                                className="h-12 w-12 rounded-[16px]"
                            />
                        ) : (
                            <Package
                                size={22}
                                color={theme.green}
                            />
                        )}
                    </View>

                    <View className="ml-3 flex-1">
                        <Text
                            className="text-[15px] font-extrabold"
                            style={{
                                color: theme.text,
                            }}
                            numberOfLines={1}
                        >
                            {order.company.name}
                        </Text>

                        <Text
                            className="mt-1 text-xs"
                            style={{
                                color: theme.muted,
                            }}
                            numberOfLines={1}
                        >
                            Замовлення #{order.id}
                        </Text>
                    </View>

                    <StatusBadge
                        status={order.status}
                        theme={theme}
                    />

                    {expanded ? (
                        <ChevronUp
                            size={20}
                            color={theme.muted}
                            className="ml-2"
                        />
                    ) : (
                        <ChevronDown
                            size={20}
                            color={theme.muted}
                            className="ml-2"
                        />
                    )}
                </View>

                <View className="mt-4 flex-row items-center">
                    <MapPin
                        size={16}
                        color={theme.muted}
                    />

                    <Text
                        className="ml-2 flex-1 text-xs font-medium"
                        style={{
                            color: theme.muted,
                        }}
                        numberOfLines={1}
                    >
                        {order.userLocation.address}
                    </Text>

                    <Text
                        className="ml-3 text-sm font-extrabold"
                        style={{
                            color: theme.text,
                        }}
                    >
                        {order.totalPrice.toFixed(2)} ₴
                    </Text>
                </View>
            </Pressable>

            {expanded && (
                <View
                    className="border-t px-4 pb-4 pt-4"
                    style={{
                        borderColor: theme.border,
                    }}
                >
                    <OrderDetails
                        order={order}
                        theme={theme}
                    />

                    {isDelivering && (
                        <DeliveryMap
                            order={order}
                            theme={theme}
                            connection={connection}
                        />
                    )}
                </View>
            )}
        </View>
    );
}

/*
 * =========================
 * DETAILS
 * =========================
 */

function OrderDetails({
                          order,
                          theme,
                      }: {
    order: IOrder;
    theme: any;
}) {
    return (
        <>
            <Text
                className="mb-3 text-[17px] font-extrabold"
                style={{
                    color: theme.text,
                }}
            >
                Статус замовлення
            </Text>

            <StatusProgress
                status={order.status}
                theme={theme}
            />

            <Text
                className="mb-3 mt-5 text-[17px] font-extrabold"
                style={{
                    color: theme.text,
                }}
            >
                Замовлені товари
            </Text>

            <View className="gap-2">
                {order.products.map(
                    (product, index) => (
                        <ProductRow
                            key={`${product.productId}-${index}`}
                            product={product}
                            affiliateId={order.affiliate.id}
                            theme={theme}
                        />
                    )
                )}
            </View>

            <View
                className="mt-4 rounded-[18px] p-4"
                style={{
                    backgroundColor: theme.card2,
                }}
            >
                <PriceRow
                    title="Товари"
                    value={order.productsPrice}
                    theme={theme}
                />

                <PriceRow
                    title="Доставка"
                    value={order.deliveryFee}
                    theme={theme}
                />

                {order.fee > 0 && (
                    <PriceRow
                        title="Комісія"
                        value={order.fee}
                        theme={theme}
                    />
                )}

                {order.tipAmount > 0 && (
                    <PriceRow
                        title={`Чайові (${order.tipPercent}%)`}
                        value={order.tipAmount}
                        theme={theme}
                    />
                )}

                <View
                    className="my-3 h-px"
                    style={{
                        backgroundColor:
                        theme.border,
                    }}
                />

                <View className="flex-row items-center justify-between">
                    <Text
                        className="text-base font-extrabold"
                        style={{
                            color: theme.text,
                        }}
                    >
                        Всього
                    </Text>

                    <Text
                        className="text-lg font-black"
                        style={{
                            color: theme.green,
                        }}
                    >
                        {order.totalPrice.toFixed(2)} ₴
                    </Text>
                </View>
            </View>
        </>
    );
}

/*
 * =========================
 * PRODUCTS
 * =========================
 */

function ProductRow({
                        affiliateId,
                        product,
                        theme,
                    }: {
    product: IOrder["products"][number];
    affiliateId: string;
    theme: any;
}) {
    const {data: affiliateProducts} = useGetAffiliateProductsQuery(affiliateId);


    const image =
        affiliateProducts?.find(x => x.id == product.productId)?.imagePath
            ? `${APP_ENV.API_IMAGE_MEDIUM_URL}${affiliateProducts?.find(x => x.id == product.productId)?.imagePath}`
            : null;

    const additionalsPrice =
        product.additionals?.reduce(
            (sum, additional) =>
                sum + additional.price,
            0
        ) ?? 0;

    const productTotal =
        (product.price + additionalsPrice) *
        product.count;

    return (
        <View
            className="flex-row items-center rounded-[18px] p-3"
            style={{
                backgroundColor: theme.card2,
            }}
        >
            {image ? (
                <Image
                    source={{ uri: image }}
                    className="h-14 w-14 rounded-[14px]"
                />
            ) : (
                <View
                    className="h-14 w-14 items-center justify-center rounded-[14px]"
                    style={{
                        backgroundColor:
                        theme.greenBg,
                    }}
                >
                    <Package
                        size={22}
                        color={theme.green}
                    />
                </View>
            )}

            <View className="ml-3 flex-1">
                <Text
                    className="text-sm font-bold"
                    style={{
                        color: theme.text,
                    }}
                    numberOfLines={2}
                >
                    {affiliateProducts?.find(x => x.id == product.productId)?.name}
                </Text>

                <Text
                    className="mt-1 text-xs"
                    style={{
                        color: theme.muted,
                    }}
                >
                    {product.count} ×{" "}
                    {(
                        product.price +
                        additionalsPrice
                    ).toFixed(2)} ₴
                </Text>
            </View>

            <Text
                className="text-sm font-extrabold"
                style={{
                    color: theme.text,
                }}
            >
                {productTotal.toFixed(2)} ₴
            </Text>
        </View>
    );
}

/*
 * =========================
 * STATUS
 * =========================
 */

function StatusProgress({
                            status,
                            theme,
                        }: {
    status: OrderStatus;
    theme: any;
}) {
    const steps = [
        {
            status: OrderStatus.Created,
            title: "Замовлення створено",
        },
        {
            status: OrderStatus.Cooking,
            title: "Готується",
        },
        {
            status: OrderStatus.WaitingCourier,
            title: "Готове до видачі",
        },
        {
            status: OrderStatus.Delivering,
            title: "Кур'єр доставляє",
        },
    ];

    const currentIndex =
        status === OrderStatus.Scheduled
            ? 0
            : steps.findIndex(
                (x) => x.status === status
            );

    return (
        <View className="gap-2">
            {steps.map((step, index) => {
                const active =
                    index <= currentIndex;

                return (
                    <View
                        key={step.status}
                        className="flex-row items-center"
                    >
                        <View
                            className="h-8 w-8 items-center justify-center rounded-full"
                            style={{
                                backgroundColor: active
                                    ? theme.greenBg
                                    : theme.card2,
                            }}
                        >
                            <View
                                className="h-2.5 w-2.5 rounded-full"
                                style={{
                                    backgroundColor:
                                        active
                                            ? theme.green
                                            : theme.muted,
                                }}
                            />
                        </View>

                        <Text
                            className="ml-3 text-sm font-semibold"
                            style={{
                                color: active
                                    ? theme.text
                                    : theme.muted,
                            }}
                        >
                            {step.title}
                        </Text>
                    </View>
                );
            })}
        </View>
    );
}

/*
 * =========================
 * LIVE DELIVERY MAP
 * =========================
 */

function DeliveryMap({
                         order,
                         theme,
                         connection,
                     }: {
    order: IOrder;
    theme: any;
    connection: any;
}) {
    const webRef = useRef<WebView>(null);
    const loadedRef = useRef(false);

    const [courierLocation, setCourierLocation] =
        useState<Coordinates | null>(null);

    const customer = parseCoordinates(
        order.userLocation.location
    );

    useEffect(() => {
        if (!connection) return;

        const handler = (data: any) => {
            if (data?.orderId !== order.id) {
                return;
            }

            if (
                typeof data.latitude !== "number" ||
                typeof data.longitude !== "number"
            ) {
                return;
            }

            const location = {
                latitude: data.latitude,
                longitude: data.longitude,
            };

            setCourierLocation(location);

            if (loadedRef.current) {
                webRef.current?.injectJavaScript(
                    `window.updateCourier(${location.latitude},${location.longitude});true;`
                );
            }
        };

        connection.on(
            "CourierLocationUpdated",
            handler
        );

        return () => {
            connection.off(
                "CourierLocationUpdated",
                handler
            );
        };
    }, [connection, order.id]);

    const html = useMemo(() => {
        if (!customer) return "";

        return `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport"
      content="width=device-width,
      initial-scale=1.0,
      maximum-scale=1.0">

<link
 rel="stylesheet"
 href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
/>

<script
 src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js">
</script>

<style>
html, body, #map {
    height: 100%;
    margin: 0;
    padding: 0;
}
</style>
</head>

<body>
<div id="map"></div>

<script>
var map = L.map('map', {
    zoomControl: false
}).setView(
    [${customer.latitude}, ${customer.longitude}],
    15
);

L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }
).addTo(map);

var ICON_PIN =
'<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>' +
'<circle cx="12" cy="10" r="3"/>';

var ICON_TRUCK =
'<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>' +
'<path d="M15 18H9"/>' +
'<path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>' +
'<circle cx="17" cy="18" r="2"/>' +
'<circle cx="7" cy="18" r="2"/>';

function icon(color, svgPaths) {
    return L.divIcon({
        className: '',
        html:
            '<div style="' +
            'width:38px;' +
            'height:38px;' +
            'border-radius:50%;' +
            'background:' + color + ';' +
            'border:3px solid #fff;' +
            'box-shadow:0 2px 6px rgba(0,0,0,.4);' +
            'display:flex;' +
            'align-items:center;' +
            'justify-content:center' +
            '">' +
            '<svg xmlns="http://www.w3.org/2000/svg"' +
            ' width="20" height="20"' +
            ' viewBox="0 0 24 24"' +
            ' fill="none"' +
            ' stroke="#fff"' +
            ' stroke-width="2"' +
            ' stroke-linecap="round"' +
            ' stroke-linejoin="round">' +
            svgPaths +
            '</svg></div>',
        iconSize: [38, 38],
        iconAnchor: [19, 19]
    });
}

var CLAT = ${customer.latitude};
var CLNG = ${customer.longitude};

L.marker(
    [CLAT, CLNG],
    {
        icon: icon(
            '${theme.red}',
            ICON_PIN
        )
    }
).addTo(map);

var courier = null;
var line = null;
var lastFetch = 0;

function drawRoute(points) {
    if (!line) {
        line = L.polyline(
            points,
            {
                color: '${theme.green}',
                weight: 5,
                opacity: 0.9
            }
        ).addTo(map);
    } else {
        line.setLatLngs(points);
    }

    map.fitBounds(
        line.getBounds(),
        {
            padding: [40, 40],
            animate: true
        }
    );
}

window.updateCourier = function(lat, lng) {

    if (!courier) {
        courier = L.marker(
            [lat, lng],
            {
                icon: icon(
                    '${theme.green}',
                    ICON_TRUCK
                )
            }
        ).addTo(map);
    } else {
        courier.setLatLng([lat, lng]);
    }

    var now = Date.now();

    if (
        line &&
        now - lastFetch < 10000
    ) {
        return;
    }

    lastFetch = now;

    if (!line) {
        drawRoute([
            [lat, lng],
            [CLAT, CLNG]
        ]);
    }

    var url =
        'https://router.project-osrm.org/route/v1/driving/' +
        lng + ',' + lat +
        ';' +
        CLNG + ',' + CLAT +
        '?overview=full&geometries=geojson';

    fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {

            if (
                data &&
                data.routes &&
                data.routes[0]
            ) {
                var points =
                    data.routes[0]
                        .geometry
                        .coordinates
                        .map(function(c) {
                            return [c[1], c[0]];
                        });

                drawRoute(points);
            }
        })
        .catch(function() {});
};
</script>
</body>
</html>
`;
    }, [
        customer?.latitude,
        customer?.longitude,
        theme.red,
        theme.green,
    ]);

    if (!customer) {
        return (
            <View
                className="mt-4 rounded-[20px] border p-4"
                style={{
                    backgroundColor: theme.card2,
                    borderColor: theme.border,
                }}
            >
                <CircleAlert
                    size={25}
                    color={theme.orange}
                />

                <Text
                    className="mt-2 text-sm font-bold"
                    style={{
                        color: theme.text,
                    }}
                >
                    Не вдалося визначити
                    координати доставки
                </Text>
            </View>
        );
    }

    return (
        <View
            className="mt-5 overflow-hidden rounded-[20px] border"
            style={{
                backgroundColor: theme.card,
                borderColor: theme.border,
            }}
        >
            <View className="flex-row items-center justify-between p-4">
                <View className="flex-1">
                    <Text
                        className="text-[17px] font-extrabold"
                        style={{
                            color: theme.text,
                        }}
                    >
                        Кур&#39;єр у дорозі
                    </Text>

                    <Text
                        className="mt-1 text-xs"
                        style={{
                            color: theme.muted,
                        }}
                    >
                        Геопозиція оновлюється
                        в реальному часі
                    </Text>
                </View>

                <Truck
                    size={22}
                    color={theme.green}
                />
            </View>

            <View
                style={{
                    height: 300,
                    width: "100%",
                }}
            >
                <WebView
                    ref={webRef}
                    originWhitelist={["*"]}
                    source={{ html }}
                    javaScriptEnabled
                    domStorageEnabled
                    nestedScrollEnabled
                    scrollEnabled={false}
                    onLoadEnd={() => {
                        loadedRef.current = true;

                        if (courierLocation) {
                            webRef.current?.injectJavaScript(
                                `window.updateCourier(${courierLocation.latitude},${courierLocation.longitude});true;`
                            );
                        }
                    }}
                />
            </View>
        </View>
    );
}

/*
 * =========================
 * STATUS BADGE
 * =========================
 */

function StatusBadge({
                         status,
                         theme,
                     }: {
    status: OrderStatus;
    theme: any;
}) {
    const color =
        status === OrderStatus.Delivering
            ? theme.green
            : status === OrderStatus.Cancelled
                ? theme.red
                : status === OrderStatus.Completed
                    ? theme.green
                    : theme.orange;

    const bg =
        status === OrderStatus.Delivering
            ? theme.greenBg
            : status === OrderStatus.Cancelled
                ? theme.redBg
                : theme.card2;

    return (
        <View
            className="rounded-full px-2.5 py-1.5"
            style={{
                backgroundColor: bg,
            }}
        >
            <Text
                className="text-[10px] font-extrabold"
                style={{
                    color,
                }}
            >
                {getStatusTitle(status)}
            </Text>
        </View>
    );
}

/*
 * =========================
 * PRICE
 * =========================
 */

function PriceRow({
                      title,
                      value,
                      theme,
                  }: {
    title: string;
    value: number;
    theme: any;
}) {
    return (
        <View className="mb-2 flex-row justify-between">
            <Text
                className="text-sm"
                style={{
                    color: theme.muted,
                }}
            >
                {title}
            </Text>

            <Text
                className="text-sm font-bold"
                style={{
                    color: theme.text,
                }}
            >
                {value.toFixed(2)} ₴
            </Text>
        </View>
    );
}

/*
 * =========================
 * HELPERS
 * =========================
 */

function parseCoordinates(
    value?: string | null
): Coordinates | null {
    if (!value) return null;

    const [lat, lng] = value
        .split(",")
        .map((x) => Number(x.trim()));

    if (
        !Number.isFinite(lat) ||
        !Number.isFinite(lng)
    ) {
        return null;
    }

    return {
        latitude: lat,
        longitude: lng,
    };
}

function getStatusTitle(
    status: OrderStatus
) {
    switch (status) {
        case OrderStatus.Created:
            return "Створено";

        case OrderStatus.Scheduled:
            return "Заплановано";

        case OrderStatus.Cooking:
            return "Готується";

        case OrderStatus.WaitingCourier:
            return "Готове";

        case OrderStatus.Delivering:
            return "Доставка";

        case OrderStatus.Completed:
            return "Завершено";

        case OrderStatus.Cancelled:
            return "Скасовано";

        default:
            return "Невідомо";
    }
}