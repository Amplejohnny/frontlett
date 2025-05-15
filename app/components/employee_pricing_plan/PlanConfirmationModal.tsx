// components/PlanConfirmationModal.tsx
import { useEffect } from "react";
import { usePricingStore } from "~/stores/employeePricingStore";
import Button from "~/components/ui/button";
import { LuX, LuInfo } from "react-icons/lu";
import { cn, getPriceLabel } from "~/libs/utils";

export default function PlanConfirmationModal() {
  const {
    plans,
    addOns,
    billingCycle,
    currency,
    isModalOpen,
    selectedPlanId,
    selectedPriceType,
    includeAddOns,
    totalPrice,
    selectedAddOns,
    setIncludeAddOns,
    setTotalPrice,
    closeModal,
    setSelectedAddOns,
  } = usePricingStore();

  const plan = plans.find((p) => p.id === selectedPlanId) ?? null;
  const basePrice =
    plan?.prices[currency]?.[billingCycle]?.[selectedPriceType!] ?? null;

  // Filter add-ons based on the selected plan's name
  const planAddOns = addOns.filter((addon) => addon.planName === plan?.name);

  const isMonthly = billingCycle === "monthly";
  const isAddOnDisabled = !plan || isMonthly;

  const toggleAddOn = (type: string) => {
    if (isAddOnDisabled) return;
    setSelectedAddOns((prev) => {
      if (prev.includes(type)) {
        return prev.filter((id) => id !== type);
      } else if (prev.length < 2) {
        return [...prev, type];
      }
      return prev;
    });
  };

  const addonCost = selectedAddOns.reduce((sum, id) => {
    const addon = planAddOns.find((a) => a.id === id);
    return sum + (addon ? addon.price[currency] : 0);
  }, 0);

  const rawTotal = basePrice !== null ? basePrice + addonCost : null;

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

        <div className="flex justify-between gap-4 mb-6">
          <div className="border rounded-md p-4 flex-1 text-sm">
            <p className="text-gray-400 font-medium">Current Plan</p>
            <p className="font-semibold">{plans[0]?.name ?? "Free for Life"}</p>
            <p className="text-xs">
              Get Hired
              <br />
              Create 1 Profile
            </p>
            <p className="mt-2">{formatted(0)}/year</p>
          </div>
          <div className="border border-blue-500 rounded-md p-4 flex-1 text-sm bg-blue-50">
            <p className="text-blue-500 font-medium">New Plan</p>
            <p className="font-semibold">{plan.name}</p>
            <p className="text-xs">
              {plan.profileLimit}
              <br />
              {plan.resourceAccess}
            </p>
            <p className="mt-2">
              {getPriceLabel(basePrice, currency)}/year
            </p>
          </div>
        </div>

        {/* Price breakdown */}
        <div className="space-y-3 border-t pt-4 text-sm mb-6">
          <div className="flex justify-between">
            <span>New plan price:</span>
            <span>{getPriceLabel(basePrice, currency)}</span>
          </div>
          {selectedAddOns
            .map((id) => addOns.find((addon) => addon.id === id))
            .filter(Boolean)
            .map((addon) => (
              <div
                key={addon!.id}
                className="flex justify-between items-center"
              >
                <span className="flex items-center gap-1">
                  {addon!.name} Add-ons
                  <LuInfo
                    className="w-4 h-4 text-gray-400"
                    title="Allows you to manage extra profile or resource capacity"
                  />
                </span>
                <span>
                  {getPriceLabel(addon!.price[currency], currency)}
                </span>
              </div>
            ))}

          <div className="flex justify-between font-semibold">
            <span>Prorated amount:</span>
            <span>{getPriceLabel(rawTotal, currency)}</span>
          </div>
        </div>

        {/* Add-ons section */}
        <div className="mb-6">
          <p className="font-medium text-sm mb-2">Available Add-ons</p>
          <div className="flex gap-4 flex-wrap">
            {planAddOns.map((addon) => {
              const isSelected = selectedAddOns.includes(addon.id);
              const price = addon.price[currency];
              return (
                <div
                  key={addon.id}
                  onClick={() => toggleAddOn(addon.id)}
                  className={cn(
                    "relative w-[140px] p-4 rounded-md border transition-all",
                    isAddOnDisabled
                      ? "opacity-50 cursor-not-allowed bg-gray-50 border-gray-200"
                      : "cursor-pointer",
                    isSelected
                      ? "border-blue-500 bg-blue-50"
                      : "hover:border-gray-400"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <p className="font-medium text-sm">{addon.name}</p>
                    {isSelected && (
                      <div
                        className="absolute top-2 right-2 text-green-600 text-lg"
                        title="Selected"
                      >
                        ✔️
                      </div>
                    )}

                    {isAddOnDisabled && (
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
                    {getPriceLabel(price, currency)}/Annually
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

        <div className="border-t pt-4 flex flex-col gap-4">
          <div className="flex justify-between font-semibold text-base">
            <span>Total:</span>
            <span>{getPriceLabel(totalPrice, currency)}/year</span>
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
