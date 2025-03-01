import { AppData, FlockGroup } from "./types";
import { isBefore } from "date-fns";

export const getDataFromLocalStorage = (): AppData => {
  try {
    const savedData = localStorage.getItem("poultryAppData");
    if (savedData) {
      return JSON.parse(savedData);
    }
    return {
      flocks: [],
      eggProduction: [],
      feedRecords: [],
      salesRecords: [],
      healthAlerts: [],
      vaccinationRecords: [],
      financialRecords: [],
      mortalityRecords: [],
      scheduledVaccinations: [],
      expenses: [],
    };
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return {
      flocks: [],
      eggProduction: [],
      feedRecords: [],
      salesRecords: [],
      healthAlerts: [],
      vaccinationRecords: [],
      financialRecords: [],
      mortalityRecords: [],
      scheduledVaccinations: [],
      expenses: [],
    };
  }
};

export const saveDataToLocalStorage = (data: AppData): void => {
  try {
    localStorage.setItem("poultryAppData", JSON.stringify(data));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

export const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

export const formatCurrency = (amount: number): string => {
  try {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    console.error("Error formatting currency:", error);
    return `GHS ${amount.toFixed(2)}`;
  }
};

export const calculateEggProductionRate = (
  eggCount: number,
  birdCount: number
): string => {
  if (birdCount <= 0) return "0.0%";
  const rate = (eggCount / birdCount) * 100;
  return `${rate.toFixed(1)}%`;
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

export const calculateAge = (dateString: string): string => {
  try {
    const now = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 1) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  } catch (error) {
    console.error("Error calculating age:", error);
    return "Unknown";
  }
};

// Validate input number, return default if invalid
export const validateNumber = (
  value: any,
  defaultValue: number = 0
): number => {
  const num = parseFloat(value);
  return isNaN(num) ? defaultValue : num;
};

// Sort array of objects by date (newest first)
export const sortByDate = <T extends { date?: string; scheduledDate?: string }>(
  items: T[],
  field: "date" | "scheduledDate" = "date",
  order: "asc" | "desc" = "desc"
): T[] => {
  return [...items].sort((a, b) => {
    const dateA = new Date(a[field] || "").getTime();
    const dateB = new Date(b[field] || "").getTime();
    return order === "desc" ? dateB - dateA : dateA - dateB;
  });
};

// Get flock name safely
export const getFlockName = (
  flockId: string,
  flocks: Array<{ id: string; name: string }>
): string => {
  const flock = flocks.find((f) => f.id === flockId);
  return flock ? flock.name : "Unknown Flock";
};

// Get a flock by ID
export const getFlockById = (
  flockId: string,
  data: AppData
): FlockGroup | undefined => {
  return data.flocks.find((flock) => flock.id === flockId);
};

// Format date to YYYY-MM-DD for input fields
export const formatDateForInput = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  } catch (error) {
    console.error("Error formatting date for input:", error);
    return "";
  }
};

// Calculate the total mortality rate
export const calculateMortalityRate = (
  data: AppData
): { total: number; rate: string } => {
  const totalBirds = data.flocks.reduce((sum, flock) => sum + flock.count, 0);
  const totalMortality = data.mortalityRecords.reduce(
    (sum, record) => sum + record.count,
    0
  );

  // Calculate rate based on total birds ever (current + mortality)
  const totalBirdsEver = totalBirds + totalMortality;
  const rate = totalBirdsEver > 0 ? (totalMortality / totalBirdsEver) * 100 : 0;

  return {
    total: totalMortality,
    rate: rate.toFixed(2) + "%",
  };
};

// Check for overdue vaccinations
export const checkOverdueVaccinations = (data: AppData): number => {
  const today = new Date();
  return data.scheduledVaccinations.filter(
    (vax) => !vax.completed && isBefore(new Date(vax.scheduledDate), today)
  ).length;
};

// Format date difference as a human-readable string
export const formatDateDifference = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      const absDiffDays = Math.abs(diffDays);
      if (absDiffDays === 0) return "Today";
      if (absDiffDays === 1) return "Yesterday";
      if (absDiffDays < 7) return `${absDiffDays} days ago`;
      if (absDiffDays < 30) return `${Math.floor(absDiffDays / 7)} weeks ago`;
      return `${Math.floor(absDiffDays / 30)} months ago`;
    } else {
      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Tomorrow";
      if (diffDays < 7) return `In ${diffDays} days`;
      if (diffDays < 30) return `In ${Math.floor(diffDays / 7)} weeks`;
      return `In ${Math.floor(diffDays / 30)} months`;
    }
  } catch (error) {
    console.error("Error calculating date difference:", error);
    return "Unknown";
  }
};

// Function to check if a premium route is being accessed
export const isPremiumRoute = (pathname: string): boolean => {
  const premiumRoutes = ["/vaccinations", "/financial", "/mortality"];

  return premiumRoutes.some((route) => pathname === route);
};
