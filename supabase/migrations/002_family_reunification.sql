-- Family Reunification Module — Database Schema
-- Módulo de Reunificación Familiar

-- ─────────────────────────────────────────
-- MISSING PERSON REPORTS (Reportes de personas desaparecidas)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS missing_person_reports (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Basic info (public)
  full_name            TEXT NOT NULL,
  alias                TEXT,
  age_approx           SMALLINT NOT NULL CHECK (age_approx BETWEEN 0 AND 120),
  sex                  TEXT NOT NULL DEFAULT 'unknown' CHECK (sex IN ('male','female','other','unknown')),
  photo_url            TEXT,
  languages            JSONB NOT NULL DEFAULT '["Español"]',

  -- Last known location (city/state public; lat/lng and address protected)
  country              TEXT NOT NULL DEFAULT 'Venezuela',
  state                TEXT NOT NULL,
  city                 TEXT NOT NULL,
  address_approx       TEXT,                    -- Never exposed publicly
  lat                  DECIMAL(10, 7),          -- Never exposed publicly
  lng                  DECIMAL(10, 7),          -- Never exposed publicly
  last_seen_at         TIMESTAMPTZ NOT NULL,
  last_seen_place      TEXT NOT NULL,

  -- Physical description (public)
  height_cm            SMALLINT,
  hair_color           TEXT,
  eye_color            TEXT,
  clothing_description TEXT,
  distinguishing_marks TEXT,
  tattoos              TEXT,
  scars                TEXT,

  -- Medical info (protected — never public, shared only after mutual consent)
  allergies            TEXT,
  disability           TEXT,
  medications          TEXT,
  medical_conditions   TEXT,

  -- Reporter contact (protected — revealed only after mutual consent)
  reporter_name        TEXT NOT NULL,
  reporter_relationship TEXT NOT NULL,
  reporter_email       TEXT NOT NULL,
  reporter_phone       TEXT,
  reporter_whatsapp    TEXT,

  -- Status
  status               TEXT NOT NULL DEFAULT 'searching'
                         CHECK (status IN ('searching','possible_match','verified','reunited','closed','archived')),

  -- Auth / audit
  user_id              UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_missing_status      ON missing_person_reports(status);
CREATE INDEX idx_missing_city        ON missing_person_reports(city);
CREATE INDEX idx_missing_state       ON missing_person_reports(state);
CREATE INDEX idx_missing_last_seen   ON missing_person_reports(last_seen_at DESC);
CREATE INDEX idx_missing_created_at  ON missing_person_reports(created_at DESC);
CREATE INDEX idx_missing_full_name   ON missing_person_reports USING GIN (to_tsvector('spanish', full_name));

-- ─────────────────────────────────────────
-- SURVIVOR REPORTS (Personas que reportan que están a salvo)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS survivor_reports (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  full_name            TEXT NOT NULL,
  age_approx           SMALLINT CHECK (age_approx BETWEEN 0 AND 120),
  photo_url            TEXT,

  -- Current location (approximate if consent given)
  current_location     TEXT NOT NULL,
  location_type        TEXT NOT NULL DEFAULT 'other'
                         CHECK (location_type IN ('hospital','shelter','care_center','home','other')),
  location_name        TEXT,
  lat                  DECIMAL(10, 7),          -- Protected
  lng                  DECIMAL(10, 7),          -- Protected

  -- Status
  health_status        TEXT NOT NULL DEFAULT 'unknown'
                         CHECK (health_status IN ('good','injured','critical','unknown')),
  needs_help           BOOLEAN NOT NULL DEFAULT FALSE,
  message_for_family   TEXT,

  -- Consent for contact sharing
  consent_to_be_found  BOOLEAN NOT NULL DEFAULT TRUE,
  show_email           BOOLEAN NOT NULL DEFAULT FALSE,
  show_phone           BOOLEAN NOT NULL DEFAULT FALSE,
  show_whatsapp        BOOLEAN NOT NULL DEFAULT FALSE,

  -- Contact info (only revealed based on consent + mutual match acceptance)
  email                TEXT,
  phone                TEXT,
  whatsapp             TEXT,

  status               TEXT NOT NULL DEFAULT 'searching'
                         CHECK (status IN ('searching','possible_match','verified','reunited','closed','archived')),

  user_id              UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_survivor_status     ON survivor_reports(status);
CREATE INDEX idx_survivor_location   ON survivor_reports(current_location);
CREATE INDEX idx_survivor_created    ON survivor_reports(created_at DESC);
CREATE INDEX idx_survivor_full_name  ON survivor_reports USING GIN (to_tsvector('spanish', full_name));

-- ─────────────────────────────────────────
-- FAMILY MATCHES (Coincidencias entre personas desaparecidas y sobrevivientes)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS family_matches (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  missing_report_id    UUID NOT NULL REFERENCES missing_person_reports(id) ON DELETE CASCADE,
  survivor_report_id   UUID NOT NULL REFERENCES survivor_reports(id) ON DELETE CASCADE,

  score                DECIMAL(5, 2) NOT NULL CHECK (score BETWEEN 0 AND 100),
  match_reasons        JSONB NOT NULL DEFAULT '[]',

  status               TEXT NOT NULL DEFAULT 'suggested'
                         CHECK (status IN ('suggested','pending_consent','accepted','rejected','reunited')),

  -- Both sides must accept before contact info is shared
  missing_side_consent  BOOLEAN NOT NULL DEFAULT FALSE,
  survivor_side_consent BOOLEAN NOT NULL DEFAULT FALSE,

  -- Notification tracking
  missing_notified_at  TIMESTAMPTZ,
  survivor_notified_at TIMESTAMPTZ,

  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (missing_report_id, survivor_report_id)
);

CREATE INDEX idx_family_matches_missing   ON family_matches(missing_report_id);
CREATE INDEX idx_family_matches_survivor  ON family_matches(survivor_report_id);
CREATE INDEX idx_family_matches_score     ON family_matches(score DESC);
CREATE INDEX idx_family_matches_status    ON family_matches(status);

-- ─────────────────────────────────────────
-- CONSENT LOGS (Audit trail for GDPR / privacy compliance)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS consent_logs (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  record_type  TEXT NOT NULL CHECK (record_type IN ('missing','survivor')),
  record_id    UUID NOT NULL,
  action       TEXT NOT NULL,   -- e.g. "consent_given", "consent_revoked", "contact_revealed"
  actor_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  metadata     JSONB NOT NULL DEFAULT '{}',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_consent_logs_record ON consent_logs(record_type, record_id);
CREATE INDEX idx_consent_logs_date   ON consent_logs(created_at DESC);

-- ─────────────────────────────────────────
-- MATCH HISTORY (Track all state changes on a match)
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS match_history (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id     UUID NOT NULL REFERENCES family_matches(id) ON DELETE CASCADE,
  old_status   TEXT,
  new_status   TEXT NOT NULL,
  changed_by   UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  note         TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_match_history_match ON match_history(match_id);

-- ─────────────────────────────────────────
-- FAMILY NOTIFICATIONS
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS family_notifications (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_type  TEXT NOT NULL CHECK (recipient_type IN ('missing_reporter','survivor')),
  record_id    UUID NOT NULL,
  match_id     UUID REFERENCES family_matches(id) ON DELETE CASCADE,
  channel      TEXT NOT NULL CHECK (channel IN ('email','whatsapp','push','sms')),
  status       TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','sent','failed','read')),
  payload      JSONB NOT NULL DEFAULT '{}',
  sent_at      TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_family_notif_record ON family_notifications(record_id);
CREATE INDEX idx_family_notif_status ON family_notifications(status);

-- ─────────────────────────────────────────
-- TRIGGERS: updated_at
-- ─────────────────────────────────────────
CREATE TRIGGER missing_reports_updated_at BEFORE UPDATE ON missing_person_reports
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER survivor_reports_updated_at BEFORE UPDATE ON survivor_reports
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER family_matches_updated_at BEFORE UPDATE ON family_matches
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────
ALTER TABLE missing_person_reports  ENABLE ROW LEVEL SECURITY;
ALTER TABLE survivor_reports        ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_matches          ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_logs            ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_history           ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_notifications    ENABLE ROW LEVEL SECURITY;

-- Public can read non-sensitive fields via view (see below)
-- Direct table access requires auth for sensitive data

-- Anyone can insert (emergency context)
CREATE POLICY "missing_public_insert"  ON missing_person_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "survivor_public_insert" ON survivor_reports        FOR INSERT WITH CHECK (true);

-- Owners can update their own records
CREATE POLICY "missing_owner_update"  ON missing_person_reports FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "survivor_owner_update" ON survivor_reports FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Authenticated users can read matches involving their records
CREATE POLICY "matches_auth_read" ON family_matches FOR SELECT
  USING (true);  -- MVP: open read; tighten in prod via JOIN check on user_id

-- ─────────────────────────────────────────
-- SAFE PUBLIC VIEW (strips all sensitive fields)
-- ─────────────────────────────────────────
CREATE OR REPLACE VIEW v_missing_persons_public AS
SELECT
  id,
  full_name,
  alias,
  age_approx,
  sex,
  photo_url,
  languages,
  country,
  state,
  city,
  last_seen_at,
  last_seen_place,
  height_cm,
  hair_color,
  eye_color,
  clothing_description,
  distinguishing_marks,
  tattoos,
  scars,
  reporter_name,
  reporter_relationship,
  -- Reporter contact omitted
  status,
  created_at
FROM missing_person_reports
WHERE status NOT IN ('closed','archived');

CREATE OR REPLACE VIEW v_survivors_public AS
SELECT
  id,
  full_name,
  age_approx,
  photo_url,
  current_location,
  location_type,
  location_name,
  -- lat/lng omitted
  health_status,
  needs_help,
  message_for_family,
  consent_to_be_found,
  -- Contact info omitted (revealed only after mutual consent)
  status,
  created_at
FROM survivor_reports
WHERE consent_to_be_found = true
  AND status NOT IN ('closed','archived');

-- ─────────────────────────────────────────
-- STATS VIEW
-- ─────────────────────────────────────────
CREATE OR REPLACE VIEW v_family_stats AS
SELECT
  (SELECT COUNT(*) FROM missing_person_reports WHERE status NOT IN ('closed','archived'))    AS total_missing,
  (SELECT COUNT(*) FROM survivor_reports WHERE status NOT IN ('closed','archived'))          AS total_survivors,
  (SELECT COUNT(*) FROM family_matches)                                                      AS total_matches,
  (SELECT COUNT(*) FROM family_matches WHERE status IN ('accepted','reunited'))              AS verified_matches,
  (SELECT COUNT(*) FROM family_matches WHERE status = 'reunited')                            AS reunited_count,
  (SELECT COUNT(*) FROM missing_person_reports WHERE status = 'searching')                  AS active_searches;
