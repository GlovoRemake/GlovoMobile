import { ICompany } from "@/types/company/ICompany";
import { ICompanyType } from "@/types/company/ICompanyType";
import { baseQueryWithReauth } from "@/utils/fetchBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const apiCompany = createApi({
  reducerPath: "apiCompany",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Company"],
  endpoints: (builder) => ({
    getCompanies: builder.query<ICompany[], { regionId: number; companyTypeIds: number[]}>({
        query: ({ regionId, companyTypeIds }) => {
            const params = new URLSearchParams();
            companyTypeIds.forEach((id) => params.append("companyTypeIds", String(id)));

            const queryString = params.toString();

            return {
                url: `/Company/GetCompanyByRegion/${regionId}${queryString ? `?${queryString}` : ""}`,
            };
        },
        providesTags: ["Company"],
    }),
    getCompanyTypes: builder.query<ICompanyType[], void>({
        query: () => ({
            url: "/Company/GetCompanyTypes",
        })
    }),
  }),
});

export const { useGetCompaniesQuery, useGetCompanyTypesQuery } = apiCompany;
