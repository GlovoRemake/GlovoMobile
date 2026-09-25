import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/utils/fetchBaseQuery";

import {IConfirmOrder} from "@/types/Order/IConfirmOrder";

export const apiOrder = createApi({
    reducerPath: "apiOrder",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Order"],
    endpoints: (builder) => ({
        confirmOrder: builder.mutation<void, IConfirmOrder>({
            query: (body) => ({
                url: "/Order",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Order"],
        })
    }),
});

export const {
    useConfirmOrderMutation,
} = apiOrder;