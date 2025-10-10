package com.scorebridge.credit_score_sys;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CreditScoreSysApplication {

	public static void main(String[] args) {
		SpringApplication.run(CreditScoreSysApplication.class, args);
	}

}
