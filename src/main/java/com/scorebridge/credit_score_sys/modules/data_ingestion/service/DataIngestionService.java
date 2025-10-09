package com.scorebridge.credit_score_sys.modules.data_ingestion.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.scorebridge.credit_score_sys.modules.data_ingestion.dto.FinancialAccountDto;
import com.scorebridge.credit_score_sys.modules.data_ingestion.dto.FinancialProfileRequest;
import com.scorebridge.credit_score_sys.modules.data_ingestion.dto.FinancialProfileResponse;
import com.scorebridge.credit_score_sys.modules.data_ingestion.dto.TransactionDto;
import com.scorebridge.credit_score_sys.modules.data_ingestion.exception.AccountNotFoundException;
import com.scorebridge.credit_score_sys.modules.data_ingestion.exception.DataIngestionException;
import com.scorebridge.credit_score_sys.modules.data_ingestion.exception.DataValidationException;
import com.scorebridge.credit_score_sys.modules.data_ingestion.model.FinancialAccount;
import com.scorebridge.credit_score_sys.modules.data_ingestion.model.FinancialTransactions;
import com.scorebridge.credit_score_sys.modules.data_ingestion.repository.FinancialAccountRepository;
import com.scorebridge.credit_score_sys.modules.data_ingestion.repository.FinancialTransactionRepository;
import com.scorebridge.credit_score_sys.modules.user.model.User;
import com.scorebridge.credit_score_sys.modules.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

/**
 * Service class for managing financial data ingestion.
 * Handles saving and retrieving financial profiles, accounts, and transactions.
 *
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-10
 */
@Service
@RequiredArgsConstructor
public class DataIngestionService {

    private static final Logger logger = LoggerFactory.getLogger(DataIngestionService.class);

    private final FinancialAccountRepository accountRepository;
    private final FinancialTransactionRepository transactionRepository;
    private final UserRepository userRepository;

    /**
     * Saves a complete financial profile for a user.
     * Creates accounts and their associated transactions in a single transaction.
     *
     * @param request the financial profile request containing all data
     * @return response with summary of saved data
     * @throws DataValidationException if the data fails validation
     * @throws DataIngestionException  if saving fails
     */
    @Transactional
    public FinancialProfileResponse saveFinancialProfile(FinancialProfileRequest request) {
        logger.info("Starting to save financial profile for user ID: {}", request.getUserId());

        try {
            // Validate the request
            validateProfileRequest(request);

            // Get the user
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new DataValidationException("User not found with ID: " + request.getUserId()));

            List<Long> accountIds = new ArrayList<>();
            int totalTransactions = 0;
            double totalBalance = 0.0;

            // Process each account
            for (FinancialAccountDto accountDto : request.getAccounts()) {
                FinancialAccount account = createAccount(accountDto, user);
                FinancialAccount savedAccount = accountRepository.save(account);
                accountIds.add(savedAccount.getId());
                totalBalance += savedAccount.getCurrentBalance();

                // Process transactions for this account
                if (accountDto.getTransactions() != null && !accountDto.getTransactions().isEmpty()) {
                    List<FinancialTransactions> transactions = createTransactions(accountDto.getTransactions(),
                            savedAccount);
                    transactionRepository.saveAll(transactions);
                    totalTransactions += transactions.size();
                }
            }

            logger.info("Successfully saved financial profile: {} accounts, {} transactions", accountIds.size(),
                    totalTransactions);

            return FinancialProfileResponse.builder()
                    .userId(user.getId())
                    .accountIds(accountIds)
                    .totalAccounts(accountIds.size())
                    .totalTransactions(totalTransactions)
                    .totalBalance(totalBalance)
                    .savedAt(LocalDateTime.now())
                    .message("Financial profile saved successfully")
                    .build();

        } catch (DataValidationException e) {
            logger.error("Validation error while saving financial profile: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("Error saving financial profile", e);
            throw new DataIngestionException("Failed to save financial profile: " + e.getMessage(), e);
        }
    }

    /**
     * Retrieves all financial accounts for a specific user.
     *
     * @param userId the ID of the user
     * @return list of financial accounts
     */
    @Transactional(readOnly = true)
    public List<FinancialAccount> getUserAccounts(Long userId) {
        logger.info("Retrieving accounts for user ID: {}", userId);
        return accountRepository.findByUserId(userId);
    }

    /**
     * Retrieves a specific financial account by ID.
     *
     * @param accountId the ID of the account
     * @return the financial account
     * @throws AccountNotFoundException if the account is not found
     */
    @Transactional(readOnly = true)
    public FinancialAccount getAccountById(Long accountId) {
        logger.info("Retrieving account with ID: {}", accountId);
        return accountRepository.findById(accountId)
                .orElseThrow(() -> new AccountNotFoundException("Account not found with ID: " + accountId));
    }

    /**
     * Retrieves all transactions for a specific account.
     *
     * @param accountId the ID of the account
     * @return list of transactions
     */
    @Transactional(readOnly = true)
    public List<FinancialTransactions> getAccountTransactions(Long accountId) {
        logger.info("Retrieving transactions for account ID: {}", accountId);

        // Verify account exists
        if (!accountRepository.existsById(accountId)) {
            throw new AccountNotFoundException("Account not found with ID: " + accountId);
        }

        return transactionRepository.findByAccountId(accountId);
    }

    /**
     * Deletes a financial account and all its transactions.
     *
     * @param accountId the ID of the account to delete
     * @throws AccountNotFoundException if the account is not found
     */
    @Transactional
    public void deleteAccount(Long accountId) {
        logger.info("Deleting account with ID: {}", accountId);

        FinancialAccount account = accountRepository.findById(accountId)
                .orElseThrow(() -> new AccountNotFoundException("Account not found with ID: " + accountId));

        accountRepository.delete(account);
        logger.info("Successfully deleted account with ID: {}", accountId);
    }

    /**
     * Updates an existing financial account.
     *
     * @param accountId  the ID of the account to update
     * @param accountDto the updated account data
     * @return the updated account
     * @throws AccountNotFoundException if the account is not found
     */
    @Transactional
    public FinancialAccount updateAccount(Long accountId, FinancialAccountDto accountDto) {
        logger.info("Updating account with ID: {}", accountId);

        FinancialAccount account = accountRepository.findById(accountId)
                .orElseThrow(() -> new AccountNotFoundException("Account not found with ID: " + accountId));

        account.setInstitutionName(accountDto.getInstitutionName());
        account.setAccountType(accountDto.getAccountType());
        account.setAccountNumberLast4(accountDto.getAccountNumberLast4());
        account.setCurrentBalance(accountDto.getCurrentBalance());

        FinancialAccount updatedAccount = accountRepository.save(account);
        logger.info("Successfully updated account with ID: {}", accountId);

        return updatedAccount;
    }

    /**
     * Validates a financial profile request.
     *
     * @param request the request to validate
     * @throws DataValidationException if validation fails
     */
    private void validateProfileRequest(FinancialProfileRequest request) {
        if (request.getUserId() == null) {
            throw new DataValidationException("User ID is required");
        }

        if (request.getAccounts() == null || request.getAccounts().isEmpty()) {
            throw new DataValidationException("At least one financial account is required");
        }

        // Validate each account
        for (FinancialAccountDto accountDto : request.getAccounts()) {
            validateAccountDto(accountDto);
        }
    }

    /**
     * Validates a financial account DTO.
     *
     * @param accountDto the account to validate
     * @throws DataValidationException if validation fails
     */
    private void validateAccountDto(FinancialAccountDto accountDto) {
        if (accountDto.getInstitutionName() == null || accountDto.getInstitutionName().isBlank()) {
            throw new DataValidationException("Institution name is required");
        }

        if (accountDto.getAccountType() == null || accountDto.getAccountType().isBlank()) {
            throw new DataValidationException("Account type is required");
        }

        if (accountDto.getCurrentBalance() == null || accountDto.getCurrentBalance() < 0) {
            throw new DataValidationException("Current balance must be a positive number");
        }
    }

    /**
     * Creates a FinancialAccount entity from a DTO.
     *
     * @param accountDto the account DTO
     * @param user       the user who owns the account
     * @return the created account entity
     */
    private FinancialAccount createAccount(FinancialAccountDto accountDto, User user) {
        FinancialAccount account = new FinancialAccount();
        account.setUser(user);
        account.setInstitutionName(accountDto.getInstitutionName());
        account.setAccountType(accountDto.getAccountType());
        account.setAccountNumberLast4(accountDto.getAccountNumberLast4());
        account.setCurrentBalance(accountDto.getCurrentBalance());
        return account;
    }

    /**
     * Creates a list of FinancialTransactions entities from DTOs.
     *
     * @param transactionDtos the list of transaction DTOs
     * @param account         the account that owns these transactions
     * @return list of transaction entities
     */
    private List<FinancialTransactions> createTransactions(List<TransactionDto> transactionDtos,
            FinancialAccount account) {
        List<FinancialTransactions> transactions = new ArrayList<>();

        for (TransactionDto dto : transactionDtos) {
            FinancialTransactions transaction = new FinancialTransactions();
            transaction.setAccount(account);
            transaction.setAmount(dto.getAmount());
            transaction.setTransactionType(dto.getTransactionType());
            transaction.setCategory(dto.getCategory());
            transaction.setDescription(dto.getDescription());
            transaction.setTransactionDate(dto.getTransactionDate());
            transactions.add(transaction);
        }

        return transactions;
    }
}
