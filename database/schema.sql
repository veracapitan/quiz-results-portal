-- Database schema for Vitalytics wearable device data

-- Enable UUID extension for unique identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('patient', 'doctor')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Questionnaires table
CREATE TABLE questionnaires (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    intensity INTEGER CHECK (intensity >= 0 AND intensity <= 10),
    treatment_efficacy INTEGER CHECK (treatment_efficacy >= 0 AND treatment_efficacy <= 10),
    activities_impact JSONB,
    triggers TEXT[],
    selected_areas TEXT[],
    images TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Wearable device data table (partitioned by date)
CREATE TABLE wearable_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    scratch_speed FLOAT,
    scratch_duration INTEGER, -- in seconds
    heart_rate INTEGER,
    heart_rate_variability FLOAT,
    skin_conductance FLOAT,
    skin_temperature FLOAT,
    sleep_quality_score INTEGER,
    sleep_interruptions INTEGER,
    postural_changes INTEGER
) PARTITION BY RANGE (timestamp);

-- Create partitions for wearable data (example for monthly partitions)
CREATE TABLE wearable_data_y2024m01 PARTITION OF wearable_data
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- Indexes for better query performance
CREATE INDEX idx_wearable_data_user_timestamp ON wearable_data(user_id, timestamp);
CREATE INDEX idx_questionnaires_user_date ON questionnaires(user_id, date);

-- Views for aggregated data
CREATE VIEW daily_metrics AS
SELECT 
    user_id,
    date_trunc('day', timestamp) as day,
    avg(scratch_speed) as avg_scratch_speed,
    avg(heart_rate) as avg_heart_rate,
    avg(sleep_quality_score) as avg_sleep_quality,
    count(*) as measurement_count
FROM wearable_data
GROUP BY user_id, date_trunc('day', timestamp);

-- Function to create new partitions automatically
CREATE OR REPLACE FUNCTION create_wearable_partition_for_month()
RETURNS void AS $$
DECLARE
    next_month_start DATE;
    partition_name TEXT;
BEGIN
    next_month_start := date_trunc('month', NOW()) + interval '1 month';
    partition_name := 'wearable_data_y' || 
                     to_char(next_month_start, 'YYYY') ||
                     'm' || to_char(next_month_start, 'MM');
    
    EXECUTE format(
        'CREATE TABLE IF NOT EXISTS %I PARTITION OF wearable_data
         FOR VALUES FROM (%L) TO (%L)',
        partition_name,
        next_month_start,
        next_month_start + interval '1 month'
    );
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically create partitions
CREATE OR REPLACE FUNCTION create_partition_trigger()
RETURNS trigger AS $$
BEGIN
    PERFORM create_wearable_partition_for_month();
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_partition_exists
    AFTER INSERT ON wearable_data
    EXECUTE FUNCTION create_partition_trigger();