import { useCallback, useEffect, useState } from "react";
import { mapCatchRow } from "../lib/catches";
import { DEMO_CATCHES } from "../lib/demoData";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

export function useCatches() {
  const [catches, setCatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [source, setSource] = useState("supabase");

  const fetchCatches = useCallback(async () => {
    setLoading(true);
    setError("");

    if (!isSupabaseConfigured || !supabase) {
      if (import.meta.env.DEV) {
        setCatches(DEMO_CATCHES);
        setSource("demo");
      } else {
        setCatches([]);
        setSource("supabase");
        setError("Supabase är inte konfigurerat.");
      }
      setLoading(false);
      return;
    }

    const { data, error: queryError } = await supabase
      .from("catches")
      .select("*")
      .order("date", { ascending: false })
      .order("created_at", { ascending: false });

    if (queryError) {
      if (import.meta.env.DEV) {
        setCatches(DEMO_CATCHES);
        setSource("demo");
        setError(`Supabase-fel, demo används: ${queryError.message}`);
      } else {
        setCatches([]);
        setSource("supabase");
        setError(queryError.message);
      }
      setLoading(false);
      return;
    }

    setCatches((data || []).map(mapCatchRow).filter(Boolean));
    setSource("supabase");
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCatches();
  }, [fetchCatches]);

  return {
    catches,
    setCatches,
    loading,
    error,
    source,
    usingDemo: source === "demo",
    refresh: fetchCatches
  };
}
