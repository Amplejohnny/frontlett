import { useEffect } from "react";
import { usePricingStore } from "~/stores/pricingStore";
import { cn } from "~/libs/utils";
import { Switch } from "@headlessui/react";
import PlanConfirmationModal from "~/components/pricing_plan/PlanConfirmationModal";
import FAQSection from "~/components/pricing_plan/FAQSection";
import WhyFrontlettSection from "~/components/pricing_plan/WhyFrontlettSection";
import AddOnsSection from "~/components/pricing_plan/AddOnsSection";
import FeatureComparisonTable from "~/components/pricing_plan/FeatureComparisonTable";
import PricingPlanCard from "~/components/pricing_plan/PricingPlanCard";

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
