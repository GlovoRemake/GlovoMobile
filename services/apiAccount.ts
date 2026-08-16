import { baseQueryWithReauth } from "@/utils/baseQueryWithReauth";
import { createApi } from "@reduxjs/toolkit/query/react";
import type { IAccountLogin } from "@/types/account/IAccountLogin";
import type { IAccountRegister } from "@/types/account/IAccountRegister";
import type { IAccountSendCode } from "@/types/account/IAccountSendCode";
import type { IAccountVerifyCode } from "@/types/account/IAccountVerifyCode";
import type { ITokensResponse } from "@/types/token/ITokensResponse";

export const apiAccount = createApi({
    reducerPath: "apiAccount",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Account"],
    endpoints: (builder) => ({
        login: builder.mutation<ITokensResponse, IAccountLogin>({
            query: (model) => {
                try {
                    return {
                        method: "POST",
                        url: "/Account/Login",
                        body: model
                    }
                } catch {
                    throw new Error("Помилка перетворення данних");
                }
            }
        }),
        register: builder.mutation<ITokensResponse, IAccountRegister>({
            query: (model) => {
                try {
                    return {
                        method: "POST",
                        url: "/Account/Register",
                        body: model
                    }
                } catch {
                    throw new Error("Помилка перетворення данних");
                }
            }
        }),
        verifyCode: builder.mutation<ITokensResponse, IAccountVerifyCode>({
            query: (model) => {
                try {
                    return {
                        method: "POST",
                        url: "/Account/verify-code",
                        body: model
                    }
                } catch {
                    throw new Error("Помилка перетворення данних");
                }
            }
        }),
        sendCode: builder.mutation<void, IAccountSendCode>({
            query: (model) => {
                try {
                    return {
                        method: "POST",
                        url: "/Account/send-code",
                        body: model
                    }
                } catch {
                    throw new Error("Помилка перетворення данних");
                }
            }
        })
    })
})

export const { useLoginMutation, useRegisterMutation, useVerifyCodeMutation, useSendCodeMutation } = apiAccount;