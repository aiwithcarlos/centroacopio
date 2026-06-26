-- ============================================================
-- Migración: Cambiar IDs de ubicación a formato ISO (TEXT)
-- ============================================================
-- Ejecutar en Supabase SQL Editor

-- 1. Eliminar las foreign keys existentes (si las hay)
ALTER TABLE centers
  DROP CONSTRAINT IF EXISTS centers_country_id_fkey,
  DROP CONSTRAINT IF EXISTS centers_state_id_fkey,
  DROP CONSTRAINT IF EXISTS centers_city_id_fkey;

-- 2. Cambiar columnas de UUID a TEXT
ALTER TABLE centers
  ALTER COLUMN country_id TYPE CHAR(2) USING country_id::text,
  ALTER COLUMN state_id TYPE TEXT USING state_id::text,
  ALTER COLUMN city_id TYPE TEXT USING city_id::text;

-- 3. Eliminar índices antiguos (opcional, para limpieza)
DROP INDEX IF EXISTS idx_centers_country_id;
DROP INDEX IF EXISTS idx_centers_state_id;
DROP INDEX IF EXISTS idx_centers_city_id;

-- 4. Crear nuevos índices para filtros rápidos
CREATE INDEX IF NOT EXISTS idx_centers_country_id ON centers(country_id);
CREATE INDEX IF NOT EXISTS idx_centers_state_id ON centers(state_id);
CREATE INDEX IF NOT EXISTS idx_centers_city_id ON centers(city_id);
