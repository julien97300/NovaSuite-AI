-- Script d'initialisation PostgreSQL pour NovaSuite AI
-- Ce script est exécuté automatiquement lors du premier démarrage du conteneur PostgreSQL

-- Créer la base de données si elle n'existe pas déjà
-- (La base 'novasuite' est déjà créée via POSTGRES_DB)

-- Créer des extensions utiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Créer un utilisateur de lecture seule pour les rapports (optionnel)
-- CREATE USER novasuite_readonly WITH PASSWORD 'readonly_password';
-- GRANT CONNECT ON DATABASE novasuite TO novasuite_readonly;
-- GRANT USAGE ON SCHEMA public TO novasuite_readonly;
-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO novasuite_readonly;
-- ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO novasuite_readonly;

-- Configuration des paramètres de performance
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
ALTER SYSTEM SET max_connections = 200;
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;
ALTER SYSTEM SET random_page_cost = 1.1;
ALTER SYSTEM SET effective_io_concurrency = 200;

-- Message de confirmation
DO $$
BEGIN
    RAISE NOTICE 'Base de données NovaSuite AI initialisée avec succès';
END $$;
