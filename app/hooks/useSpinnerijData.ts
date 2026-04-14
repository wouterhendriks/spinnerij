import { useContext } from "react";
import { SpinnerijDataContext } from "@/providers/SpinnerijDataProvider";

export function useSpinnerijData() {
  const context = useContext(SpinnerijDataContext);
  if (!context) {
    throw new Error("useSpinnerijData must be used within SpinnerijDataProvider");
  }
  return context;
}
