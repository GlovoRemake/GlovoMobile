import {createApi} from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/utils/fetchBaseQuery";
import {ITokensResponse} from "@/types/token/ITokensResponse";
import {IAuthLogin} from "@/types/auth/IAuthLogin";


export const apiAccount = createApi({
    reducerPath: 'apiAccount',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Account'],
    endpoints: (builder) => ({
        login: builder.mutation<ITokensResponse, IAuthLogin>({
            query: (body) => ({
                url: '/Account/Login',
                method: 'POST',
                body,
            }),
            invalidatesTags: ["Account"]
        }),
        googleLogin: builder.mutation<ITokensResponse, string>({
            query: (body) => ({
                url: '/Account/google-login',
                method: 'POST',
                body: {idToken: body},
            }),
            invalidatesTags: ["Account"]
        }),
        refresh: builder.mutation<ITokensResponse, string>({
            query: (token) => ({
                url: "/Account/Refresh",
                method: "POST",
                body: { Token: token },
            }),
            invalidatesTags: ["Account"]
        }),
    }),
});


export const {
    useGoogleLoginMutation,
    useLoginMutation
} = apiAccount;