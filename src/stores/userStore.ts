import { create } from "zustand";

import UserType from "@/types/user";

type userState = {
  user: UserType | null;
  setUser: (user: Partial<UserType>) => void;
  clearUser: () => void;
};

export const useUserStore = create<userState>()((set) => ({
  user: null,

  setUser: (user) =>
    set((state) => ({
      user: { ...state.user, ...user },
    })),

  clearUser: () => set({ user: null }),
}));
