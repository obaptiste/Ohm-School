"use client";

import { create } from "zustand";

/**
 * Role types for the application.
 * - learner: Standard user role for diagnosis and learning
 * - tutor: Instructor role with expanded educational content
 * - admin: Administrator role for content management
 */
type Role = "learner" | "tutor" | "admin";

type State = {
  role: Role;
  error?: string;
  setRole: (role: Role) => void;
  setError: (error?: string) => void;
  clearError: () => void;
};

/**
 * Global role store using Zustand.
 * Manages the current user role and any associated errors.
 */
export const useRoleStore = create<State>((set) => ({
  role: "learner",
  error: undefined,
  setRole: (role: Role) => set({ role }),
  setError: (error?: string) => set({ error }),
  clearError: () => set({ error: undefined })
}));
