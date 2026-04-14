import { createContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { DATA_URL } from "@/constants/api";
import type { SpinnerijData } from "@/constants/types";

export interface SpinnerijDataContextValue {
  data: SpinnerijData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const SpinnerijDataContext = createContext<SpinnerijDataContextValue | null>(null);

export function SpinnerijDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SpinnerijData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(DATA_URL);

      if (!response.ok) {
        throw new Error(`Data kon niet geladen worden (${response.status})`);
      }

      const json: SpinnerijData = await response.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er ging iets mis");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <SpinnerijDataContext.Provider value={{ data, loading, error, refresh: fetchData }}>
      {children}
    </SpinnerijDataContext.Provider>
  );
}
