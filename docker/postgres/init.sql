-- Script de inicialización de PostgreSQL.
-- Se ejecuta SOLO la primera vez que se crea el volumen (docker compose up con volumen vacío).
-- Los valores de POSTGRES_* vienen del servicio "postgres"; aquí solo preparamos extensiones.
-- Añade debajo tus CREATE TABLE / seeds iniciales cuando definas el modelo EF Core.

-- UUIDs con gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
