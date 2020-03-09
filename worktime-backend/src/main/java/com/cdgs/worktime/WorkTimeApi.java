package com.cdgs.worktime;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.zaxxer.hikari.HikariDataSource;

@SpringBootApplication
public class WorkTimeApi  implements CommandLineRunner {
	
	@Autowired
	DataSource dataSource;
	public static void main(String[] args) {
		SpringApplication.run(WorkTimeApi.class, args);
	}
	
	@Override
	public void run(String... args) throws Exception {
		System.out.println("Datasources: "+ dataSource);
		HikariDataSource dataSoxe = (HikariDataSource)dataSource;
		System.out.println("Datasource: "+ dataSoxe.getMaximumPoolSize());
		System.out.println("JdbcUrl: "+ dataSoxe.getJdbcUrl());
		System.out.println("Username: "+ dataSoxe.getUsername());
		System.out.println("Password: "+ dataSoxe.getPassword());
		System.out.println();
		System.out.println("============================================================================================");
		System.out.println("API Started...");
		System.out.println("============================================================================================");
		System.out.println();
	}
}
