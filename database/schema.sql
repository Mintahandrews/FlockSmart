-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (managed by Supabase Auth)
-- Note: This table is automatically created by Supabase Auth

-- User Data table for storing application-specific user data
CREATE TABLE IF NOT EXISTS user_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Flocks table
CREATE TABLE IF NOT EXISTS flocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  bird_type VARCHAR(100) NOT NULL,
  count INTEGER NOT NULL,
  age_weeks INTEGER NOT NULL,
  avg_weight DECIMAL(10,2),
  health_status VARCHAR(50) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Feed Records table
CREATE TABLE IF NOT EXISTS feed_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  flock_id UUID NOT NULL REFERENCES flocks(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  feed_type VARCHAR(100) NOT NULL,
  quantity_kg DECIMAL(10,2) NOT NULL,
  cost_per_kg DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Health Alerts table
CREATE TABLE IF NOT EXISTS health_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  flock_id UUID NOT NULL REFERENCES flocks(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  severity VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Egg Production table
CREATE TABLE IF NOT EXISTS egg_production (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  flock_id UUID NOT NULL REFERENCES flocks(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  quantity INTEGER NOT NULL,
  damaged INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Mortality Records table
CREATE TABLE IF NOT EXISTS mortality_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  flock_id UUID NOT NULL REFERENCES flocks(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  count INTEGER NOT NULL,
  cause VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Vaccination Records table
CREATE TABLE IF NOT EXISTS vaccination_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  flock_id UUID NOT NULL REFERENCES flocks(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  treatment VARCHAR(255) NOT NULL,
  treatment_type VARCHAR(100) NOT NULL,
  notes TEXT,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Scheduled Vaccinations table
CREATE TABLE IF NOT EXISTS scheduled_vaccinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  flock_id UUID NOT NULL REFERENCES flocks(id) ON DELETE CASCADE,
  scheduled_date DATE NOT NULL,
  treatment VARCHAR(255) NOT NULL,
  treatment_type VARCHAR(100) NOT NULL,
  notes TEXT,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Sales Records table
CREATE TABLE IF NOT EXISTS sales_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  product VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  customer VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  category VARCHAR(100) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_flocks_user_id ON flocks(user_id);
CREATE INDEX IF NOT EXISTS idx_feed_records_flock_id ON feed_records(flock_id);
CREATE INDEX IF NOT EXISTS idx_health_alerts_flock_id ON health_alerts(flock_id);
CREATE INDEX IF NOT EXISTS idx_egg_production_flock_id ON egg_production(flock_id);
CREATE INDEX IF NOT EXISTS idx_mortality_records_flock_id ON mortality_records(flock_id);
CREATE INDEX IF NOT EXISTS idx_vaccination_records_flock_id ON vaccination_records(flock_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_vaccinations_flock_id ON scheduled_vaccinations(flock_id);
CREATE INDEX IF NOT EXISTS idx_sales_records_user_id ON sales_records(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);

-- Create date-based indexes for time-series queries
CREATE INDEX IF NOT EXISTS idx_feed_records_date ON feed_records(date);
CREATE INDEX IF NOT EXISTS idx_health_alerts_date ON health_alerts(date);
CREATE INDEX IF NOT EXISTS idx_egg_production_date ON egg_production(date);
CREATE INDEX IF NOT EXISTS idx_mortality_records_date ON mortality_records(date);
CREATE INDEX IF NOT EXISTS idx_vaccination_records_date ON vaccination_records(date);
CREATE INDEX IF NOT EXISTS idx_scheduled_vaccinations_date ON scheduled_vaccinations(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_sales_records_date ON sales_records(date);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);

-- Create Row Level Security (RLS) policies
-- Enable RLS on all tables
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE flocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE egg_production ENABLE ROW LEVEL SECURITY;
ALTER TABLE mortality_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccination_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_vaccinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Create policies
-- User Data policy
CREATE POLICY user_data_policy ON user_data
  FOR ALL USING (auth.uid() = user_id);

-- Flocks policy
CREATE POLICY flocks_policy ON flocks
  FOR ALL USING (auth.uid() = user_id);

-- Feed Records policy (through flock ownership)
CREATE POLICY feed_records_policy ON feed_records
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM flocks
      WHERE flocks.id = feed_records.flock_id
      AND flocks.user_id = auth.uid()
    )
  );

-- Health Alerts policy
CREATE POLICY health_alerts_policy ON health_alerts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM flocks
      WHERE flocks.id = health_alerts.flock_id
      AND flocks.user_id = auth.uid()
    )
  );

-- Egg Production policy
CREATE POLICY egg_production_policy ON egg_production
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM flocks
      WHERE flocks.id = egg_production.flock_id
      AND flocks.user_id = auth.uid()
    )
  );

-- Mortality Records policy
CREATE POLICY mortality_records_policy ON mortality_records
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM flocks
      WHERE flocks.id = mortality_records.flock_id
      AND flocks.user_id = auth.uid()
    )
  );

-- Vaccination Records policy
CREATE POLICY vaccination_records_policy ON vaccination_records
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM flocks
      WHERE flocks.id = vaccination_records.flock_id
      AND flocks.user_id = auth.uid()
    )
  );

-- Scheduled Vaccinations policy
CREATE POLICY scheduled_vaccinations_policy ON scheduled_vaccinations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM flocks
      WHERE flocks.id = scheduled_vaccinations.flock_id
      AND flocks.user_id = auth.uid()
    )
  );

-- Sales Records policy
CREATE POLICY sales_records_policy ON sales_records
  FOR ALL USING (auth.uid() = user_id);

-- Expenses policy
CREATE POLICY expenses_policy ON expenses
  FOR ALL USING (auth.uid() = user_id);