import { useEffect } from "react";
import { usePricingStore } from "~/stores/employeePricingStore";
import { cn } from "~/libs/utils";
import { Switch } from "@headlessui/react";
import EmployeePricingPlanCard from "~/components/employee_pricing_plan/PricingPlanCard";
import FeatureComparisonTable from "~/components/employee_pricing_plan/FeatureComparisonTable";
import WhyFrontlettSection from "~/components/pricing_plan/WhyFrontlettSection";
import FAQSection from "~/components/pricing_plan/FAQSection";
import AddOnsSection from "~/components/employee_pricing_plan/AddOnSection";
import PlanConfirmationModal from "~/components/employee_pricing_plan/PlanConfirmationModal";

export default function EmployeePricing() {
  const { currency, billingCycle, setPlans, setCurrency, setBillingCycle } =
    usePricingStore();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch("/api/employee-plans");
        const data = await response.json();
        setPlans(data);
      } catch (error) {
        console.error("Failed to fetch employee pricing data", error);
      }
    };

    fetchPlans();
  }, [setPlans]);

  const toggleCurrency = (selected: "NGN" | "USD") => {
    setCurrency(selected);
  };

  const toggleBilling = () => {
    setBillingCycle((prev) => (prev === "monthly" ? "annually" : "monthly"));
  };

  return (
    <div className="px-4 md:px-10 py-12 max-w-[1300px] mx-auto">
      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-[#0F1729] mb-3">
          Flexible Plans for Every Team Size
        </h2>
        <p className="text-neutral-500 text-sm md:text-base">
          Pay only for the slots you need. Scale up or down anytime.
        </p>
      </div>

      {/* Toggle Controls */}
      <div className="flex justify-center items-center gap-4 mb-12">
        <div className="bg-neutral-100 p-1 rounded-full flex">
          {["NGN", "USD"].map((curr) => (
            <button
              key={curr}
              className={cn(
                "px-4 py-1.5 text-sm rounded-full font-medium transition-colors",
                currency === curr
                  ? "bg-white text-black shadow"
                  : "text-neutral-500"
              )}
              onClick={() => toggleCurrency(curr as "NGN" | "USD")}
            >
              {curr === "NGN" ? "₦ NGN" : "$ USD"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-500">Annual</span>
          <Switch
            checked={billingCycle === "monthly"}
            onChange={toggleBilling}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
              billingCycle === "monthly" ? "bg-primary" : "bg-gray-300"
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                billingCycle === "monthly" ? "translate-x-6" : "translate-x-1"
              )}
            />
          </Switch>
          <span className="text-sm text-neutral-500">Monthly</span>
        </div>
      </div>

      {/* Pricing Cards */}
      <EmployeePricingPlanCard />

      {/* Feature Comparison Table */}
      <FeatureComparisonTable />

      {/* Add-ons Section */}
      <AddOnsSection />

      {/* Why Frontlett Section */}
      <WhyFrontlettSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Confirmation Modal */}
      <PlanConfirmationModal />
    </div>
  );
}



// Pricing Flow Description 
// ===========================================

// Overview:
// The pricing flow enables users to select a subscription plan (Intern, Junior, Mid, Senior, Advanced, Executive, Director)
// from the EmployeeFeatureComparison table within the EmployeePricing page and upgrade to a price type (Basic, Lifetime Basic,
// Pro, Lifetime Pro). The PlanConfirmationModal displays the base price and plan-specific add-ons, with add-on prices varying
// by the selected plan's name. The UI now includes a billing cycle toggle (monthly/annually) that dynamically adjusts the
// visibility of prices and "Subscribe" buttons. All pricing data (base prices and add-on prices) is sourced from the backend
// and managed via the pricingStore using Zustand.

// 1. Data Structure and Store Setup:
// - The pricingStore (pricingStore.ts) manages state with Zustand.
// - Key interfaces:
//   - Plan: { id: string, name: string, resourceAccess: string, profileLimit: string, prices: PlanPrices }
//   - PlanPrices: { [currency: "NGN" | "USD"]: { [billing: "monthly" | "annually"]: { [priceType: PriceType]: number | null } } }
//   - AddOn: { id: string, name: string, label: string, planName: string, price: { [currency: "NGN" | "USD"]: number } }
// - The backend must populate:
//   - `plans`: Array of Plan objects with base prices for each currency, billing cycle, and price type.
//   - `addOns`: Array of AddOn objects, where each add-on is tied to a specific planName (e.g., "Intern", "Junior").
//     Example: { id: "addon1_intern", name: "Extra Profile", label: "Extra Profile", planName: "Intern", price: { NGN: 5000, USD: 10 } }

// 2. User Interaction in EmployeePricing and EmployeeFeatureComparison:
// - The EmployeePricing page serves as the main pricing plan page, featuring a toggle for currency (NGN/USD) and billing cycle (monthly/annually).
// - The EmployeeFeatureComparison table displays plans (Intern to Director) with features and price types.
// - Billing Cycle Behavior:
//   - Default is "annually". All price types (Basic, Lifetime Basic, Pro, Lifetime Pro) show prices (from plan.prices[currency][billingCycle][priceType])
//     and include a "Subscribe" button.
//   - When toggled to "monthly" via the Switch component, only "Basic" price type cells display a price and "Subscribe" button;
//     "Lifetime Basic", "Pro", and "Lifetime Pro" show "N/A" with no button.
// - The "Subscribe" button triggers openModal(plan.id, priceType) to open the PlanConfirmationModal.

// 3. Modal Trigger and State Update:
// - When openModal(planId, priceType) is called (via the "Subscribe" button):
//   - selectedPlanId and selectedPriceType are set in the store.
//   - isModalOpen is set to true, opening the PlanConfirmationModal.
// - The modal fetches the plan using selectedPlanId and retrieves the base price from plan.prices[currency][billingCycle][selectedPriceType].

// 4. Add-On Pricing Logic in PlanConfirmationModal:
// - Add-ons are filtered based on the selected plan's name (plan.name) using addOns.filter(addon => addon.planName === plan.name).
// - Each add-on's price is stored in addon.price[currency] and varies by planName (e.g., "Extra Profile" costs 5000 NGN for Intern,
//   6000 NGN for Junior, etc., as defined by the backend).
// - Users can select multiple add-ons, and the total cost is calculated as:
//   - basePrice + sum(addon.price[currency] for selected add-ons).
// - Add-ons are disabled if the billingCycle is "monthly" or no plan is selected.

// 5. Backend Responsibilities:
// - Provide `plans` array with accurate base prices for each currency, billing cycle, and price type.
//   Example: plans[0].prices.NGN.monthly.Basic = 5000, plans[0].prices.NGN.annually.Basic = 50000.
// - Provide `addOns` array with entries for each planName, ensuring unique ids (e.g., "addon1_intern", "addon1_junior").
//   - Add-on prices should differ by planName but remain consistent across priceTypes within the same plan.
//   - Example payload to pricingStore.setAddOns:
//     [
//       { id: "addon1_intern", name: "Extra Profile", label: "Extra Profile", planName: "Intern", price: { NGN: 5000, USD: 10 } },
//       { id: "addon2_intern", name: "Premium Support", label: "Premium Support", planName: "Intern", price: { NGN: 3000, USD: 6 } },
//       { id: "addon1_junior", name: "Extra Profile", label: "Extra Profile", planName: "Junior", price: { NGN: 6000, USD: 12 } },
//       { id: "addon2_junior", name: "Premium Support", label: "Premium Support", planName: "Junior", price: { NGN: 4000, USD: 8 } },
//       // ... similar entries for Mid, Senior, Advanced, Executive, Director
//     ]
// - Ensure the API endpoint (/api/subscribe) accepts a payload with:
//   - plan_id, price_type, billing_cycle, currency, include_add_ons, selected_add_ons, total_price
//   - Validates and processes the subscription, redirecting to /dashboard on success.
// - The /api/employee-plans endpoint should return plan data with prices for both monthly and annually billing cycles.

// 6. Flow Summary:
// - User views EmployeePricing page → Toggles billing cycle (default annually) → EmployeeFeatureComparison updates to show
//   all prices and "Subscribe" buttons (annually) or only Basic with a button (monthly).
// - User clicks "Subscribe" → openModal sets state → PlanConfirmationModal displays base price + plan-specific add-ons.
// - Add-on prices are fetched from the backend based on planName.
// - User selects add-ons → Total price updates → Submit triggers API call with all details.
// - Backend validates and confirms subscription.

// 7. Notes for Implementation:
// - Store plan and add-on prices in a database or configuration, linked by planName and billingCycle.
// - Ensure add-on ids are unique across plans to avoid conflicts in selectedAddOns.
// - Provide price data for both "monthly" and "annually" in plan.prices to support the toggle behavior.
// - Test with different currencies (NGN, USD) and billing cycles to verify price calculations and UI updates.
// - Handle edge cases (e.g., null prices, missing add-ons) by returning defaults or errors.

// This flow ensures flexibility with the billing cycle toggle, with the backend driving all pricing logic while the frontend
// handles dynamic display and user interaction based on the selected billing cycle.