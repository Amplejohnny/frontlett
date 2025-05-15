import { useEffect } from "react";
import { usePricingStore } from "~/stores/employerPricingStore";
import { cn } from "~/libs/utils";
import { Switch } from "@headlessui/react";
import PlanConfirmationModal from "~/components/employer_pricing_plan/PlanConfirmationModal";
import FAQSection from "~/components/pricing_plan/FAQSection";
import WhyFrontlettSection from "~/components/pricing_plan/WhyFrontlettSection";
import AddOnsSection from "~/components/employer_pricing_plan/AddOnsSection";
import FeatureComparisonTable from "~/components/employer_pricing_plan/FeatureComparisonTable";
import PricingPlanCard from "~/components/employer_pricing_plan/PricingPlanCard";

export default function PricingPage() {
  const { currency, billingCycle, setPlans, setCurrency, setBillingCycle } =
    usePricingStore();

  useEffect(() => {
    //  Fetch plans from backend
    const fetchPlans = async () => {
      try {
        const response = await fetch("/api/employer-plans");
        const data = await response.json();
        setPlans(data);
      } catch (error) {
        console.error("Failed to fetch pricing data", error);
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

      {/* Toggle Currency */}
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

        {/* Toggle Billing */}
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

      {/* Plan Cards */}
      <PricingPlanCard />

      {/* Feature Comparison Table */}
      <FeatureComparisonTable />

      {/* Add-ons Section */}
      <AddOnsSection />

      {/* Why Frontlett Section */}
      <WhyFrontlettSection />

      {/* Frequently Asked Questions Section */}
      <FAQSection />

      {/* Confirmation modal */}
      <PlanConfirmationModal />
    </div>
  );
}




// Employer Pricing Flow Description 
// ===========================================

// Overview:
// The employer pricing flow allows users (employers) to select a subscription plan (e.g., Free for Life, Startup, SME, Corporate, Government/Institution)
// on the PricingPage, which includes a FeatureComparisonTable and PricingPlanCard section. Users can toggle between monthly and annually billing cycles,
// affecting the visibility of prices and "Subscribe" buttons in the FeatureComparisonTable. The PlanConfirmationModal displays the selected plan's base price
// and up to two available add-ons, with add-on prices consistent across plans. All pricing data (base prices and add-ons) is sourced from the backend and
// managed via the employerPricingStore using Zustand. This description is current as of 10:05 AM WAT on Thursday, May 15, 2025.

// 1. Data Structure and Store Setup:
// - The employerPricingStore (employerPricingStore.ts) manages state with Zustand.
// - Key interfaces (assumed based on usage):
//   - Plan: { id: string, name: string, hireRange: string, businessLimit: string, requestQuote: boolean, prices: PlanPrices }
//   - PlanPrices: { [currency: "NGN" | "USD"]: { [billing: "monthly" | "annually"]: { [priceType: PriceType]: number | null } } }
//   - AddOn: { id: string, name: string, price: { [currency: "NGN" | "USD"]: number } }
// - The backend must populate:
//   - `plans`: Array of Plan objects with base prices for each currency, billing cycle, and price type.
//     Example: { id: "plan1", name: "Startup", hireRange: "Hire 1-5 Slots", businessLimit: "1 Business", requestQuote: false, prices: { NGN: { monthly: { Basic: 10000 }, annually: { Basic: 100000, Pro: 200000 } } } }
//   - `addOns`: Array of AddOn objects, where add-ons are consistent across plans (not tied to planName).
//     Example: { id: "addon1", name: "Extra Slot", price: { NGN: 5000, USD: 10 } }

// 2. User Interaction in PricingPage and FeatureComparisonTable:
// - The PricingPage serves as the main employer pricing page, featuring toggles for currency (NGN/USD) and billing cycle (monthly/annually).
// - The PricingPlanCard displays a card for each plan, showing the price for the "Basic" price type (DEFAULT_PRICE_TYPE: "Basic") based on the current
//   currency and billing cycle. If plan.requestQuote is true, it displays "Request Quote" instead of a price.
// - The FeatureComparisonTable displays plans with features and price types (Basic, Lifetime Basic, Pro, Lifetime Pro).
// - Billing Cycle Behavior in FeatureComparisonTable:
//   - Default is "annually". All price types show prices (from plan.prices[currency][billingCycle][priceType]) and a "Subscribe" button.
//   - When toggled to "monthly" via the Switch component in PricingPage, only "Basic" price type cells display a price and "Subscribe" button;
//     "Lifetime Basic", "Pro", and "Lifetime Pro" show "N/A" with no button.
// - The "Subscribe" button in FeatureComparisonTable triggers openModal(plan.id, priceType) to open the PlanConfirmationModal.

// 3. Modal Trigger and State Update:
// - When openModal(planId, priceType) is called (via the "Subscribe" button in FeatureComparisonTable):
//   - selectedPlanId and selectedPriceType are set in the store.
//   - isModalOpen is set to true, opening the PlanConfirmationModal.
// - The modal fetches the plan using selectedPlanId and retrieves the base price from plan.prices[currency][billingCycle][selectedPriceType].

// 4. Add-On Pricing Logic in PlanConfirmationModal:
// - Add-ons are not filtered by planName; all addOns from the store are displayed and users can select up to two add-ons.
// - Each add-on's price is stored in addon.price[currency] and is consistent across plans (e.g., "Extra Slot" costs 5000 NGN for all plans).
// - The toggleAddOn function allows:
//   - Removal of an existing add-on if clicked again.
//   - Addition of a new add-on if less than two are selected.
//   - No action if two add-ons are already selected, enforcing a maximum limit of two.
// - The total cost is calculated as:
//   - basePrice + sum(addon.price[currency] for up to two selected add-ons).
// - Add-ons are disabled if:
//   - billingCycle is "monthly".
//   - No plan is selected.
//   - The selected plan is "Free for Life".

// 5. Backend Responsibilities:
// - Provide `plans` array via the /api/employer-plans endpoint with accurate base prices for each currency, billing cycle, and price type.
//   Example: plans[0].prices.NGN.monthly.Basic = 10000, plans[0].prices.NGN.annually.Basic = 100000.
// - Include additional plan fields:
//   - hireRange: A string describing the hiring slot range (e.g., "Hire 1-5 Slots").
//   - businessLimit: A string describing the business limit (e.g., "1 Business").
//   - requestQuote: A boolean indicating if the plan requires a quote instead of a fixed price (e.g., true for "Government/Institution").
// - Provide `addOns` array with consistent pricing across plans, ensuring unique ids.
//   Example payload to employerPricingStore.setAddOns:
//     [
//       { id: "addon1", name: "Extra Slot", price: { NGN: 5000, USD: 10 } },
//       { id: "addon2", name: "Premium Support", price: { NGN: 3000, USD: 6 } }
//     ]
// - Ensure the API endpoint (/api/subscribe) accepts a payload with:
//   - plan_id, price_type, billing_cycle, currency, include_add_ons, selected_add_ons (array of up to 2 IDs), total_price
//   - Validates and processes the subscription, redirecting to /dashboard on success.

// 6. Flow Summary:
// - User views PricingPage → Toggles billing cycle (default annually) → FeatureComparisonTable updates to show all prices and "Subscribe"
//   buttons (annually) or only Basic with a button (monthly).
// - PricingPlanCard displays plan cards with "Basic" price type prices (or "Request Quote") based on billingCycle and currency.
// - User clicks "Subscribe" in FeatureComparisonTable → openModal sets state → PlanConfirmationModal displays base price + up to two add-ons.
// - Add-on prices are fetched from the backend and are consistent across plans.
// - User selects up to two add-ons → Total price updates → Submit triggers API call with all details.
// - Backend validates and confirms subscription.

// 7. Notes for Implementation:
// - Store plan and add-on prices in a database or configuration, ensuring prices are provided for both "monthly" and "annually" billing cycles.
// - Ensure add-on ids are unique to avoid conflicts in selectedAddOns (array of up to 2 items).
// - Test with different currencies (NGN, USD) and billing cycles to verify price calculations and UI updates.
// - Handle edge cases:
//   - Null prices should result in "N/A" display (handled by frontend via getPriceLabel).
//   - Missing add-ons should not break the modal (ensure addOns array is populated).
//   - Plans with requestQuote: true should not require price data but should still support subscription flow if needed.

// This flow ensures flexibility with the billing cycle toggle and supports up to two add-on selections, with the backend driving all pricing logic while
// the frontend handles dynamic display and user interaction based on the selected billing cycle.