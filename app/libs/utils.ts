import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { usePricingStore } from "~/stores/employerPricingStore";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/// Function to format price(Employer's pricing)
export function getPriceLabel(
  price: number | null,
  currency: "NGN" | "USD"
) {
  if (price === null) return "Request Quote";
  const formatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });
  return formatter.format(price);
}
