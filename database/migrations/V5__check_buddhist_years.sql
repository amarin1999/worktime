-- Detect Buddhist-era (BE, year > 2400) dates stored by the old system. The app expects Gregorian (CE).
-- This script is READ-ONLY (detection only); it never modifies data.
USE `worktime`;

-- ---------------- PART 1: read-only checks (expect 0 everywhere after cleanup) ----------------
SELECT 'sidework_history.day'              AS col, COUNT(*) AS rows_gt_2400 FROM sidework_history WHERE YEAR(`day`) > 2400
UNION ALL
SELECT 'sidework_history.last_update_time', COUNT(*) FROM sidework_history WHERE YEAR(last_update_time) > 2400
UNION ALL
SELECT 'ot_history.start_time',             COUNT(*) FROM ot_history WHERE YEAR(start_time) > 2400
UNION ALL
SELECT 'ot_history.end_time',               COUNT(*) FROM ot_history WHERE YEAR(end_time) > 2400
UNION ALL
SELECT 'ot_history.last_update_time',       COUNT(*) FROM ot_history WHERE YEAR(last_update_time) > 2400;

-- Inspect the offending rows before deciding:
-- SELECT * FROM sidework_history WHERE YEAR(`day`) > 2400 OR YEAR(last_update_time) > 2400;
-- SELECT * FROM ot_history WHERE YEAR(start_time) > 2400 OR YEAR(end_time) > 2400 OR YEAR(last_update_time) > 2400;

-- ---------------- Conversion (NOT done in SQL) ----------------
-- Years are never converted with SQL date arithmetic. Conversion BE -> CE is done by the backend's
-- maintenance command, which uses the Thai Buddhist calendar (java.time.chrono.ThaiBuddhistChronology):
--   java -jar worktime-backend-2.0.0.jar --app.maintenance.fix-buddhist-years=report   (dry run)
--   java -jar worktime-backend-2.0.0.jar --app.maintenance.fix-buddhist-years=apply    (one transaction)
-- TAKE A FULL BACKUP FIRST, then re-run PART 1 afterwards (expect 0 everywhere).
