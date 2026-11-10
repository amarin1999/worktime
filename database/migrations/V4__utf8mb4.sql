-- Convert a database migrated from MySQL 5.5 (utf8 = 3-byte utf8mb3) to utf8mb4.
-- Run once, after importing the dump. Safe to re-run. Back up first.
-- No FK columns are character columns (all FKs are INT), so CONVERT does not conflict with FKs.
-- Existing data (Thai text) is preserved; the dump must have been taken/imported as utf8.
USE `worktime`;

ALTER DATABASE `worktime` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `worktype`                       CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `work_project`                   CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `employee`                       CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `employee_has_sidework_history`  CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `sidework_history`               CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE `ot_history`                     CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Verify (expect utf8mb4_unicode_ci everywhere):
-- SELECT table_name, table_collation FROM information_schema.tables WHERE table_schema = 'worktime';
