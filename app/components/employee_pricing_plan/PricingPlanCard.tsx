import { useRef, useState } from "react";
import { usePricingStore } from "~/stores/employeePricingStore";
import { cn, getPriceLabel } from "~/libs/utils";
import type { PriceType } from "~/stores/employeePricingStore";

const DEFAULT_PRICE_TYPE: PriceType = "Basic";

const EmployeePricingPlanCard = () => {
  const { plans, currency, billingCycle } = usePricingStore();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleScroll = (index: number) => {
    if (scrollRef.current) {
      const width = scrollRef.current.clientWidth;
      scrollRef.current.scrollTo({
        left: width * index,
        behavior: "smooth",
      });
      setCurrentSlide(index);
    }
  };

  return (
    <div className="relative">
      {/* Scrollable pricing cards */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x scroll-smooth no-scrollbar"
      >
        {plans.map((plan, index) => {
          const priceValue =
            plan.prices?.[currency]?.[billingCycle]?.[DEFAULT_PRICE_TYPE] ??
            null;
          const priceLabel =
            priceValue === null ? "N/A" : getPriceLabel(priceValue, currency);

          return (
            <div
              key={plan.id}
              className={cn(
                "min-w-[80%] md:min-w-[50%] lg:min-w-[25%] snap-start shrink-0 p-4 transition-all duration-300 ease-in-out",
                "rounded-xl border border-gray-200 flex flex-col items-center text-center shadow-sm hover:shadow-md",
                plan.name === "Intern" && "bg-[#F9FAFB]",
                plan.name === "Junior" && "bg-[#ECFDF5]",
                plan.name === "Mid" &&
                  "bg-gradient-to-br from-[#2563EB] to-[#0D9488] text-white",
                plan.name === "Senior" && "bg-[#F5F7FA]",
                plan.name === "Advanced" && "bg-[#EFF6FF]",
                plan.name === "Executive" &&
                  "bg-gradient-to-br from-[#8B5CF6] to-[#EC4899] text-white",
                plan.name === "Director" && "bg-[#18181B] text-white"
              )}
            >
              <h4 className="font-bold text-lg mb-1">{plan.name} Level</h4>
              <p className="text-lg font-semibold mb-1">{priceLabel}</p>
              {priceValue !== null && (
                <p className="text-sm text-neutral-500 mb-4">
                  {billingCycle === "monthly" ? "/mnth" : "/yr"}
                </p>
              )}
              <p className="text-sm">{plan.profileLimit}</p>
              <p className="text-sm">{plan.resourceAccess}</p>
            </div>
          );
        })}
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center mt-4 gap-2">
        {[0, 1].map((i) => (
          <button
            key={i}
            onClick={() => handleScroll(i)}
            className={cn(
              "h-2 w-2 rounded-full transition-all",
              currentSlide === i ? "bg-black w-4" : "bg-gray-300"
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default EmployeePricingPlanCard;
