import {createApi} from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/utils/fetchBaseQuery";
import {IAddAddress} from "@/types/address/IAddAddress";
import {IAddress} from "@/types/address/IAddress";


export const apiAddress = createApi({
    reducerPath: 'apiAddress',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Address'],
    endpoints: (builder) => ({
        addAddress: builder.mutation<void, IAddAddress>({
            query: (body) => ({
                url: '/Address',
                method: 'POST',
                body,
            }),
            invalidatesTags: ["Address"]
        }),
        getAddresses: builder.query<IAddress[], void>({
            query: () => "/Address",
            providesTags: ["Address"]
        }),
        deleteAddress: builder.mutation<void, number>({
            query: (id) => ({
                url: `/Address/${id}`,
                method: "DELETE",
            }),

            invalidatesTags: ["Address"],
        }),
    }),
});


export const {
    useAddAddressMutation,
    useGetAddressesQuery,
    useDeleteAddressMutation,
} = apiAddress;