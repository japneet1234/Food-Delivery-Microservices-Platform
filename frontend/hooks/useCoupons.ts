"use client";

import { useState } from "react";

type Coupon = {
  code: string;
  description: string;
  discount: number; // percentage (0-100) or flat if isFlat
  minOrder: number; // in rupees
  isFlat?: boolean;
};

const COUPONS: Coupon[] = [
  { code: "FIRST50", description: "50% off on first order", discount: 50, minOrder: 0 },
  { code: "SAVE100", description: "₹100 off on orders above ₹299", discount: 100, minOrder: 299, isFlat: true },
  { code: "FREESHIP", description: "Free delivery applied", discount: 0, minOrder: 0 },
];

export function useCoupons() {
  const [applied, setApplied] = useState<Coupon | null>(null);

  const apply = (code: string, total: number) => {
    const coupon = COUPONS.find((c) => c.code.toUpperCase() === code.toUpperCase());
    if (!coupon) return { success: false, message: "Invalid coupon code" } as const;
    if (total < coupon.minOrder) return { success: false, message: `Minimum order ₹${coupon.minOrder} required` } as const;
    setApplied(coupon);
    return { success: true, message: "Coupon applied" } as const;
  };

  const remove = () => setApplied(null);

  const discountAmount = (total: number) => {
    if (!applied) return 0;
    if (applied.isFlat) return Math.min(applied.discount, total);
    return Math.round((applied.discount / 100) * total);
  };

  return { applied, apply, remove, discountAmount, available: COUPONS };
}
