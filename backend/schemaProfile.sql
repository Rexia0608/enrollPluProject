-- ============================================
-- DROP ALL TABLES (in correct dependency order)
-- ============================================

-- First, drop tables that depend on others
DROP TABLE IF EXISTS transaction_table CASCADE;
DROP TABLE IF EXISTS enrollment_profile CASCADE;
DROP TABLE IF EXISTS maintenance_settings CASCADE;
DROP TABLE IF EXISTS academic_year CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS credentials CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- DROP FUNCTIONS (optional – remove if you want to keep them)
-- ============================================

DROP FUNCTION IF EXISTS generate_transaction_id() CASCADE;
DROP FUNCTION IF EXISTS generate_enrollment_id() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- ============================================
-- VERIFY ALL TABLES ARE GONE
-- ============================================

SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
-- Should return no rows (or only system tables)