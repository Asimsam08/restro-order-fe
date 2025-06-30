
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Role = "customer" | "restaurant";

interface AuthState {
  isLoggedIn: boolean;
  role: Role | null;
  token: string | null;
  userEmail: string | null;
  username: string | null;
  userId : string | null
  hasHydrated: boolean;
  login: (data: {
    role: Role;
    token: string;
    userEmail: string;
    username: string;
    userId : string
  }) => void;
  logout: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      role: null,
      token: null,
      username: null,
      userId: null,
      userEmail: null,
      hasHydrated: false,
      login: ({ role, token, userEmail, username, userId }) =>
        set({
          isLoggedIn: true,
          role,
          token,
          userEmail,
          username,
          userId
        }),
      logout: () =>
        set({
          isLoggedIn: false,
          role: null,
          token: null,
          userEmail: null,
          username: null,
          userId : null
        }),
      setHasHydrated: (value: boolean) => set({ hasHydrated: value }),
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
