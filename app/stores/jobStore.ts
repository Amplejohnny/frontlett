import { create } from "zustand";
import { get as axiosGet, post, deleteRequest } from "~/libs/axios";
import { type AxiosResponse } from "axios";

type JobApplication = {
  id: number;
  employer: {
    name: string;
    profile_picture: string;
  };
  title: string;
  applied_date: string;
  response_received?: string;
  interview_scheduled?: string;
  feedback?: string;
  status: "Selected" | "In Review" | "Not Selected" | "Posting Expired";
  offer_accepted?: boolean;
};

// Define API response interfaces
interface FetchApplicationsResponse {
  success: boolean;
  applications: JobApplication[]; // Explicitly non-optional
}

interface ActionResponse {
  success: boolean;
  message?: string;
}

interface JobState {
  viewMode: "grid" | "table";
  applications: JobApplication[];
  loading: boolean;
  error: string | null;
  actionLoading: boolean;
  actionError: string | null;
  setViewMode: (mode: "grid" | "table") => void;
  fetchApplications: () => Promise<void>;
  acceptOffer: (applicationId: number) => Promise<void>;
  withdrawApplication: (applicationId: number) => Promise<void>;
  clearActionError: () => void;
}

export const useJobStore = create<JobState>((set, get) => ({
  viewMode: "grid",
  applications: [],
  loading: true,
  error: null,
  actionLoading: false,
  actionError: null,
  setViewMode: (mode) => set({ viewMode: mode }),
  fetchApplications: async () => {
    set({ loading: true, error: null });
    try {
      const response: AxiosResponse<FetchApplicationsResponse> =
        await axiosGet<FetchApplicationsResponse>("jobs/applications");
      const { success, applications } = response.data;
      if (success) {
        // Ensure applications is always an array
        const apps = Array.isArray(applications) ? applications : [];
        set({ applications: apps });
      } else {
        set({ error: "Failed to fetch applications" });
      }
    } catch (error) {
      set({ error: "An error occurred while fetching applications" });
    } finally {
      set({ loading: false });
    }
  },
  acceptOffer: async (applicationId: number) => {
    set({ actionLoading: true, actionError: null });
    try {
      const response: AxiosResponse<ActionResponse> = await post<
        {},
        ActionResponse
      >(`/jobs/applications/${applicationId}/accept`, {});
      if (response.data.success) {
        const updatedApplications = get().applications.map((app) =>
          app.id === applicationId
            ? { ...app, status: "Selected" as const, offer_accepted: true }
            : app
        );
        set({ applications: updatedApplications });
      } else {
        set({ actionError: response.data.message || "Failed to accept offer" });
      }
    } catch (error) {
      set({ actionError: "An error occurred while accepting the offer" });
    } finally {
      set({ actionLoading: false });
    }
  },
  withdrawApplication: async (applicationId: number) => {
    set({ actionLoading: true, actionError: null });
    try {
      const response: AxiosResponse<ActionResponse> =
        await deleteRequest<ActionResponse>(
          `/jobs/applications/${applicationId}`
        );
      if (response.data.success) {
        const updatedApplications = get().applications.filter(
          (app) => app.id !== applicationId
        );
        set({ applications: updatedApplications });
      } else {
        set({
          actionError:
            response.data.message || "Failed to withdraw application",
        });
      }
    } catch (error) {
      set({
        actionError: "An error occurred while withdrawing the application",
      });
    } finally {
      set({ actionLoading: false });
    }
  },
  clearActionError: () => set({ actionError: null }),
}));
