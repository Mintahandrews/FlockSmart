-- User Data Queries
-- Get user data
SELECT * FROM user_data WHERE user_id = auth.uid();

-- Update user data
UPDATE user_data
SET data = :new_data, updated_at = NOW()
WHERE user_id = auth.uid()
RETURNING *;

-- Flock Queries
-- Get all flocks for current user
SELECT * FROM flocks
WHERE user_id = auth.uid()
ORDER BY created_at DESC;

-- Get specific flock
SELECT * FROM flocks
WHERE id = :flock_id AND user_id = auth.uid();

-- Create new flock
INSERT INTO flocks (
  user_id, name, bird_type, count, age_weeks,
  avg_weight, health_status, notes
) VALUES (
  auth.uid(), :name, :bird_type, :count, :age_weeks,
  :avg_weight, :health_status, :notes
) RETURNING *;

-- Update flock
UPDATE flocks
SET 
  name = :name,
  bird_type = :bird_type,
  count = :count,
  age_weeks = :age_weeks,
  avg_weight = :avg_weight,
  health_status = :health_status,
  notes = :notes,
  last_updated = NOW()
WHERE id = :flock_id AND user_id = auth.uid()
RETURNING *;

-- Delete flock
DELETE FROM flocks
WHERE id = :flock_id AND user_id = auth.uid();

-- Feed Records Queries
-- Get all feed records for a flock
SELECT fr.*, f.name as flock_name
FROM feed_records fr
JOIN flocks f ON fr.flock_id = f.id
WHERE f.user_id = auth.uid()
ORDER BY fr.date DESC;

-- Create feed record
INSERT INTO feed_records (
  flock_id, date, feed_type, quantity_kg, cost_per_kg
) VALUES (
  :flock_id, :date, :feed_type, :quantity_kg, :cost_per_kg
) RETURNING *;

-- Health Alerts Queries
-- Get all health alerts
SELECT ha.*, f.name as flock_name
FROM health_alerts ha
JOIN flocks f ON ha.flock_id = f.id
WHERE f.user_id = auth.uid()
ORDER BY ha.date DESC;

-- Create health alert
INSERT INTO health_alerts (
  flock_id, date, severity, message
) VALUES (
  :flock_id, :date, :severity, :message
) RETURNING *;

-- Mark health alert as read
UPDATE health_alerts
SET is_read = true
WHERE id = :alert_id AND flock_id IN (
  SELECT id FROM flocks WHERE user_id = auth.uid()
);

-- Egg Production Queries
-- Get egg production records
SELECT ep.*, f.name as flock_name
FROM egg_production ep
JOIN flocks f ON ep.flock_id = f.id
WHERE f.user_id = auth.uid()
ORDER BY ep.date DESC;

-- Record egg production
INSERT INTO egg_production (
  flock_id, date, quantity, damaged
) VALUES (
  :flock_id, :date, :quantity, :damaged
) RETURNING *;

-- Mortality Records Queries
-- Get mortality records
SELECT mr.*, f.name as flock_name
FROM mortality_records mr
JOIN flocks f ON mr.flock_id = f.id
WHERE f.user_id = auth.uid()
ORDER BY mr.date DESC;

-- Record mortality
INSERT INTO mortality_records (
  flock_id, date, count, cause, notes
) VALUES (
  :flock_id, :date, :count, :cause, :notes
) RETURNING *;

-- Vaccination Records Queries
-- Get vaccination records
SELECT vr.*, f.name as flock_name
FROM vaccination_records vr
JOIN flocks f ON vr.flock_id = f.id
WHERE f.user_id = auth.uid()
ORDER BY vr.date DESC;

-- Record vaccination
INSERT INTO vaccination_records (
  flock_id, date, treatment, treatment_type, notes, completed
) VALUES (
  :flock_id, :date, :treatment, :treatment_type, :notes, :completed
) RETURNING *;

-- Scheduled Vaccinations Queries
-- Get scheduled vaccinations
SELECT sv.*, f.name as flock_name
FROM scheduled_vaccinations sv
JOIN flocks f ON sv.flock_id = f.id
WHERE f.user_id = auth.uid()
ORDER BY sv.scheduled_date ASC;

-- Schedule vaccination
INSERT INTO scheduled_vaccinations (
  flock_id, scheduled_date, treatment, treatment_type, notes
) VALUES (
  :flock_id, :scheduled_date, :treatment, :treatment_type, :notes
) RETURNING *;

-- Mark scheduled vaccination as completed
UPDATE scheduled_vaccinations
SET completed = true
WHERE id = :vaccination_id AND flock_id IN (
  SELECT id FROM flocks WHERE user_id = auth.uid()
);

-- Sales Records Queries
-- Get sales records
SELECT *
FROM sales_records
WHERE user_id = auth.uid()
ORDER BY date DESC;

-- Record sale
INSERT INTO sales_records (
  user_id, date, product, quantity, unit_price, customer, notes
) VALUES (
  auth.uid(), :date, :product, :quantity, :unit_price, :customer, :notes
) RETURNING *;

-- Expenses Queries
-- Get expenses
SELECT *
FROM expenses
WHERE user_id = auth.uid()
ORDER BY date DESC;

-- Record expense
INSERT INTO expenses (
  user_id, date, category, amount, description
) VALUES (
  auth.uid(), :date, :category, :amount, :description
) RETURNING *;

-- Analytics Queries
-- Total eggs produced by flock
SELECT 
  f.name as flock_name,
  SUM(ep.quantity) as total_eggs,
  SUM(ep.damaged) as total_damaged
FROM egg_production ep
JOIN flocks f ON ep.flock_id = f.id
WHERE f.user_id = auth.uid()
GROUP BY f.id, f.name;

-- Total feed cost by flock
SELECT 
  f.name as flock_name,
  SUM(fr.quantity_kg * fr.cost_per_kg) as total_feed_cost
FROM feed_records fr
JOIN flocks f ON fr.flock_id = f.id
WHERE f.user_id = auth.uid()
GROUP BY f.id, f.name;

-- Monthly sales summary
SELECT 
  DATE_TRUNC('month', date) as month,
  SUM(quantity * unit_price) as total_sales
FROM sales_records
WHERE user_id = auth.uid()
GROUP BY DATE_TRUNC('month', date)
ORDER BY month DESC;

-- Monthly expenses by category
SELECT 
  DATE_TRUNC('month', date) as month,
  category,
  SUM(amount) as total_amount
FROM expenses
WHERE user_id = auth.uid()
GROUP BY DATE_TRUNC('month', date), category
ORDER BY month DESC, category;

-- Flock mortality rate
SELECT 
  f.name as flock_name,
  f.count as initial_count,
  SUM(mr.count) as total_mortality,
  ROUND(CAST(SUM(mr.count) AS DECIMAL) / f.count * 100, 2) as mortality_rate
FROM flocks f
LEFT JOIN mortality_records mr ON f.id = mr.flock_id
WHERE f.user_id = auth.uid()
GROUP BY f.id, f.name, f.count;

-- Vaccination compliance
SELECT 
  f.name as flock_name,
  COUNT(sv.id) as total_scheduled,
  SUM(CASE WHEN sv.completed THEN 1 ELSE 0 END) as completed,
  ROUND(CAST(SUM(CASE WHEN sv.completed THEN 1 ELSE 0 END) AS DECIMAL) / COUNT(sv.id) * 100, 2) as compliance_rate
FROM flocks f
LEFT JOIN scheduled_vaccinations sv ON f.id = sv.flock_id
WHERE f.user_id = auth.uid()
GROUP BY f.id, f.name;