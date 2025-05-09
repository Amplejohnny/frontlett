// components/PlanConfirmationModal.tsx
import { useEffect } from "react";
import { usePricingStore } from "~/stores/pricingStore";
import type { PriceType } from "~/stores/pricingStore";
import Button from "~/components/ui/button";
import { LuX, LuInfo } from "react-icons/lu";
import { cn } from "~/libs/utils";

const priceMultiplier: Record<PriceType, number> = {
  Basic: 1,
  "Lifetime Basic": 3,
  Pro: 2,
  "Lifetime Pro": 4,
};

export default function PlanConfirmationModal() {
  const {
    plans,
    addOns,
    billingCycle,
    currency,
    isModalOpen,
    selectedPlanId,
    selectedPriceType,
    closeModal,
    includeAddOns,
    setIncludeAddOns,
    totalPrice,
    setTotalPrice,
  } = usePricingStore();

  const plan = plans.find((p) => p.id === selectedPlanId) ?? null;
  const basePrice = plan?.prices[currency][billingCycle] ?? null;

  const isMonthly = billingCycle === "monthly";
  const isAddOnDisabled = !plan || isMonthly || plan.name === "Free for Life";

  const { selectedAddOns, setSelectedAddOns } = usePricingStore();

  const toggleAddOn = (type: string) => {
    if (isAddOnDisabled) return;
    setSelectedAddOns((prev) => (prev[0] === type ? [] : [type]));
  };

  const addonCost = selectedAddOns.reduce((sum, id) => {
    const addon = addOns.find((a) => a.id === id);
    return sum + (addon ? addon.price[currency] : 0);
  }, 0);

  const rawTotal =
    basePrice && selectedPriceType
      ? basePrice * priceMultiplier[selectedPriceType] + addonCost
      : null;

  // Persist total price globally
  useEffect(() => {
    setTotalPrice(rawTotal);
  }, [rawTotal]);

  useEffect(() => {
    if (isMonthly || !isModalOpen) {
      setSelectedAddOns([]);
      setIncludeAddOns(false);
    }
  }, [billingCycle, isModalOpen]);

  const formatted = (value: number | null) =>
    value
      ? new Intl.NumberFormat("en-NG", {
          style: "currency",
          currency,
          maximumFractionDigits: 0,
        }).format(value)
      : "N/A";

  //Backend API call to handle subscription
  const handleSubmit = async () => {
    if (!selectedPlanId || !selectedPriceType || !totalPrice) return;

    const payload = {
      plan_id: selectedPlanId,
      price_type: selectedPriceType,
      billing_cycle: billingCycle,
      currency,
      include_add_ons: includeAddOns,
      selected_add_ons: selectedAddOns,
      total_price: totalPrice,
    };

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Subscription failed");
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Failed to subscribe:", err);
      alert("Subscription failed. Please try again.");
    }
  };

  // Modal rendering logic
  if (!isModalOpen || !plan || !selectedPriceType) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-xl rounded-lg shadow-xl p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
          onClick={closeModal}
        >
          <LuX className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-semibold mb-6">Choose Your Plan</h3>

        {/* Plan boxes */}
        <div className="flex justify-between gap-4 mb-6">
          <div className="border rounded-md p-4 flex-1 text-sm">
            <p className="text-gray-400 font-medium">Current Plan</p>
            <p className="font-semibold">{plans[0]?.name ?? "Free for Life"}</p>
            <p className="text-xs">
              Hire for 1 Slot
              <br />1 Business
            </p>
            <p className="mt-2">{formatted(0)}/year</p>
          </div>
          <div className="border border-blue-500 rounded-md p-4 flex-1 text-sm bg-blue-50">
            <p className="text-blue-500 font-medium">New Plan</p>
            <p className="font-semibold">{plan.name}</p>
            <p className="text-xs">
              {plan.hireRange}
              <br />
              {plan.businessLimit}
            </p>
            <p className="mt-2">{formatted(basePrice)}/year</p>
          </div>
        </div>

        {/* Price summary */}
        <div className="space-y-3 border-t pt-4 text-sm mb-6">
          <div className="flex justify-between">
            <span>New plan price:</span>
            <span>{formatted(basePrice)}</span>
          </div>
          {selectedAddOns.length > 0 && (
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1">
                Business Add-ons
                <LuInfo
                  className="w-4 h-4 text-gray-400"
                  title="Extra businesses or hiring capacity"
                />
              </span>
              <span>{formatted(addonCost)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold">
            <span>Prorated amount:</span>
            <span>{formatted(rawTotal)}</span>
          </div>
        </div>

        {/* Add-ons */}
        <div className="mb-6">
          <p className="font-medium text-sm mb-2">Available Add-ons</p>
          <div className="flex gap-4 flex-wrap">
            {addOns.map((addon) => {
              const isSelected = selectedAddOns.includes(addon.id);
              const price = addon.price[currency];
              const isLocked =
                selectedAddOns.length === 1 && !isSelected && !isAddOnDisabled;
              return (
                <div
                  key={addon.id}
                  onClick={() => toggleAddOn(addon.id)}
                  className={cn(
                    "relative min-w-[120px] p-4 rounded-md border transition-all",
                    isAddOnDisabled || isLocked
                      ? "opacity-50 cursor-not-allowed bg-gray-50 border-gray-200"
                      : "cursor-pointer",
                    isSelected
                      ? "border-blue-500 bg-blue-50"
                      : !isAddOnDisabled && !isLocked
                      ? "hover:border-gray-400"
                      : ""
                  )}
                >
                  <div className="flex items-start justify-between">
                    <p className="font-medium text-sm">{addon.label}</p>
                    {isSelected && (
                      <div
                        className="absolute top-2 right-2 text-green-600 text-lg"
                        title="Selected"
                      >
                        ✔️
                      </div>
                    )}
                    {isLocked && (
                      <div
                        className="absolute top-2 right-2 text-gray-400 text-lg"
                        title="Only one add-on allowed"
                      >
                        🔒
                      </div>
                    )}
                    {isAddOnDisabled && !isLocked && (
                      <div
                        className="absolute top-2 right-2 text-red-500 text-lg"
                        title="Requires annual paid plan"
                      >
                        🔒
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Billed annually</p>
                  <p className="text-sm font-semibold mt-2">
                    {formatted(price)}/Annually
                  </p>
                </div>
              );
            })}
          </div>
          {isAddOnDisabled && (
            <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
              <LuInfo className="inline-block" />
              Add-ons require a paid annual plan.
            </p>
          )}
        </div>

        {/* Total + Actions */}
        <div className="border-t pt-4 flex flex-col gap-4">
          <div className="flex justify-between font-semibold text-base">
            <span>Total:</span>
            <span>{formatted(totalPrice)}/year</span>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Confirm & Pay</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
