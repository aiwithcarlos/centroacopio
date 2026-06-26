-- ============================================================
-- Centro de Acopio - Esquema de Base de Datos (PostgreSQL / Supabase)
-- ============================================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "cube";
CREATE EXTENSION IF NOT EXISTS "earthdistance";

-- ============================================================
-- TIPOS ENUMERADOS
-- ============================================================

DO $$ BEGIN
    CREATE TYPE center_status AS ENUM ('active', 'inactive', 'disabled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================
-- TABLAS DE UBICACIÓN
-- ============================================================

CREATE TABLE IF NOT EXISTS countries (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL,
    iso2        CHAR(2) NOT NULL UNIQUE,
    iso3        CHAR(3),
    flag_url    TEXT,
    latitude    DOUBLE PRECISION,
    longitude   DOUBLE PRECISION,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_countries_name ON countries(name ASC);

CREATE TABLE IF NOT EXISTS states (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_id  UUID NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    state_code  TEXT,
    latitude    DOUBLE PRECISION,
    longitude   DOUBLE PRECISION,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(country_id, name)
);

CREATE INDEX IF NOT EXISTS idx_states_country_id ON states(country_id);
CREATE INDEX IF NOT EXISTS idx_states_name ON states(name ASC);

CREATE TABLE IF NOT EXISTS cities (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    state_id    UUID NOT NULL REFERENCES states(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    latitude    DOUBLE PRECISION,
    longitude   DOUBLE PRECISION,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(state_id, name)
);

CREATE INDEX IF NOT EXISTS idx_cities_state_id ON cities(state_id);
CREATE INDEX IF NOT EXISTS idx_cities_name ON cities(name ASC);

-- ============================================================
-- TABLA DE CENTROS DE ACOPIO
-- ============================================================

CREATE TABLE IF NOT EXISTS centers (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    country_id      CHAR(2) NOT NULL,                -- ISO2: "VE", "CO", "US"
    state_id        TEXT,                             -- State ISO: "VE-A", "US-NY"
    city_id         TEXT,                             -- City name
    address         TEXT NOT NULL,
    latitude        DOUBLE PRECISION,
    longitude       DOUBLE PRECISION,
    -- Contacto
    contact_name    TEXT,
    contact_phone   TEXT,
    -- Foto
    photo_url       TEXT,
    -- Horario
    is_24h          BOOLEAN NOT NULL DEFAULT false,
    open_time       TIME WITHOUT TIME ZONE,
    close_time      TIME WITHOUT TIME ZONE,
    is_all_days     BOOLEAN NOT NULL DEFAULT false,
    days_of_week    SMALLINT[],
    -- Estado
    status          center_status NOT NULL DEFAULT 'active',
    -- Auditoría
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_centers_country_id ON centers(country_id);
CREATE INDEX IF NOT EXISTS idx_centers_state_id ON centers(state_id);
CREATE INDEX IF NOT EXISTS idx_centers_city_id ON centers(city_id);
CREATE INDEX IF NOT EXISTS idx_centers_status ON centers(status);
CREATE INDEX IF NOT EXISTS idx_centers_created_at ON centers(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_centers_location ON centers(latitude, longitude);

-- ============================================================
-- TABLA DE ETIQUETAS (INSUMOS)
-- ============================================================

CREATE TABLE IF NOT EXISTS tags (
    slug        TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    category    TEXT,
    sort_order   SMALLINT NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS center_tags (
    center_id   UUID NOT NULL REFERENCES centers(id) ON DELETE CASCADE,
    tag_slug    TEXT NOT NULL REFERENCES tags(slug) ON DELETE CASCADE,
    PRIMARY KEY (center_id, tag_slug)
);

CREATE INDEX IF NOT EXISTS idx_center_tags_center_id ON center_tags(center_id);

-- ============================================================
-- TABLA DE REPORTES
-- ============================================================

CREATE TABLE IF NOT EXISTS center_reports (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    center_id   UUID NOT NULL REFERENCES centers(id) ON DELETE CASCADE,
    reported_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    ip_hash     TEXT
);

CREATE INDEX IF NOT EXISTS idx_center_reports_center_id ON center_reports(center_id);

-- ============================================================
-- FUNCIONES
-- ============================================================

CREATE OR REPLACE FUNCTION get_center_report_count(p_center_id UUID)
RETURNS INTEGER
LANGUAGE SQL STABLE
AS $$
    SELECT COUNT(*)::INTEGER FROM center_reports WHERE center_id = p_center_id;
$$;

CREATE OR REPLACE FUNCTION has_recent_report(p_center_id UUID, p_ip_hash TEXT)
RETURNS BOOLEAN
LANGUAGE SQL STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM center_reports
        WHERE center_id = p_center_id
          AND ip_hash = p_ip_hash
          AND reported_at > now() - INTERVAL '24 hours'
    );
$$;

-- ============================================================
-- TRIGGER: actualizar updated_at automáticamente
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_centers_updated_at ON centers;
CREATE TRIGGER trg_centers_updated_at
    BEFORE UPDATE ON centers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE center_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE center_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE states ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;

-- Lectura pública (cualquiera puede leer)
DROP POLICY IF EXISTS "Public read centers" ON centers;
CREATE POLICY "Public read centers" ON centers FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read center_tags" ON center_tags;
CREATE POLICY "Public read center_tags" ON center_tags FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read tags" ON tags;
CREATE POLICY "Public read tags" ON tags FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read countries" ON countries;
CREATE POLICY "Public read countries" ON countries FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read states" ON states;
CREATE POLICY "Public read states" ON states FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read cities" ON cities;
CREATE POLICY "Public read cities" ON cities FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read center_reports" ON center_reports;
CREATE POLICY "Public read center_reports" ON center_reports FOR SELECT USING (true);

-- Inserción pública (cualquiera puede registrar un centro o reportar)
DROP POLICY IF EXISTS "Public insert centers" ON centers;
CREATE POLICY "Public insert centers" ON centers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public insert center_tags" ON center_tags;
CREATE POLICY "Public insert center_tags" ON center_tags FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public insert center_reports" ON center_reports;
CREATE POLICY "Public insert center_reports" ON center_reports FOR INSERT WITH CHECK (true);

-- ============================================================
-- CONFIGURACIÓN DE STORAGE (ejecutar en Supabase Dashboard o vía API)
-- ============================================================
-- Bucket: center-photos (público, solo imágenes, máx 5MB)
-- Para crearlo manualmente:
--   1. Ir a Supabase Dashboard > Storage
--   2. Crear bucket "center-photos" con acceso público
--   3. Configurar política: SELECT público, INSERT público
