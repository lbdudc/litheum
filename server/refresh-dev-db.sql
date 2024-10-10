SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = 'litheum-dev'
AND pid <> pg_backend_pid();

DROP DATABASE IF EXISTS "litheum-dev";

SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = 'litheum'
AND pid <> pg_backend_pid();

CREATE DATABASE "litheum-dev"
WITH TEMPLATE litheum
OWNER litheum;
