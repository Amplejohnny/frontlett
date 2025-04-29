import { create } from "zustand";
import { type AxiosResponse } from "axios";
import { deleteRequest, get, post } from "../libs/axios";
import { persist, createJSONStorage } from "zustand/middleware";

type User = {
  // workId: string;
  email: string;
  id: string;
  full_name: string;
  referral_code: string;
  username: string;
  phone_number: string;
  location?: string;
  company_name?: string;
  invited_count: number;
  invite_tokens: number;
  role: "employee" | "business" | "admin" | "adviser" | "influencer";
  // linkedIn: string;
  created_at: string;
  profile: Profile;
  percentage_completed: number;
};

interface Profile {
  profile_picture: string;
  about: string;
  professional_headline: string;
  availability: any;
  roles: string[];
  skills: string[];
  rate: number;
  is_completed: boolean;
  steps: number;
}

interface ResetPasswordPayload {
  email: string;
  password: string;
  token: string;
}

interface UseAuthStore {
  user: User | null;
  token: string | null;
  updateToken: (token: string) => void;
  invite_code: string;
  updateCode: (code: string) => void;
  number: string;
  step: number;
  updateStep: (step: number) => void;
  updateNumber: (code: string) => void;
  signIn: (form: { email: string; password: string }) => Promise<any>;
  fetchCurrentUser: () => Promise<void>;
  register: (details: any) => Promise<any>;
  updateUser: (user: any) => void;
  logout: () => Promise<void>;
  // google: (state: {code: string, mode: 'register' | 'login', redirectUrl: string, state?: string|null}, details?: any) => Promise<void>;
  google: (details?: any) => Promise<{ success: boolean; url: string }>;
  sendResetLink: (email: string) => Promise<any>;
  resetPassword: (payload: ResetPasswordPayload) => Promise<any>;
}
interface AuthResponse {
  code: number;
  error: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
  errors?: [];
}
interface ValidationError {
  field: string;
  message: string;
}

interface FormErrors {
  [key: string]: string;
}

const useAuth = create<UseAuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      updateToken: (token: string) => set({ token }),
      invite_code: "",
      updateCode: (code: any) => set({ invite_code: code }),
      number: "",
      updateNumber: (number: any) => set({ number: number }),
      step: 0,
      updateStep: (number: any) => set({ step: number }),
      signIn: async (form: {
        email: string;
        password: string;
      }): Promise<void> => {
        try {
          const response: AxiosResponse = await post(`/auth/login`, {
            email: form.email,
            password: form.password,
          });

          // const userData = response.data;
          // console.log(response.data);
          set({ token: response.data.token });
          // console.log("SETUP", { user: response.data.user });
          return Promise.resolve(response.data.success);
        } catch (error: any) {
          if (error.status === 422) {
            const validationErrors: FormErrors = {};
            for (const err in error.validationErrors) {
              validationErrors[err] = error.validationErrors[err][0];
            }
            return Promise.reject(validationErrors);
            // console.log(validationErrors)
            // setErrors(validationErrors);
          } else if (error.status === 419) {
            return Promise.reject({ username: "Invalid username or password" });
          }
          console.log(error);
          // Handle authentication errors
        }
      },
      fetchCurrentUser: async (): Promise<void> => {
        try {
          const response: AxiosResponse = await get(`/auth/user`);

          const userData = response.data;

          set({ user: response.data.user });
        } catch (error: unknown) {
          console.log(error);
          // Handle authentication errors
        }
      },
      updateUser: (user: any) =>
        set((state: { user: any }) => ({
          user: { ...state.user, ...user },
        })),
      register: async (details: any): Promise<any> => {
        try {
          const response: AxiosResponse = await post(`/auth/register`, details);

          // const userData = response.data.data;

          set({ token: response.data.token });
          return Promise.resolve(response.data.success);
          // console.log("SETUP", { token: userData.token });
        } catch (error: any) {
          if (error.status === 422) {
            const validationErrors: FormErrors = {};
            for (const err in error.validationErrors) {
              validationErrors[err] = error.validationErrors[err][0];
            }
            return Promise.reject(validationErrors);
          } else if (error.status === 419) {
            return Promise.reject({ username: "Invalid username or password" });
          }
          // Handle authentication errors
        }
      },
      logout: async () => {
        try {
          const response: AxiosResponse = await deleteRequest(`/auth/logout`);
          if (response.data.success) {
            set({ token: null });
          }

          // console.log("SETUP", { token: userData.token });
        } catch (error: any) {
          // Handle authentication errors
        }
      },
      google: async (details) => {
        try {
          // const response: AxiosResponse = await get("/auth/google/callback", { ...state, ...details })
          const response: AxiosResponse = await post(
            `/auth/google/callback`,
            details
          );

          // const userData = response.data.data;

          set({ token: response.data.token });
          return Promise.resolve(response.data.success);
          // console.log("SETUP", { token: userData.token });
        } catch (error: any) {
          if (error.status === 422) {
            const validationErrors: FormErrors = {};
            for (const err in error.validationErrors) {
              validationErrors[err] = error.validationErrors[err][0];
            }
            return Promise.reject(validationErrors);
          } else if (error.status === 419) {
            return Promise.reject({ username: "Invalid username or password" });
          }
          // Handle authentication errors
        }
      },
      //forget password
      sendResetLink: async (email: string) => {
        try {
          const response: AxiosResponse = await post("/auth/forgot-password", {
            email,
          });
          return Promise.resolve(response.data?.success);
        } catch (error: any) {
          return Promise.reject({
            general: "Failed to send reset link. Please try again.",
          });
        }
      },
      //reset password
      resetPassword: async ({ email, password, token }) => {
        try {
          const response: AxiosResponse = await post("/auth/reset-password", {
            email,
            password,
            token,
          });

          const { success } = response.data;
          return Promise.resolve(success);
        } catch (error: any) {
          if (error.status === 422) {
            const validationErrors: FormErrors = {};
            for (const err in error.validationErrors) {
              validationErrors[err] = error.validationErrors[err][0];
            }
            return Promise.reject(validationErrors);
          }
          return Promise.reject({ general: "Failed to reset password" });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state: UseAuthStore) => ({
        token: state.token,
        user: state.user,
        number: state.number,
        // isActivated: state.isActivated,
      }),
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useAuth;

// Export a way to get state directly
export const getAuthState = () => useAuth.getState();
