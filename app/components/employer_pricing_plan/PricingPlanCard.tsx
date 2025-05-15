// This component is used to display the "Pricing Plan card" section in the pricing plan page.
import { usePricingStore } from "~/stores/employerPricingStore";
import { cn, getPriceLabel } from "~/libs/utils";
import type { PriceType } from "~/stores/employerPricingStore";

const DEFAULT_PRICE_TYPE: PriceType = "Basic";

const PricingPlanCard = () => {
  const { plans, currency, billingCycle } = usePricingStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {plans.map((plan) => {
        const priceValue =
          plan.prices?.[currency]?.[billingCycle]?.[DEFAULT_PRICE_TYPE] ?? null;
        const priceLabel = plan.requestQuote
          ? "Request Quote"
          : getPriceLabel(priceValue, currency);

        return (
          <div
            key={plan.id}
            className={cn(
              "rounded-xl border border-gray-200 p-5 flex flex-col items-center text-center shadow-sm",
              plan.name === "Free for Life" && "bg-[#F9FAFB]",
              plan.name === "SME" &&
                "bg-gradient-to-br from-[#2563EB] to-[#0D9488] text-white",
              plan.name === "Startup" && "bg-[#ECFDF5]",
              plan.name === "Corporate" && "bg-[#F3F4F6]",
              plan.name === "Government/Institution" &&
                "border-2 border-orange-400 bg-[#F3F4F6]"
            )}
          >
            <h4 className="font-bold text-lg mb-1">{plan.name}</h4>
            <p className="text-lg font-semibold mb-1">{priceLabel}</p>
            {!plan.requestQuote && (
              <p className="text-sm text-neutral-500 mb-4">
                {billingCycle === "monthly" ? "/mnth" : "/yr"}
              </p>
            )}
            <p className="text-sm">{plan.hireRange}</p>
            <p className="text-sm">{plan.businessLimit}</p>
          </div>
        );
      })}
    </div>
  );
};

export default PricingPlanCard;
