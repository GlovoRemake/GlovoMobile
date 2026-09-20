import React from "react";
import ProductDetail from "@/components/food/ProductDetail";

export default function SauceScreen() {
    return (
        <ProductDetail
            title="Соус сирний"
            price={25}
            description="Ніжний вершковий соус «Сирний». 24 г | 89 ккал"
            emoji="🥣"
            heroBg="#FFFFFF"
            heroHeight={260}
        />
    );
}
