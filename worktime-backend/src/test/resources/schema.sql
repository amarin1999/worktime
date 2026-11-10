-- Test copy of the production schema (see database/database.sql + database/migrations)
CREATE TABLE IF NOT EXISTS worktype (
  id_work_type INT NOT NULL PRIMARY KEY,
  work_type_name VARCHAR(45) NOT NULL
);
CREATE TABLE IF NOT EXISTS employee (
  id_employee INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  employee_no VARCHAR(45) NOT NULL,
  firstname VARCHAR(45) NOT NULL,
  lastname VARCHAR(45) NOT NULL,
  active CHAR(1) NOT NULL DEFAULT 'Y'
);
CREATE TABLE IF NOT EXISTS employee_has_sidework_history (
  employee_has_sidework_history_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  work_type INT,
  CONSTRAINT fk_esh_employee FOREIGN KEY (employee_id) REFERENCES employee (id_employee),
  CONSTRAINT fk_esh_worktype FOREIGN KEY (work_type) REFERENCES worktype (id_work_type)
);
CREATE TABLE IF NOT EXISTS sidework_history (
  id_sidework_history INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  employee_has_sidework_history_id INT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME,
  work_comment VARCHAR(250),
  last_update_time DATETIME NOT NULL,
  work_anywhere TINYINT,
  `day` DATE,
  CONSTRAINT fk_sh_esh FOREIGN KEY (employee_has_sidework_history_id)
    REFERENCES employee_has_sidework_history (employee_has_sidework_history_id)
);
CREATE TABLE IF NOT EXISTS ot_history (
  id_ot_history INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  employee_has_sidework_history_id INT NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME,
  remark VARCHAR(45),
  last_update_time DATETIME NOT NULL,
  id_project VARCHAR(255),
  CONSTRAINT fk_ot_esh FOREIGN KEY (employee_has_sidework_history_id)
    REFERENCES employee_has_sidework_history (employee_has_sidework_history_id)
);
