-- The reports use employee.active, which exists on the production database but is missing from
-- the old MySQL 5.5 dump (database/database.sql).
-- MariaDB (10.0.2+, incl. 12.3) supports ADD COLUMN IF NOT EXISTS, so this is idempotent:
-- safe to run whether or not the column already exists. (Not supported by MySQL 5.5/8.0.)
-- New installs via schema-mariadb.sql already have the column; running this is then a no-op.
ALTER TABLE `employee` ADD COLUMN IF NOT EXISTS `active` CHAR(1) NOT NULL DEFAULT 'Y';
