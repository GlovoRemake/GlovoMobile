import { createRef } from "react";
import type { BottomSheetModal } from "@gorhom/bottom-sheet";

export const addressSheetRef =
    createRef<BottomSheetModal>();

export function openAddressSheet() {
    addressSheetRef.current?.present();
}

export function closeAddressSheet() {
    addressSheetRef.current?.dismiss();
}