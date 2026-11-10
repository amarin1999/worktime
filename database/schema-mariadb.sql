-- =====================================================================
-- worktime : clean schema for NEW installs on MariaDB 12.3 LTS
-- Idempotent: safe to re-run (CREATE ... IF NOT EXISTS, INSERT IGNORE).
-- Does NOT drop anything and contains no sample/test data.
-- Existing MySQL 5.5 databases: use MIGRATION-MariaDB.md + migrations/V*.sql instead.
-- Usage:  mariadb -u root -p < schema-mariadb.sql   then   migrations/V3__app_user.sql
-- All DATE/TIME/DATETIME values are wall-clock Asia/Bangkok, Gregorian (CE) years.
-- =====================================================================

CREATE DATABASE IF NOT EXISTS `worktime`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `worktime`;

SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS `worktype` (
  `id_work_type` INT NOT NULL,
  `work_type_name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_work_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `work_project` (
  `id_work_project` INT NOT NULL,
  `project_no` VARCHAR(8) NOT NULL,
  PRIMARY KEY (`id_work_project`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `employee` (
  `id_employee` INT NOT NULL AUTO_INCREMENT,
  `employee_no` VARCHAR(45) NOT NULL,
  `firstname` VARCHAR(45) NOT NULL,
  `lastname` VARCHAR(45) NOT NULL,
  `active` CHAR(1) NOT NULL DEFAULT 'Y',
  PRIMARY KEY (`id_employee`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `employee_has_sidework_history` (
  `employee_has_sidework_history_id` INT NOT NULL AUTO_INCREMENT,
  `employee_id` INT NOT NULL,
  `work_type` INT DEFAULT NULL COMMENT '1 = SideWork, 2 = OT',
  PRIMARY KEY (`employee_has_sidework_history_id`, `employee_id`),
  KEY `fk_employee_has_sidework_history_employee_idx` (`employee_id`),
  KEY `fk_employee_has_sidework_history_work_project1_idx` (`work_type`),
  CONSTRAINT `fk_employee_has_sidework_history_employee`
    FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id_employee`),
  CONSTRAINT `fk_worktype`
    FOREIGN KEY (`work_type`) REFERENCES `worktype` (`id_work_type`)
    ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `sidework_history` (
  `id_sidework_history` INT NOT NULL AUTO_INCREMENT,
  `employee_has_sidework_history_id` INT NOT NULL,
  `start_time` TIME NOT NULL,
  `end_time` TIME DEFAULT NULL,
  `work_comment` VARCHAR(250) DEFAULT NULL,
  `last_update_time` DATETIME NOT NULL,
  `work_anywhere` TINYINT DEFAULT NULL,
  `day` DATE DEFAULT NULL,
  PRIMARY KEY (`id_sidework_history`),
  KEY `fk_employee_has_sidework_history_employee_idx` (`employee_has_sidework_history_id`),
  KEY `idx_sidework_history_day` (`day`),
  CONSTRAINT `fk_side_employeehas`
    FOREIGN KEY (`employee_has_sidework_history_id`)
    REFERENCES `employee_has_sidework_history` (`employee_has_sidework_history_id`)
    ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `ot_history` (
  `id_ot_history` INT NOT NULL AUTO_INCREMENT,
  `employee_has_sidework_history_id` INT NOT NULL,
  `start_time` DATETIME NOT NULL,
  `end_time` DATETIME DEFAULT NULL,
  `remark` VARCHAR(45) DEFAULT NULL,
  `last_update_time` DATETIME NOT NULL,
  `id_project` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id_ot_history`),
  KEY `fk_employee_has_sidework_history_employee_idx` (`employee_has_sidework_history_id`),
  KEY `idx_ot_history_start_time` (`start_time`),
  CONSTRAINT `fk_side_employeehas0`
    FOREIGN KEY (`employee_has_sidework_history_id`)
    REFERENCES `employee_has_sidework_history` (`employee_has_sidework_history_id`)
    ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed data (required reference rows)
INSERT IGNORE INTO `worktype` (`id_work_type`, `work_type_name`) VALUES
  (1, 'SideWork'),
  (2, 'OT');
