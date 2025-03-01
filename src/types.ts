export interface Bird {
  id: string;
  type: 'Layer' | 'Broiler' | 'Dual Purpose';
  age: number; // in weeks
  weight: number; // in kg
  health: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  notes: string;
}

export interface FlockGroup {
  id: string;
  name: string;
  birdType: 'Layer' | 'Broiler' | 'Dual Purpose';
  count: number;
  ageWeeks: number;
  avgWeight: number;
  healthStatus: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  lastUpdated: string; // ISO date string
  notes: string;
}

export interface FeedRecord {
  id: string;
  date: string; // ISO date string
  flockId: string;
  flockName: string;
  feedType: string;
  quantityKg: number;
  costPerKg: number;
}

export interface EggProduction {
  id: string;
  date: string; // ISO date string
  flockId: string;
  flockName: string;
  quantity: number;
  damaged: number;
}

export interface SalesRecord {
  id: string;
  date: string; // ISO date string
  product: 'Eggs' | 'Meat' | 'Birds';
  quantity: number;
  unitPrice: number;
  customer: string;
  notes: string;
}

export interface HealthAlert {
  id: string;
  date: string; // ISO date string
  flockId: string;
  flockName: string;
  severity: 'Low' | 'Medium' | 'High';
  message: string;
  isRead: boolean;
}

export interface MortalityRecord {
  id: string;
  date: string; // ISO date string
  flockId: string;
  flockName: string;
  count: number;
  cause: string;
  notes: string;
}

export interface VaccinationRecord {
  id: string;
  date: string; // ISO date string
  flockId: string;
  flockName: string;
  type: 'Vaccination' | 'Medication';
  name: string;
  dosage?: string;
  notes: string;
  nextDueDate: string | null;
  completed: boolean;
}

export interface ScheduledVaccination {
  id: string;
  scheduledDate: string; // ISO date string
  flockId: string;
  flockName: string;
  treatment: string;
  treatmentType: 'Vaccine' | 'Medication' | 'Supplement';
  notes: string;
  completed: boolean;
}

export interface Expense {
  id: string;
  date: string; // ISO date string
  category: 'Feed' | 'Medication' | 'Equipment' | 'Labor' | 'Utilities' | 'Other';
  amount: number;
  description: string;
}

export interface AppData {
  flocks: FlockGroup[];
  feedRecords: FeedRecord[];
  eggProduction: EggProduction[];
  salesRecords: SalesRecord[];
  healthAlerts: HealthAlert[];
  mortalityRecords: MortalityRecord[];
  vaccinationRecords: VaccinationRecord[];
  scheduledVaccinations: ScheduledVaccination[];
  expenses: Expense[];
  financialRecords: Expense[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  subscription: SubscriptionTier;
}

export type SubscriptionTier = 'free' | 'premium' | 'enterprise';

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'mobile_money' | 'paypal' | 'apple_pay' | 'flutterwave' | 'paystack';
  name: string;
  description: string;
  icon: string;
}

export interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  tier: SubscriptionTier;
  route?: string;
}
