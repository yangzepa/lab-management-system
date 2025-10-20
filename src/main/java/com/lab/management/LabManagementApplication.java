package com.lab.management;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class LabManagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(LabManagementApplication.class, args);
	}

}
