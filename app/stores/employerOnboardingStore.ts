import { create } from "zustand";

interface BusinessDetails {
  industry?: string;
  organisationSize?: string;
  description?: string;
  address?: string;
  country?: string;
  state?: string;
  email?: string;
  website?: string;
}

interface ContactPerson {
  name?: string;
  role?: string;
  email?: string;
  phone?: string;
}

interface ProfileMedia {
  logo?: File | null;
  coverPhoto?: File | null;
}

interface EmployerOnboardingStore {
  business: BusinessDetails;
  contact: ContactPerson;
  media: ProfileMedia;
  updateBusiness: (data: BusinessDetails) => void;
  updateContact: (data: ContactPerson) => void;
  updateMedia: (data: ProfileMedia) => void;
  reset: () => void;
}

const useEmployerOnboardingStore = create<EmployerOnboardingStore>((set) => ({
  business: {},
  contact: {},
  media: {},
  updateBusiness: (data) =>
    set((state) => ({ business: { ...state.business, ...data } })),
  updateContact: (data) =>
    set((state) => ({ contact: { ...state.contact, ...data } })),
  updateMedia: (data: Partial<ProfileMedia>) =>
    set((state) => ({ media: { ...state.media, ...data } })),
  reset: () => set({ business: {}, contact: {}, media: {} }),
}));

export default useEmployerOnboardingStore;
