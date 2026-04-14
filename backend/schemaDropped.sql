-- Drop all tables in proper order with CASCADE to handle dependencies
DROP TABLE IF EXISTS transaction_table CASCADE;
DROP TABLE IF EXISTS enrollment_profile CASCADE;
DROP TABLE IF EXISTS credentials CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS academic_year CASCADE;
DROP TABLE IF EXISTS maintenance_settings CASCADE;