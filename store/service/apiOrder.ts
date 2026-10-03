import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/utils/fetchBaseQuery";

import { IConfirmOrder } from "@/types/Order/IConfirmOrder";
import { IOrder } from "@/types/Order/IOrder";

export const apiOrder = createApi({
    reducerPath: "apiOrder",
    baseQuery: baseQueryWithReauth,

    tagTypes: ["Order"],

    endpoints: (builder) => ({
        getActiveOrders: builder.query<IOrder[], void>({
            query: () => ({
                url: "/Order/my-active-orders",
                method: "GET",
            }),

            providesTags: ["Order"],
        }),

        confirmOrder: builder.mutation<void, IConfirmOrder>({
            query: (body) => ({
                url: "/Order",
                method: "POST",
                body,
            }),

            invalidatesTags: ["Order"],
        }),

        orderHistory: builder.query<IOrder[], void>({
            query: () => ({
                url: "/Order/history-orders",
            }),

            invalidatesTags: ["Order"],
        }),
    }),
});

export const {
    useConfirmOrderMutation,
    useGetActiveOrdersQuery,
    useOrderHistoryQuery,
} = apiOrder;