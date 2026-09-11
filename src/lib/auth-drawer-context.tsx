"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type AuthDrawerMode = "login" | "register";

interface AuthDrawerContextValue {
  open: boolean;
  mode: AuthDrawerMode;
  openDrawer: (mode?: AuthDrawerMode) => void;
  closeDrawer: () => void;
  setMode: (mode: AuthDrawerMode) => void;
}

const AuthDrawerContext = createContext<AuthDrawerContextValue | null>(null);

// Sign in/create account now happens in a slide-out drawer (mirroring
// CartDrawer) instead of dedicated /login and /register pages — this just
// tracks whether it's open and which form it's showing, so any part of the
// site (header icon, a "sign in to save" prompt, checkout) can trigger it.
export function AuthDrawerProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AuthDrawerMode>("login");

  return (
    <AuthDrawerContext.Provider
      value={{
        open,
        mode,
        openDrawer: (m) => {
          if (m) setMode(m);
          setOpen(true);
        },
        closeDrawer: () => setOpen(false),
        setMode,
      }}
    >
      {children}
    </AuthDrawerContext.Provider>
  );
}

export function useAuthDrawer(): AuthDrawerContextValue {
  const ctx = useContext(AuthDrawerContext);
  if (!ctx) throw new Error("useAuthDrawer must be used within an AuthDrawerProvider");
  return ctx;
}
