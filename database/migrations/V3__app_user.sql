-- Least-privilege account for the application (MariaDB 12.3). Do NOT run the application as root.
-- Before running: replace the password and restrict the host ('%') to the application
-- server's address (e.g. 'worktime_app'@'10.0.0.5').
-- Note: CREATE USER IF NOT EXISTS does NOT change the password of an existing user; to rotate it use
--   ALTER USER 'worktime_app'@'%' IDENTIFIED BY '<new password>';
-- GRANT takes effect immediately; FLUSH PRIVILEGES is not needed (only after editing mysql.* tables directly).
CREATE USER IF NOT EXISTS 'worktime_app'@'%' IDENTIFIED BY 'CHANGE_ME_STRONG_PASSWORD';
GRANT SELECT ON `worktime`.`employee` TO 'worktime_app'@'%';
GRANT SELECT ON `worktime`.`worktype` TO 'worktime_app'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON `worktime`.`employee_has_sidework_history` TO 'worktime_app'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON `worktime`.`sidework_history` TO 'worktime_app'@'%';
GRANT SELECT, INSERT, UPDATE, DELETE ON `worktime`.`ot_history` TO 'worktime_app'@'%';
-- FLUSH PRIVILEGES;  -- not required after GRANT
