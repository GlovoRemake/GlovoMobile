import React from "react";
import ProductDetail, { OptionGroup } from "@/components/food/ProductDetail";
import {useAppSelector} from "@/store";
import {useGetAffiliateProductsQuery, useGetProductAdditionalsQuery} from "@/store/service/apiAffiliate";
import {router, useLocalSearchParams} from "expo-router";
import APP_ENV from "@/utils/env";
import {useAddToCartMutation} from "@/store/service/apiCart";

export default function ProductScreen() {
    const params = useLocalSearchParams<{ productId?: string, affiliateId?: string }>();

    const {data, isLoading} = useGetAffiliateProductsQuery(params.affiliateId ?? "")
    const [add] = useAddToCartMutation();
    const product = data?.find(x => x.id === Number(params.productId))

    const {data: additionals} = useGetProductAdditionalsQuery(product?.id ?? 0);

    return (
        <ProductDetail
            productId={Number(params.productId)}
            name={product?.name ?? ""}
            description={product?.description ?? ""}
            price={product?.price ?? 0}
            imagePath={`${APP_ENV.API_IMAGE_LARGE_URL}${product?.imagePath}`}
            groups={additionals}
        />
    );
}
