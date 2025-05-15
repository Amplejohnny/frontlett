// This component is used to display the "Feature Comparison" section in the employee pricing plan page.
import { usePricingStore } from "~/stores/employeePricingStore";
import Button from "~/components/ui/button";
import { cn, getPriceLabel } from "~/libs/utils";

const EmployeeFeatureComparison = () => {
  const priceTypes = [
    "Basic",
    "Lifetime Basic",
    "Pro",
    "Lifetime Pro",
  ] as const;

  const { plans, currency, billingCycle, openModal } = usePricingStore();

  return (
    <div className="mt-16 overflow-x-auto">
      <h3 className="text-2xl font-semibold mb-6 text-center">
        Feature Comparison
      </h3>

      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100 text-sm text-left">
            <th className="p-3 font-medium">Features</th>
            {plans.map((plan) => (
              <th key={plan.id} className="p-3 font-medium text-center">
                {plan.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* --- Basic Feature Section --- */}
          <tr className="bg-gray-100 border-t">
            <td className="p-3 font-semibold" colSpan={plans.length + 1}>
              Basic Feature
            </td>
          </tr>

          {/* Max Profiles */}
          <tr className="border-t">
            <td className="p-3">Max Profiles</td>
            {plans.map((plan) => (
              <td key={plan.id} className="p-3 text-center">
                {plan.profileLimit
                  ? /unlimited/i.test(plan.profileLimit)
                    ? "Unlimited"
                    : plan.profileLimit.match(/\d+/)?.[0] || "-"
                  : "-"}
              </td>
            ))}
          </tr>

          {/* Resource Types */}
          <tr className="border-t">
            <td className="p-3">Resource Types</td>
            {plans.map((plan) => (
              <td key={plan.id} className="p-3 text-center">
                {plan.resourceAccess
                  ? /all/i.test(plan.resourceAccess)
                    ? "All"
                    : plan.resourceAccess.match(/\d+/)?.[0] || "-"
                  : "-"}
              </td>
            ))}
          </tr>

          {/* Slot Rollover */}
          <tr className="border-t">
            <td className="p-3">Slot Rollover</td>
            {plans.map((plan) => {
              const enabledFor = [
                "Junior",
                "Mid",
                "Senior",
                "Advanced",
                "Executive",
                "Director",
              ];
              const isEnabled = enabledFor.includes(plan.name);

              return (
                <td key={plan.id} className="p-3 text-center">
                  {isEnabled ? (
                    <span className="text-green-600">✔️</span>
                  ) : (
                    <span className="text-red-500">❌</span>
                  )}
                </td>
              );
            })}
          </tr>

          {/* Support */}
          <tr className="border-t">
            <td className="p-3">Support</td>
            {plans.map((plan) => {
              let label = "";
              let showLabel = true;

              if (plan.name === "Intern") label = "Email";
              else if (plan.name === "Junior" && "Mid") label = "Chat";
              else if (plan.name === "Senior") label = "Priority";
              else if (plan.name === "Advanced") label = "Dedicated";
              else if (plan.name === "Executive") label = "VIP";
              else if (plan.name === "Director") label = "24/7 Concierge";
              else showLabel = false;

              return (
                <td key={plan.id} className="p-3 text-center">
                  {showLabel ? (
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

          {/* --- Pro Feature Section --- */}
          <tr className="bg-gray-100 font-semibold text-sm border-t">
            <td className="p-3" colSpan={plans.length + 1}>
              Pro Feature
            </td>
          </tr>

          {/* Micro-Credentials */}
          <tr className="border-t">
            <td className="p-3">Micro-Credentials</td>
            {plans.map((plan) => {
              let label = "";
              let show = true;

              switch (plan.name) {
                case "Intern":
                  label = "Basic";
                  break;
                case "Junior":
                case "Mid":
                  label = "";
                  break;
                case "Senior":
                case "Advanced":
                  label = "Advanced";
                  break;
                case "Executive":
                  label = "Premium";
                  break;
                case "Director":
                  label = "Unlimited";
                  break;
                default:
                  show = false;
              }

              return (
                <td key={plan.id} className="p-3 text-center">
                  {show ? (
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

          {/* Analytics Dashboard */}
          <tr className="border-t">
            <td className="p-3">Analytics Dashboard</td>
            {plans.map((plan) => {
              let label = "";
              let show = true;

              switch (plan.name) {
                case "Junior":
                  label = "Lite";
                  break;
                case "Mid":
                case "Senior":
                  label = "";
                  break;
                case "Advanced":
                  label = "Advanced";
                  break;
                case "Executive":
                  label = "Premium";
                  break;
                case "Director":
                  label = "Enterprise";
                  break;
                default:
                  show = false;
              }

              return (
                <td key={plan.id} className="p-3 text-center">
                  {show ? (
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

          {/* API Access */}
          <tr className="border-t">
            <td className="p-3">API Access</td>
            {plans.map((plan) => {
              let label = "";
              let show = true;

              switch (plan.name) {
                case "Senior":
                  label = "Basic";
                  break;
                case "Advanced":
                case "Executive":
                case "Director":
                  label = "Full";
                  break;
                default:
                  show = false;
              }

              return (
                <td key={plan.id} className="p-3 text-center">
                  {show ? (
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

          {/* Skill Certification */}
          <tr className="border-t">
            <td className="p-3">Skill Certification</td>
            {plans.map((plan) => {
              const enabledFor = [
                "Mid",
                "Senior",
                "Advanced",
                "Executive",
                "Director",
              ];
              const isEnabled = enabledFor.includes(plan.name);

              return (
                <td key={plan.id} className="p-3 text-center">
                  {isEnabled ? (
                    <span className="text-green-600">✔️</span>
                  ) : (
                    <span className="text-red-500">❌</span>
                  )}
                </td>
              );
            })}
          </tr>

          {/* --- Prices Section --- */}
          <tr className="bg-gray-100 border-t">
            <td className="p-3 font-semibold" colSpan={plans.length + 1}>
              Prices
            </td>
          </tr>

          {priceTypes.map((priceType) => {
            const isBasicRow = priceType === "Basic";
            const isAnnually = billingCycle === "annually";
            return (
              <tr key={priceType} className={cn("border-t")}>
                <td className="p-3 font-medium align-top border border-pink-300">
                  <div>{priceType}</div>
                </td>

                {plans.map((plan) => {
                  const priceValue =
                    plan.prices?.[currency]?.[billingCycle]?.[priceType] ??
                    null;
                  const shouldShowPriceAndButton =
                    (isAnnually ||
                      (billingCycle === "monthly" && isBasicRow)) &&
                    priceValue !== null;

                  return (
                    <td
                      key={`${plan.id}-${priceType}`}
                      className="p-3 text-center align-top border border-pink-300"
                    >
                      {shouldShowPriceAndButton ? (
                        <div className="flex flex-col items-center gap-1">
                          <span className="font-medium text-sm">
                            {getPriceLabel(priceValue, currency)}
                          </span>
                          <Button
                            size="sm"
                            onClick={() => openModal(plan.id, priceType)}
                          >
                            Subscribe
                          </Button>
                        </div>
                      ) : (
                        <span className="text-sm text-neutral-400">N/A</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeFeatureComparison;
