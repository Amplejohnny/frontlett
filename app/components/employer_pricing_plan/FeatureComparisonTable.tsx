// This component is used to display the "Feature Comparison" section in the pricing plan page.
import { usePricingStore } from "~/stores/employerPricingStore";
import Button from "~/components/ui/button";
import { cn, getPriceLabel } from "~/libs/utils";

const FeatureComparisonTable = () => {
  const priceTypes = [
    "Basic",
    "Lifetime Basic",
    "Pro",
    "Lifetime Pro",
  ] as const;

  const { plans, currency, billingCycle, openModal } = usePricingStore();

  return (
    <div className="mt-16 overflow-x-auto">
      {/* --- Plans Header --- */}
      <h3 className="text-2xl font-semibold mb-6 text-center">
        Feature Comparison
      </h3>
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100 text-sm text-left">
            <th className="p-3 font-medium">Feature</th>
            {plans.map((plan) => (
              <th key={plan.id} className="p-3 font-medium text-center">
                {plan.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* --- Basic Feature Section Header --- */}
          <tr className="bg-gray-100 border-t">
            <td className="p-3 font-semibold" colSpan={plans.length + 1}>
              Basic Feature
            </td>
          </tr>
          {/* Max Hires */}
          <tr className="border-t">
            <td className="p-3">Max Hires</td>
            {plans.map((plan) => (
              <td key={plan.id} className="p-3 text-center">
                {plan.hireRange
                  ? /unlimited/i.test(plan.hireRange)
                    ? "Unlimited"
                    : plan.hireRange.match(/\d+\s*(–|-)?\s*\d*/)?.[0] || "-"
                  : "-"}
              </td>
            ))}
          </tr>
          {/* Max Businesses */}
          <tr className="border-t">
            <td className="p-3">Max Businesses</td>
            {plans.map((plan) => (
              <td key={plan.id} className="p-3 text-center">
                {plan.businessLimit
                  ? /unlimited/i.test(plan.businessLimit)
                    ? "Unlimited"
                    : plan.businessLimit.match(/Up to \d+/i)?.[0] ||
                      plan.businessLimit.match(/\d+/)?.[0] ||
                      "-"
                  : "-"}
              </td>
            ))}
          </tr>
          <tr className="border-t">
            <td className="p-3">HR Support</td>
            {plans.map((plan) => {
              let label = "";
              let showCheck = true;

              if (plan.name === "Startup") label = "Basic";
              else if (plan.name === "SME") label = "Full";
              else if (plan.name === "Corporate") label = "Dedicated";
              else if (plan.name === "Government/Institution")
                label = "Enterprise";
              else showCheck = false;

              return (
                <td key={plan.id} className="p-3 text-center">
                  {showCheck ? (
                    <span className="inline-flex items-center gap-1 text-sm">
                      <span className="text-green-600">✔️</span> {label}
                    </span>
                  ) : (
                    <span className="text-red-500">❌</span>
                  )}
                </td>
              );
            })}
          </tr>

          {/* --- Pro Feature Section Header --- */}
          <tr className="bg-gray-100 font-semibold text-sm border-t">
            <td className="p-3" colSpan={plans.length + 1}>
              Pro Feature
            </td>
          </tr>
          {/* Verified Pro Access */}
          <tr>
            <td className="p-3">Verified Pro Access</td>
            {plans.map((plan) => (
              <td key={plan.id} className="p-3 text-center">
                {plan.name === "Free for Life" ? (
                  <span className="text-red-500">❌</span>
                ) : plan.name === "Startup" ? (
                  <span className="inline-flex items-center gap-1 text-sm">
                    <span className="text-green-600">✔️</span> Limited
                  </span>
                ) : (
                  <span className="text-green-600">✔️</span>
                )}
              </td>
            ))}
          </tr>
          {/* Custom Dashboards */}
          <tr>
            <td className="p-3">Custom Dashboards</td>
            {plans.map((plan) => (
              <td key={plan.id} className="p-3 text-center">
                {plan.name === "Free for Life" ? (
                  <span className="text-red-500">❌</span>
                ) : (
                  <span className="text-green-600">✔️</span>
                )}
              </td>
            ))}
          </tr>
          {/* Micro-Contract Automation */}
          <tr>
            <td className="p-3">Micro-Contract Automation</td>
            {plans.map((plan) => (
              <td key={plan.id} className="p-3 text-center">
                <span className="text-green-600">✔️</span>
              </td>
            ))}
          </tr>

          {/* --- Prices Section Header --- */}
          <tr className="bg-gray-100 border-t">
            <td className="p-3 font-semibold" colSpan={plans.length + 1}>
              Prices
            </td>
          </tr>

          {priceTypes.map((priceType) => (
            <tr key={priceType} className={cn("border-t")}>
              <td className="p-3 font-medium align-top border border-pink-300">
                <div>
                  {priceType}
                  {priceType === "Lifetime Basic" && (
                    <div className="text-xs text-pink-500 mt-1">
                      (Limited to 300 Slots)
                    </div>
                  )}
                  {priceType === "Lifetime Pro" && (
                    <div className="text-xs text-pink-500 mt-1">
                      (Limited to 200 Slots)
                    </div>
                  )}
                </div>
              </td>

              {plans.map((plan) => {
                const priceValue =
                  plan.prices?.[currency]?.[billingCycle]?.[priceType] ?? null;

                const price = priceValue === 0 ? null : priceValue;

                const isRequestQuote = plan.requestQuote || price === null;
                const isFreePlan = plan.name === "Free for Life";
                const showSubscribe =
                  !isFreePlan || (isFreePlan && priceType !== "Basic");

                return (
                  <td
                    key={`${plan.id}-${priceType}`}
                    className="p-3 text-center align-top border border-pink-300"
                  >
                    {isRequestQuote ? (
                      <button className="text-sm text-blue-600 underline">
                        Request Quote
                      </button>
                    ) : isFreePlan && priceType !== "Basic" ? (
                      <span className="text-sm text-neutral-400">N/A</span>
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-medium text-sm">
                          {getPriceLabel(price, currency)}
                        </span>
                        {showSubscribe && priceType !== "Basic" && (
                          <Button
                            size="sm"
                            onClick={() => {
                              openModal(plan.id, priceType);
                            }}
                          >
                            Subscribe
                          </Button>
                        )}
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeatureComparisonTable;
