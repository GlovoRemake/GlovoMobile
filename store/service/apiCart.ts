import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/utils/fetchBaseQuery";

import { IAddToCart } from "@/types/Cart/IAddToCart";
import { IUserCart } from "@/types/Cart/IUserCart";
import { IUpdateCart } from "@/types/Cart/IUpdateCart";

export const apiCart = createApi({
    reducerPath: "apiCart",

    baseQuery: baseQueryWithReauth,

    tagTypes: ["Cart"],

    endpoints: (builder) => ({
        getCarts: builder.query<IUserCart[], void>({
            query: () => ({
                url: "/Cart",
            }),
            providesTags: ["Cart"],
        }),
        addToCart: builder.mutation<void, IAddToCart>({
            query: (body) => ({
                url: "/Cart",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Cart"],
        }),
        updateCart: builder.mutation<void, { cartId: number; body: IUpdateCart}>({
            query: ({
                        cartId,
                        body,
                    }) => ({
                url: `/Cart/${cartId}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Cart"],
        }),
        deleteFromCart: builder.mutation<void, number>({
            query: (cartId) => ({
                url: `/Cart/${cartId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Cart"],
        }),
        deleteAllCart: builder.mutation<void, void>({
            query: () => ({
                url: "/Cart/all",
                method: "DELETE",
            }),
            invalidatesTags: ["Cart"],
        }),
    }),
});

export const {
    useGetCartsQuery,
    useAddToCartMutation,
    useUpdateCartMutation,
    useDeleteFromCartMutation,
    useDeleteAllCartMutation,
} = apiCart;