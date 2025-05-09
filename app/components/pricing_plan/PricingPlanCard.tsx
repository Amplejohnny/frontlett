// This component is used to display the "Pricing Plan card" section in the pricing plan page.
import { usePricingStore } from "~/stores/pricingStore";
import { cn } from "~/libs/utils";
import { getPriceLabel } from "~/libs/utils";

const PricingPlanCard = () => {
  const { plans, currency, billingCycle } = usePricingStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {plans.map((plan) => {
        const priceObj = plan.prices[currency][billingCycle];
        const priceLabel = plan.requestQuote
          ? "Request Quote"
          : getPriceLabel(priceObj);

        return (
          <div
            key={plan.id}
            className={cn(
              "rounded-xl border border-gray-200 p-5 flex flex-col items-center text-center shadow-sm",
              plan.name === "SME" &&
                "bg-gradient-to-br from-[#0052CC] to-[#0075FF] text-white",
              plan.name === "Startup" && "bg-[#F0FFF5]",
              plan.name === "Corporate" && "bg-[#F9FAFB]",
              plan.name === "Government/Institution" &&
                "border-2 border-orange-400 bg-white"
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
