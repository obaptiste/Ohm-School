"use client";

import { create } from "zustand";

type State = {
  role: "learner" | "tutor" | "admin";
  setRole: (role: State["role"]) => void;
};

export const useRoleStore = create<State>((set) => ({
  role: "learner",
  setRole: (role) => set({ role })
}));
