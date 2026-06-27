-- Ayuda Venezuela — Initial Database Schema
-- Run this in Supabase SQL editor or via: supabase db push

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ─────────────────────────────────────────
-- REQUESTS (Solicitudes de ayuda)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS requests (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title              TEXT NOT NULL,
  description        TEXT NOT NULL,
  category           TEXT NOT NULL CHECK (category IN ('water','food','shelter','medical','transport','rescue','clothing','energy','communication','psychological','other')),
  status             TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','in_progress','fulfilled','cancelled')),
  urgency            SMALLINT NOT NULL DEFAULT 3 CHECK (urgency BETWEEN 1 AND 5),
  location           TEXT NOT NULL,
  lat                DECIMAL(10, 7),
  lng                DECIMAL(10, 7),
  people_count       INTEGER NOT NULL DEFAULT 1,
  contact            TEXT NOT NULL,
  verification_level TEXT NOT NULL DEFAULT 'unverified' CHECK (verification_level IN ('unverified','low','medium','high','official')),
  user_id            UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_requests_status       ON requests(status);
CREATE INDEX idx_requests_category     ON requests(category);
CREATE INDEX idx_requests_urgency      ON requests(urgency DESC);
CREATE INDEX idx_requests_created_at   ON requests(created_at DESC);
CREATE INDEX idx_requests_location     ON requests USING GIST (ST_Point(lng, lat)) WHERE lat IS NOT NULL AND lng IS NOT NULL;

-- ─────────────────────────────────────────
-- OFFERS (Ofertas de ayuda)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS offers (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title              TEXT NOT NULL,
  description        TEXT NOT NULL,
  category           TEXT NOT NULL CHECK (category IN ('water','food','shelter','medical','transport','rescue','clothing','energy','communication','psychological','other')),
  status             TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available','reserved','delivered','expired')),
  location           TEXT NOT NULL,
  lat                DECIMAL(10, 7),
  lng                DECIMAL(10, 7),
  quantity           TEXT,
  contact            TEXT NOT NULL,
  organization       TEXT,
  verification_level TEXT NOT NULL DEFAULT 'unverified' CHECK (verification_level IN ('unverified','low','medium','high','official')),
  user_id            UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_offers_status     ON offers(status);
CREATE INDEX idx_offers_category   ON offers(category);
CREATE INDEX idx_offers_created_at ON offers(created_at DESC);

-- ─────────────────────────────────────────
-- CENTERS (Centros de ayuda)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS centers (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                TEXT NOT NULL,
  type                TEXT NOT NULL CHECK (type IN ('shelter','medical','food','distribution','coordination')),
  address             TEXT NOT NULL,
  lat                 DECIMAL(10, 7) NOT NULL,
  lng                 DECIMAL(10, 7) NOT NULL,
  capacity            INTEGER,
  current_occupancy   INTEGER,
  contact             TEXT,
  services            JSONB NOT NULL DEFAULT '[]',
  schedule            TEXT,
  verification_level  TEXT NOT NULL DEFAULT 'unverified',
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_centers_is_active ON centers(is_active);
CREATE INDEX idx_centers_location  ON centers USING GIST (ST_Point(lng, lat));

-- ─────────────────────────────────────────
-- VOLUNTEERS (Voluntarios)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS volunteers (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  skills        JSONB NOT NULL DEFAULT '[]',
  availability  TEXT NOT NULL DEFAULT 'flexible' CHECK (availability IN ('immediate','today','this_week','flexible')),
  location      TEXT NOT NULL,
  lat           DECIMAL(10, 7),
  lng           DECIMAL(10, 7),
  contact       TEXT NOT NULL,
  organization  TEXT,
  languages     JSONB NOT NULL DEFAULT '["Español"]',
  verified      BOOLEAN NOT NULL DEFAULT FALSE,
  assigned_task TEXT,
  user_id       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- MATCHES (Coincidencias IA)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS matches (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id  UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
  offer_id    UUID NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
  score       DECIMAL(5, 2) NOT NULL,
  reason      TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'suggested' CHECK (status IN ('suggested','accepted','rejected')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_matches_request_id ON matches(request_id);
CREATE INDEX idx_matches_offer_id   ON matches(offer_id);

-- ─────────────────────────────────────────
-- AUDIT LOG
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_logs (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action     TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id  TEXT NOT NULL,
  user_id    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  metadata   JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_table_record ON audit_logs(table_name, record_id);
CREATE INDEX idx_audit_logs_user         ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at   ON audit_logs(created_at DESC);

-- ─────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────
ALTER TABLE requests  ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers    ENABLE ROW LEVEL SECURITY;
ALTER TABLE centers   ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches   ENABLE ROW LEVEL SECURITY;

-- Public read access for all
CREATE POLICY "requests_public_read"   ON requests   FOR SELECT USING (true);
CREATE POLICY "offers_public_read"     ON offers     FOR SELECT USING (true);
CREATE POLICY "centers_public_read"    ON centers    FOR SELECT USING (true);
CREATE POLICY "volunteers_public_read" ON volunteers FOR SELECT USING (true);

-- Anyone can insert (anon users in emergency)
CREATE POLICY "requests_public_insert"   ON requests   FOR INSERT WITH CHECK (true);
CREATE POLICY "offers_public_insert"     ON offers     FOR INSERT WITH CHECK (true);
CREATE POLICY "volunteers_public_insert" ON volunteers FOR INSERT WITH CHECK (true);

-- Only owners can update their own records
CREATE POLICY "requests_owner_update" ON requests FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "offers_owner_update"   ON offers   FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL);

-- ─────────────────────────────────────────
-- UPDATED_AT TRIGGER
-- ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER requests_updated_at BEFORE UPDATE ON requests
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER offers_updated_at BEFORE UPDATE ON offers
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─────────────────────────────────────────
-- SEED DATA (remove in production)
-- ─────────────────────────────────────────
INSERT INTO centers (name, type, address, lat, lng, capacity, current_occupancy, contact, services, schedule, verification_level, is_active)
VALUES
  ('Albergue Poliedro de Caracas', 'shelter', 'Poliedro de Caracas, El Valle', 10.4534, -66.9225, 2000, 850, '0212-555-0001', '["Alojamiento","Alimentación","Atención médica"]', '24 horas', 'official', true),
  ('Centro de Distribución Cruz Roja', 'distribution', 'Av. Lecuna, La Candelaria, Caracas', 10.4990, -66.9167, NULL, NULL, '0212-706-5555', '["Agua","Alimentos","Medicamentos"]', 'L-V 8am-5pm', 'official', true),
  ('Puesto Médico de Avanzada — Petare', 'medical', 'Sector José Félix Ribas, Petare', 10.4775, -66.8125, NULL, NULL, '0212-555-0003', '["Atención médica","Primeros auxilios"]', '24 horas', 'high', true);

-- Stats view for dashboard
CREATE OR REPLACE VIEW v_stats AS
SELECT
  (SELECT COUNT(*) FROM requests)                              AS total_requests,
  (SELECT COUNT(*) FROM requests WHERE status = 'fulfilled')  AS fulfilled_requests,
  (SELECT COUNT(*) FROM offers WHERE status = 'available')    AS total_offers,
  (SELECT COUNT(*) FROM volunteers)                           AS active_volunteers,
  (SELECT COUNT(*) FROM centers WHERE is_active = true)       AS active_centers,
  (SELECT COALESCE(SUM(people_count), 0) FROM requests WHERE status = 'fulfilled') AS people_helped,
  (SELECT COUNT(*) FROM matches)                              AS matches_made;
