import { supabase } from '../lib/supabase';
import { 
  FlockGroup, 
  FeedRecord, 
  EggProduction, 
  HealthAlert,
  MortalityRecord,
  VaccinationRecord,
  ScheduledVaccination,
  SalesRecord,
  Expense
} from '../types';

// Helper function to get current user ID
const getUserId = async () => {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error('Not authenticated');
  return data.user.id;
};

// FLOCK SERVICES
export const getFlocks = async (): Promise<FlockGroup[]> => {
  const { data, error } = await supabase
    .from('flocks')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching flocks:', error);
    throw error;
  }

  // Convert from snake_case to camelCase
  return data.map((flock: any) => ({
    id: flock.id,
    name: flock.name,
    birdType: flock.bird_type,
    count: flock.count,
    ageWeeks: flock.age_weeks,
    avgWeight: flock.avg_weight,
    healthStatus: flock.health_status,
    lastUpdated: flock.last_updated,
    notes: flock.notes
  })) as FlockGroup[];
};

export const createFlock = async (flock: Omit<FlockGroup, 'id'>): Promise<FlockGroup> => {
  const userId = await getUserId();

  const { data, error } = await supabase
    .from('flocks')
    .insert({
      name: flock.name,
      bird_type: flock.birdType,
      count: flock.count,
      age_weeks: flock.ageWeeks,
      avg_weight: flock.avgWeight,
      health_status: flock.healthStatus,
      last_updated: flock.lastUpdated,
      notes: flock.notes,
      user_id: userId
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating flock:', error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    birdType: data.bird_type,
    count: data.count,
    ageWeeks: data.age_weeks,
    avgWeight: data.avg_weight,
    healthStatus: data.health_status,
    lastUpdated: data.last_updated,
    notes: data.notes
  } as FlockGroup;
};

export const updateFlock = async (flock: FlockGroup): Promise<FlockGroup> => {
  const { error } = await supabase
    .from('flocks')
    .update({
      name: flock.name,
      bird_type: flock.birdType,
      count: flock.count,
      age_weeks: flock.ageWeeks,
      avg_weight: flock.avgWeight,
      health_status: flock.healthStatus,
      last_updated: flock.lastUpdated,
      notes: flock.notes
    })
    .eq('id', flock.id);

  if (error) {
    console.error('Error updating flock:', error);
    throw error;
  }

  return flock;
};

export const deleteFlock = async (flockId: string): Promise<void> => {
  const { error } = await supabase
    .from('flocks')
    .delete()
    .eq('id', flockId);

  if (error) {
    console.error('Error deleting flock:', error);
    throw error;
  }
};

// FEED RECORDS
export const getFeedRecords = async (): Promise<FeedRecord[]> => {
  const { data, error } = await supabase
    .from('feed_records')
    .select('*, flocks(name)')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching feed records:', error);
    throw error;
  }

  return data.map((record: any) => ({
    id: record.id,
    date: record.date,
    flockId: record.flock_id,
    flockName: record.flocks?.name || 'Unknown Flock',
    feedType: record.feed_type,
    quantityKg: record.quantity_kg,
    costPerKg: record.cost_per_kg
  })) as FeedRecord[];
};

// HEALTH ALERTS
export const getHealthAlerts = async (): Promise<HealthAlert[]> => {
  const { data, error } = await supabase
    .from('health_alerts')
    .select('*, flocks(name)')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching health alerts:', error);
    throw error;
  }

  return data.map((alert: any) => ({
    id: alert.id,
    date: alert.date,
    flockId: alert.flock_id,
    flockName: alert.flocks?.name || 'Unknown Flock',
    severity: alert.severity,
    message: alert.message,
    isRead: alert.is_read
  })) as HealthAlert[];
};

// EGG PRODUCTION
export const getEggProduction = async (): Promise<EggProduction[]> => {
  const { data, error } = await supabase
    .from('egg_production')
    .select('*, flocks(name)')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching egg production:', error);
    throw error;
  }

  return data.map((record: any) => ({
    id: record.id,
    date: record.date,
    flockId: record.flock_id,
    flockName: record.flocks?.name || 'Unknown Flock',
    quantity: record.quantity,
    damaged: record.damaged
  })) as EggProduction[];
};

// MORTALITY RECORDS
export const getMortalityRecords = async (): Promise<MortalityRecord[]> => {
  const { data, error } = await supabase
    .from('mortality_records')
    .select('*, flocks(name)')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching mortality records:', error);
    throw error;
  }

  return data.map((record: any) => ({
    id: record.id,
    date: record.date,
    flockId: record.flock_id,
    flockName: record.flocks?.name || 'Unknown Flock',
    count: record.count,
    cause: record.cause,
    notes: record.notes
  })) as MortalityRecord[];
};

// VACCINATION RECORDS
export const getVaccinationRecords = async (): Promise<VaccinationRecord[]> => {
  const { data, error } = await supabase
    .from('vaccination_records')
    .select('*, flocks(name)')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching vaccination records:', error);
    throw error;
  }

  return data.map((record: any) => ({
    id: record.id,
    date: record.date,
    flockId: record.flock_id,
    flockName: record.flocks?.name || 'Unknown Flock',
    treatment: record.treatment,
    treatmentType: record.treatment_type,
    notes: record.notes,
    completed: record.completed
  })) as VaccinationRecord[];
};

// SCHEDULED VACCINATIONS
export const getScheduledVaccinations = async (): Promise<ScheduledVaccination[]> => {
  const { data, error } = await supabase
    .from('scheduled_vaccinations')
    .select('*, flocks(name)')
    .order('scheduled_date', { ascending: true });

  if (error) {
    console.error('Error fetching scheduled vaccinations:', error);
    throw error;
  }

  return data.map((record: any) => ({
    id: record.id,
    scheduledDate: record.scheduled_date,
    flockId: record.flock_id,
    flockName: record.flocks?.name || 'Unknown Flock',
    treatment: record.treatment,
    treatmentType: record.treatment_type,
    notes: record.notes,
    completed: record.completed
  })) as ScheduledVaccination[];
};

// SALES RECORDS
export const getSalesRecords = async (): Promise<SalesRecord[]> => {
  const { data, error } = await supabase
    .from('sales_records')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching sales records:', error);
    throw error;
  }

  return data.map((record: any) => ({
    id: record.id,
    date: record.date,
    product: record.product,
    quantity: record.quantity,
    unitPrice: record.unit_price,
    customer: record.customer,
    notes: record.notes
  })) as SalesRecord[];
};

// EXPENSES
export const getExpenses = async (): Promise<Expense[]> => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }

  return data.map((expense: any) => ({
    id: expense.id,
    date: expense.date,
    category: expense.category,
    amount: expense.amount,
    description: expense.description
  })) as Expense[];
};
