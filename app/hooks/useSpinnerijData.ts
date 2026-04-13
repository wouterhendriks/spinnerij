import { useState, useEffect, useCallback } from "react";
import { DATA_URL } from "@/constants/api";
import type { SpinnerijData } from "@/constants/types";

export function useSpinnerijData() {
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

  return { data, loading, error, refresh: fetchData };
}
