import { create } from "zustand";

type Currency = "NGN" | "USD";
type BillingCycle = "monthly" | "annually";
export type PriceType = "Basic" | "Lifetime Basic" | "Pro" | "Lifetime Pro";

interface PlanPrice {
  monthly: number | null;
  annually: number | null;
}

interface Plan {
  id: string;
  name: string;
  hireRange: string;
  businessLimit: string;
  requestQuote?: boolean;
  prices: {
    NGN: PlanPrice;
    USD: PlanPrice;
  };
}

interface AddOn {
  id: string;
  label: string;
  price: {
    NGN: number;
    USD: number;
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
  setSelectedAddOns: (
    updater: string[] | ((prev: string[]) => string[])
  ) => void;
  totalPrice: number | null;

  setPlans: (plans: Plan[]) => void;
  setAddOns: (addOns: AddOn[]) => void;
  setCurrency: (currency: Currency) => void;
  setBillingCycle: (
    cycle: BillingCycle | ((prev: BillingCycle) => BillingCycle)
  ) => void;
  openModal: (planId: string, priceType: PriceType) => void;
  closeModal: () => void;
  setIncludeAddOns: (value: boolean) => void;
  setTotalPrice: (price: number | null) => void;
  setSelectedPlanId: (id: string | null) => void;
  setSelectedPriceType: (type: PriceType | null) => void;
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
  selectedAddOns: [],
  setSelectedAddOns: (updater) =>
    set((state) => ({
      selectedAddOns:
        typeof updater === "function" ? updater(state.selectedAddOns) : updater,
    })),
}));



//mock data
//for pricing plans
// [
//   {
//     id: "free",
//     name: "Free for Life",
//     hireRange: "Hire for 1 Slot",
//     businessLimit: "1 Business",
//     prices: {
//       NGN: {
//         annually: 0,
//         monthly: 0,
//       },
//       USD: {
//         annually: 0,
//         monthly: 0,
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
//         annually: 30000,
//         monthly: 3000,
//       },
//       USD: {
//         annually: 60,
//         monthly: 6,
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
//         annually: 50000,
//         monthly: 5000,
//       },
//       USD: {
//         annually: 100,
//         monthly: 10,
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
//         annually: 90000,
//         monthly: 9000,
//       },
//       USD: {
//         annually: 180,
//         monthly: 18,
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
//         annually: 0, // Request quote
//         monthly: 0,
//       },
//       USD: {
//         annually: 0,
//         monthly: 0,
//       },
//     },
//   },
// ];

//for add-ons
// [
//   {
//     id: "hiring",
//     type: "Hiring",
//     label: "1 Hire",
//     price: {
//       NGN: 20000,
//       USD: 40,
//     },
//     description: "Add 1 extra hire slot to your plan",
//   },
//   {
//     id: "business",
//     type: "Business",
//     label: "1 Business",
//     price: {
//       NGN: 20000,
//       USD: 40,
//     },
//     description: "Add 1 more business to manage",
//   },
// ];
