MERGE INTO worktype KEY (id_work_type) VALUES (1, 'SideWork'), (2, 'OT');
MERGE INTO employee (id_employee, employee_no, firstname, lastname, active) KEY (id_employee) VALUES
  (1, 'C0001', 'Admin', 'User', 'Y'),
  (2, 'C0002', 'Alice', 'A', 'Y'),
  (3, 'C0003', 'Bob', 'B', 'Y'),
  (4, 't005', 'test', 'test', 'Y');
