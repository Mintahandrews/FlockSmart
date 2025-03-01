import { useState, useEffect } from "react";
import { AppData } from "../types";
import { supabase } from "../lib/supabase";

// Initialize empty data structure
const emptyData: AppData = {
  flocks: [],
  feedRecords: [],
  eggProduction: [],
  healthAlerts: [],
  mortalityRecords: [],
  vaccinationRecords: [],
  scheduledVaccinations: [],
  salesRecords: [],
  expenses: [],
  financialRecords: [],
};

export const useSupabaseData = () => {
  const [data, setData] = useState<AppData>(emptyData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load data from Supabase on initial render and when user changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.user) {
          // If no authenticated user, use empty data
          setData(emptyData);
          return;
        }

        // Try to fetch user's data from Supabase
        const { data: userData, error } = await supabase
          .from("user_data")
          .select("*")
          .eq("user_id", session.session.user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          // PGRST116 means no rows returned
          throw error;
        }

        if (userData) {
          setData(userData.data);
        } else {
          // For new users, initialize with empty data and save to Supabase
          await supabase.from("user_data").insert({
            user_id: session.session.user.id,
            data: emptyData,
          });
          setData(emptyData);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setData(emptyData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Create a wrapped setData function that also updates Supabase
  const setDataAndPersist = async (
    newData: AppData | ((prevData: AppData) => AppData)
  ) => {
    setData((prevData) => {
      const updatedData =
        typeof newData === "function" ? newData(prevData) : newData;

      // Save to Supabase
      const saveToSupabase = async () => {
        const { data: session } = await supabase.auth.getSession();
        if (session?.session?.user) {
          await supabase.from("user_data").upsert({
            user_id: session.session.user.id,
            data: updatedData,
          });
        }
      };

      // Fire and forget - don't wait for the save to complete
      saveToSupabase().catch((err) =>
        console.error("Failed to save data:", err)
      );

      return updatedData;
    });
  };

  return { data, setData: setDataAndPersist, isLoading, error };
};
