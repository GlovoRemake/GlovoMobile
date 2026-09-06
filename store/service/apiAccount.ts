import {createApi} from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/utils/fetchBaseQuery";
import {ITokensResponse} from "@/types/token/ITokensResponse";


export const apiAccount = createApi({
    reducerPath: 'apiAccount',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Account'],
    endpoints: (builder) => ({
        googleLogin: builder.mutation<ITokensResponse, string>({
            query: (body) => ({
                url: '/Account/google-login',
                method: 'POST',
                body: {idToken: body},
            }),
        }),
        refresh: builder.mutation<ITokensResponse, string>({
            query: (token) => ({
                url: "/Account/Refresh",
                method: "POST",
                body: { Token: token },
            }),
        }),
    }),
});


export const {
    useGoogleLoginMutation,
} = apiAccount;