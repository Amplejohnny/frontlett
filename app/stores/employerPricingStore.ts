import { create } from "zustand";

export type Currency = "NGN" | "USD";
export type BillingCycle = "monthly" | "annually";
export type PriceType = "Basic" | "Lifetime Basic" | "Pro" | "Lifetime Pro";

type PlanPrices = {
  [currency in Currency]: {
    [billing in BillingCycle]: {
      [priceType in PriceType]?: number | null;
    };
  };
};

interface Plan {
  id: string;
  name: string;
  hireRange: string;
  businessLimit: string;
  requestQuote?: boolean;
  prices: PlanPrices;
}

interface AddOn {
  id: string;
  name: string;
  label: string;
  price: {
    [currency in Currency]: number;
  };
}

interface PricingStore {
  plans: Plan[];
  addOns: AddOn[];
  currency: Currency;
  billingCycle: BillingCycle;
  isModalOpen: boolean;
  selectedPlanId: string | null;
  selectedPriceType: PriceType | null;
  includeAddOns: boolean;
  selectedAddOns: string[];
  totalPrice: number | null;

  // Actions
  setPlans: (plans: Plan[]) => void;
  setAddOns: (addOns: AddOn[]) => void;
  setCurrency: (currency: Currency) => void;
  openModal: (planId: string, priceType: PriceType) => void;
  closeModal: () => void;
  setIncludeAddOns: (value: boolean) => void;
  setTotalPrice: (price: number | null) => void;
  setSelectedPlanId: (id: string | null) => void;
  setSelectedPriceType: (type: PriceType | null) => void;
  setBillingCycle: (
    cycle: BillingCycle | ((prev: BillingCycle) => BillingCycle)
  ) => void;
  setSelectedAddOns: (
    updater: string[] | ((prev: string[]) => string[])
  ) => void;
}

export const usePricingStore = create<PricingStore>((set) => ({
  plans: [],
  addOns: [],
  currency: "NGN",
  billingCycle: "annually",
  isModalOpen: false,
  selectedPlanId: null,
  selectedPriceType: null,
  includeAddOns: false,
  totalPrice: null,
  selectedAddOns: [],

  setPlans: (plans) => set({ plans }),
  setAddOns: (addOns) => set({ addOns }),
  setCurrency: (currency) => set({ currency }),
  setBillingCycle: (cycle) =>
    set((state) => ({
      billingCycle:
        typeof cycle === "function" ? cycle(state.billingCycle) : cycle,
    })),
  openModal: (planId, priceType) =>
    set({
      selectedPlanId: planId,
      selectedPriceType: priceType,
      isModalOpen: true,
    }),
  closeModal: () =>
    set({ selectedPlanId: null, selectedPriceType: null, isModalOpen: false }),
  setIncludeAddOns: (value) => set({ includeAddOns: value }),
  setTotalPrice: (price) => set({ totalPrice: price }),
  setSelectedPlanId: (id) => set({ selectedPlanId: id }),
  setSelectedPriceType: (type) => set({ selectedPriceType: type }),
  setSelectedAddOns: (updater) =>
    set((state) => ({
      selectedAddOns:
        typeof updater === "function" ? updater(state.selectedAddOns) : updater,
    })),
}));


// Sample data for plans and add-ons
// const plans = [
//   {
//     id: "free",
//     name: "Free for Life",
//     hireRange: "Hire for 1 Slot",
//     businessLimit: "1 Business",
//     prices: {
//       NGN: {
//         annually: {
//           Basic: 15000,
//           "Lifetime Basic": 30000,
//           Pro: 25000,
//           "Lifetime Pro": 50000,
//         },
//         monthly: {
//           Basic: 300,
//           "Lifetime Basic": 600,
//           Pro: 500,
//           "Lifetime Pro": 1000,
//         },
//       },
//       USD: {
//         annually: {
//           Basic: 30,
//           "Lifetime Basic": 60,
//           Pro: 50,
//           "Lifetime Pro": 100,
//         },
//         monthly: {
//           Basic: 3,
//           "Lifetime Basic": 6,
//           Pro: 5,
//           "Lifetime Pro": 10,
//         },
//       },
//     },
//   },
//   {
//     id: "startup",
//     name: "Startup",
//     hireRange: "Hire 1–3 People",
//     businessLimit: "Up to 2 Businesses",
//     prices: {
//       NGN: {
//         annually: {
//           Basic: 15000,
//           "Lifetime Basic": 30000,
//           Pro: 25000,
//           "Lifetime Pro": 50000,
//         },
//         monthly: {
//           Basic: 300,
//           "Lifetime Basic": 600,
//           Pro: 500,
//           "Lifetime Pro": 1000,
//         },
//       },
//       USD: {
//         annually: {
//           Basic: 30,
//           "Lifetime Basic": 60,
//           Pro: 50,
//           "Lifetime Pro": 100,
//         },
//         monthly: {
//           Basic: 3,
//           "Lifetime Basic": 6,
//           Pro: 5,
//           "Lifetime Pro": 10,
//         },
//       },
//     },
//   },
//   {
//     id: "sme",
//     name: "SME",
//     hireRange: "Hire 4–20 People",
//     businessLimit: "Up to 5 Businesses",
//     prices: {
//       NGN: {
//         annually: {
//           Basic: 15000,
//           "Lifetime Basic": 30000,
//           Pro: 25000,
//           "Lifetime Pro": 50000,
//         },
//         monthly: {
//           Basic: 300,
//           "Lifetime Basic": 600,
//           Pro: 500,
//           "Lifetime Pro": 1000,
//         },
//       },
//       USD: {
//         annually: {
//           Basic: 30,
//           "Lifetime Basic": 60,
//           Pro: 50,
//           "Lifetime Pro": 100,
//         },
//         monthly: {
//           Basic: 3,
//           "Lifetime Basic": 6,
//           Pro: 5,
//           "Lifetime Pro": 10,
//         },
//       },
//     },
//   },
//   {
//     id: "corporate",
//     name: "Corporate",
//     hireRange: "Hire 21–100 People",
//     businessLimit: "Up to 10 Businesses",
//     prices: {
//       NGN: {
//         annually: {
//           Basic: 15000,
//           "Lifetime Basic": 30000,
//           Pro: 25000,
//           "Lifetime Pro": 50000,
//         },
//         monthly: {
//           Basic: 5000,
//           "Lifetime Basic": 3000,
//           Pro: 2500,
//           "Lifetime Pro": 5000,
//         },
//       },
//       USD: {
//         annually: {
//           Basic: 30,
//           "Lifetime Basic": 60,
//           Pro: 50,
//           "Lifetime Pro": 100,
//         },
//         monthly: {
//           Basic: 3,
//           "Lifetime Basic": 6,
//           Pro: 5,
//           "Lifetime Pro": 10,
//         },
//       },
//     },
//   },
//   {
//     id: "enterprise",
//     name: "Government/Institution",
//     hireRange: "Hire Unlimited",
//     businessLimit: "Unlimited Businesses",
//     prices: {
//       NGN: {
//         annually: {
//           Basic: requestQuote,
//           "Lifetime Basic": requestQuote,
//           Pro: requestQuote,
//           "Lifetime Pro": requestQuote,
//         },
//         monthly: {
//           Basic: requestQuote,
//           "Lifetime Basic": requestQuote,
//           Pro: requestQuote,
//           "Lifetime Pro": requestQuote,
//         },
//       },
//       USD: {
//         annually: {
//           Basic: requestQuote,
//           "Lifetime Basic": requestQuote,
//           Pro: requestQuote,
//           "Lifetime Pro": requestQuote,
//         },
//         monthly: {
//           Basic: requestQuote,
//           "Lifetime Basic": requestQuote,
//           Pro: requestQuote,
//           "Lifetime Pro": requestQuote,
//         },
//       },
//     },
//   },
// ];

// const addons = [
//   {
//     id: "hiring",
//     name: "Hiring",
//     label: "1 Hire",
//     price: {
//       NGN: 20000,
//       USD: 40,
//     },
//   },
//   {
//     id: "business",
//     name: "Business",
//     label: "1 Business",
//     price: {
//       NGN: 20000,
//       USD: 40,
//     },
//   },
// ];
