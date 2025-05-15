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
  resourceAccess: string;
  profileLimit: string;
  prices: PlanPrices;
}

interface AddOn {
  id: string;
  name: string;
  label: string;
  planName: string;
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

// Note: The plans data structure is expected to be fetched from an API endpoint.
// const plans = [
//   {
//   "id": "intern",
//   "name": "Intern",
//   "profileLimit": "Up to 2 Profiles",
//   "resourceAccess": "Can function as 1 Resource",
//   "prices": {
//     "NGN": {
//       "annually": {
//         "Basic": 15000,
//         "Lifetime Basic": 30000,
//         "Pro": 25000,
//         "Lifetime Pro": 50000
//       },
//       "monthly": {
//         "Basic": 5000
//       }
//     },
//     "USD": {
//       "annually": {
//         "Basic": 30,
//         "Lifetime Basic": 60,
//         "Pro": 50,
//         "Lifetime Pro": 100
//       },
//       "monthly": {
//         "Basic": 10
//       }
//     }
//   }
// },
//   {
//   "id": "junior",
//   "name": "Junior",
//   "profileLimit": "Up to 5 Profiles",
//   "resourceAccess": "Can function as all Resource",
//   "prices": {
//     "NGN": {
//       "annually": {
//         "Basic": 15000,
//         "Lifetime Basic": 30000,
//         "Pro": 25000,
//         "Lifetime Pro": 50000
//       },
//       "monthly": {
//         "Basic": 5000
//       }
//     },
//     "USD": {
//       "annually": {
//         "Basic": 30,
//         "Lifetime Basic": 60,
//         "Pro": 50,
//         "Lifetime Pro": 100
//       },
//       "monthly": {
//         "Basic": 10
//       }
//     }
//   }
// }

//   ...
// ]

//for the add ons
//const addOns = [
//   {
//     id: "addon1_intern",
//     name: "Profile",
//     label: "Extra Profile",
//     planName: "Intern",
//     price: { NGN: 5000, USD: 10 },
//   },
//   {
//     id: "addon2_intern",
//     name: "Resource",
//     label: "Premium Support",
//     planName: "Intern",
//     price: { NGN: 3000, USD: 6 },
//   },
//   {
//     id: "addon1_junior",
//     name: "Profile",
//     label: "Extra Profile",
//     planName: "Junior",
//     price: { NGN: 6000, USD: 12 },
//   },
//   {
//     id: "addon2_junior",
//     name: "Resource",
//     label: "Premium Support",
//     planName: "Junior",
//     price: { NGN: 4000, USD: 8 },
//   },
// ];
