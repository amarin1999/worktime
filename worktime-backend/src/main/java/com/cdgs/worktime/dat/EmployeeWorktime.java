package com.cdgs.worktime.dat;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;

public class EmployeeWorktime {
		
	public static void main(String[] args) throws Exception {	
		ArrayList<String> data = new ArrayList<String>();
		
		try {
            Connection con = null;
            Class.forName("com.mysql.cj.jdbc.Driver");
            con = DriverManager.getConnection("jdbc:mysql://10.254.40.203:3306/worktime?useSSL=false&characterEncoding=utf-8&serverTimezone=UTC" , 
   		         "root" , 
   		         "root");
            
            Statement st = con.createStatement();
            ResultSet rs = st.executeQuery("select employee_no, `day`, start_time\r\n" + 
            		"from worktime.employee as e\r\n" + 
            		"inner join worktime.employee_has_sidework_history as esh\r\n" + 
            		"on e.id_employee = esh.employee_id\r\n" + 
            		"inner join worktime.sidework_history as sh\r\n" + 
            		"on esh.employee_has_sidework_history_id = sh.employee_has_sidework_history_id\r\n" + 
            		"ORDER BY `day` ,start_time ASC");
            data.add(" 		          " + "รหัสพนักงาน" + "				" + "วันที่" + " 	  	" + "เวลาเช้างาน");
            while (rs.next()) {
                    String id = rs.getString("employee_no");
                    String day = rs.getString("day");                   
                    String startTime = rs.getString("start_time");
                    data.add(" 			" + id + "			" + day + " " + startTime);

            }
//            writeToFile(data, "Employee.txt");
            writeToFile(data, "Employee.dat");
            rs.close();
            st.close();
            System.out.println(" === ");
		} catch (Exception e) {
			System.out.println(e);
		}
		
	}
	private static void writeToFile(java.util.List<String> list, String path) {
        BufferedWriter out = null;
        try {
                File file = new File(path);
                out = new BufferedWriter(new FileWriter(file, false));
                for (String s : list) {
                        out.write(s);
                        out.newLine();

                }
                out.close();
        } catch (IOException e) {
        }
	}
	
}
