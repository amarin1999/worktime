SELECT sh.start_time,sh.end_time,sh.work_comment 
			 FROM worktime.sidework_history sh 
			 JOIN worktime.employee_has_sidework_history esh 
			JOIN worktime.employee e WHERE e.id_employee= 1