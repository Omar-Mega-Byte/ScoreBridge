package com.scorebridge.credit_score_sys.modules.data_ingestion.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.scorebridge.credit_score_sys.modules.data_ingestion.dto.FinancialAccountDto;
import com.scorebridge.credit_score_sys.modules.data_ingestion.dto.FinancialProfileRequest;
import com.scorebridge.credit_score_sys.modules.data_ingestion.dto.FinancialProfileResponse;
import com.scorebridge.credit_score_sys.modules.data_ingestion.model.FinancialAccount;
import com.scorebridge.credit_score_sys.modules.data_ingestion.model.FinancialTransactions;
import com.scorebridge.credit_score_sys.modules.data_ingestion.service.DataIngestionService;
import com.scorebridge.credit_score_sys.modules.user.dto.ApiResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * REST Controller for managing financial data ingestion.
 * Provides endpoints for saving and retrieving financial profiles, accounts,
 * and transactions.
 *
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-10
 */
@RestController
@RequestMapping("/api/data")
@RequiredArgsConstructor
@Validated
@Tag(name = "Data Ingestion", description = "APIs for managing financial data ingestion")
public class DataIngestionController {

    private final DataIngestionService dataIngestionService;

    /**
     * Saves a complete financial profile for a user.
     * This endpoint accepts manually entered financial data and persists it to the
     * database.
     *
     * @param request the financial profile request containing all data
     * @return response with summary of saved data
     */
    @PostMapping("/profiles")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Save financial profile", description = "Saves a complete financial profile including accounts and transactions for a registered user")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Profile saved successfully", content = @Content(schema = @Schema(implementation = FinancialProfileResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input data", content = @Content(schema = @Schema(implementation = ApiResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized - authentication required", content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    })
    public ResponseEntity<FinancialProfileResponse> saveFinancialProfile(
            @Valid @RequestBody FinancialProfileRequest request) {
        FinancialProfileResponse response = dataIngestionService.saveFinancialProfile(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Retrieves all financial accounts for a specific user.
     *
     * @param userId the ID of the user
     * @return list of financial accounts
     */
    @GetMapping("/users/{userId}/accounts")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get user accounts", description = "Retrieves all financial accounts for a specific user")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Accounts retrieved successfully", content = @Content(schema = @Schema(implementation = FinancialAccount.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized - authentication required", content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    })
    public ResponseEntity<List<FinancialAccount>> getUserAccounts(@PathVariable Long userId) {
        List<FinancialAccount> accounts = dataIngestionService.getUserAccounts(userId);
        return ResponseEntity.ok(accounts);
    }

    /**
     * Retrieves a specific financial account by ID.
     *
     * @param accountId the ID of the account
     * @return the financial account
     */
    @GetMapping("/accounts/{accountId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get account by ID", description = "Retrieves a specific financial account by its ID")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Account retrieved successfully", content = @Content(schema = @Schema(implementation = FinancialAccount.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Account not found", content = @Content(schema = @Schema(implementation = ApiResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized - authentication required", content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    })
    public ResponseEntity<FinancialAccount> getAccountById(@PathVariable Long accountId) {
        FinancialAccount account = dataIngestionService.getAccountById(accountId);
        return ResponseEntity.ok(account);
    }

    /**
     * Retrieves all transactions for a specific account.
     *
     * @param accountId the ID of the account
     * @return list of transactions
     */
    @GetMapping("/accounts/{accountId}/transactions")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get account transactions", description = "Retrieves all transactions for a specific financial account")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Transactions retrieved successfully", content = @Content(schema = @Schema(implementation = FinancialTransactions.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Account not found", content = @Content(schema = @Schema(implementation = ApiResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized - authentication required", content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    })
    public ResponseEntity<List<FinancialTransactions>> getAccountTransactions(@PathVariable Long accountId) {
        List<FinancialTransactions> transactions = dataIngestionService.getAccountTransactions(accountId);
        return ResponseEntity.ok(transactions);
    }

    /**
     * Updates an existing financial account.
     *
     * @param accountId  the ID of the account to update
     * @param accountDto the updated account data
     * @return the updated account
     */
    @PutMapping("/accounts/{accountId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Update account", description = "Updates an existing financial account")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Account updated successfully", content = @Content(schema = @Schema(implementation = FinancialAccount.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input data", content = @Content(schema = @Schema(implementation = ApiResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Account not found", content = @Content(schema = @Schema(implementation = ApiResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized - authentication required", content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    })
    public ResponseEntity<FinancialAccount> updateAccount(
            @PathVariable Long accountId,
            @Valid @RequestBody FinancialAccountDto accountDto) {
        FinancialAccount updatedAccount = dataIngestionService.updateAccount(accountId, accountDto);
        return ResponseEntity.ok(updatedAccount);
    }

    /**
     * Deletes a financial account and all its transactions.
     *
     * @param accountId the ID of the account to delete
     * @return success message
     */
    @DeleteMapping("/accounts/{accountId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Delete account", description = "Deletes a financial account and all its associated transactions")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Account deleted successfully", content = @Content(schema = @Schema(implementation = ApiResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Account not found", content = @Content(schema = @Schema(implementation = ApiResponse.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized - authentication required", content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    })
    public ResponseEntity<ApiResponse<Void>> deleteAccount(@PathVariable Long accountId) {
        dataIngestionService.deleteAccount(accountId);
        return ResponseEntity.ok(ApiResponse.success("Account deleted successfully", null));
    }
}
