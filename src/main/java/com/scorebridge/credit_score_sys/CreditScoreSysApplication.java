package com.scorebridge.credit_score_sys;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableJpaAuditing
@ConfigurationPropertiesScan
public class CreditScoreSysApplication {

	public static void main(String[] args) {
		// Load .env file and set as system properties
		try {
			Dotenv dotenv = Dotenv.configure()
					.directory("./") // Look for .env in project root
					.ignoreIfMissing() // Don't fail if .env is missing (use defaults)
					.load();

			// Set environment variables as system properties for Spring Boot
			dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));
		} catch (Exception e) {
			System.out.println("Warning: Could not load .env file. Using default configuration.");
		}

		SpringApplication.run(CreditScoreSysApplication.class, args);
	}

}
