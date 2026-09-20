import {createApi} from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/utils/fetchBaseQuery";
import {IAddAddress} from "@/types/address/IAddAddress";
import {IAddress} from "@/types/address/IAddress";
import {ICompany} from "@/types/company/ICompany";


export const apiCompany = createApi({
    reducerPath: 'apiCompany',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Company'],
    endpoints: (builder) => ({
        getCompanies: builder.query<ICompany[], {regionId: number, companyTypeIds: number[]}>({
            query: (data) => ({
                url: `/Company/GetCompanyByRegion/${data.regionId}`,
            }),
            providesTags: ["Company"]
        }),
    }),
});


export const {
    useGetCompaniesQuery
} = apiCompany;