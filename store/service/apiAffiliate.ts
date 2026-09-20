import {createApi} from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/utils/fetchBaseQuery";
import {IAddAddress} from "@/types/address/IAddAddress";
import {IAddress} from "@/types/address/IAddress";
import {ICompany} from "@/types/company/ICompany";
import {IAffiliate} from "@/types/company/affiliate/IAffiliate";
import {ICompanyCategory} from "@/types/company/ICompanyCategory";
import {ICompanyProduct} from "@/types/company/ICompanyProduct";
import {IProductAdditional} from "@/types/company/IProductAdditional";


export const apiAffiliate = createApi({
    reducerPath: 'apiAffiliate',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Affiliate'],
    endpoints: (builder) => ({
        getAffiliates: builder.query<IAffiliate[], {companyId: string, cityId: number}>({
            query: (data) => ({
                url: `/company/affiliate/by-region/${data.companyId}?cityId=${data.cityId}`,
            }),
            providesTags: ["Affiliate"]
        }),
        getAffiliateCategories: builder.query<ICompanyCategory[], string>({
            query: (affiliateId) => ({
                url: `/company/affiliate/categories/${affiliateId}`,
            }),
            providesTags: ["Affiliate"]
        }),
        getAffiliateProducts: builder.query<ICompanyProduct[], string>({
            query: (affiliateId) => ({
                url: `/company/affiliate/products/${affiliateId}`,
            }),
            providesTags: ["Affiliate"]
        }),
        getProductAdditionals: builder.query<IProductAdditional[], number>({
            query: (productId) => ({
                url: `/Additional/all/${productId}`,
            }),
            providesTags: ["Affiliate"]
        }),
    }),
});


export const {
    useGetAffiliatesQuery,
    useGetAffiliateCategoriesQuery,
    useGetAffiliateProductsQuery,
    useGetProductAdditionalsQuery,
} = apiAffiliate;