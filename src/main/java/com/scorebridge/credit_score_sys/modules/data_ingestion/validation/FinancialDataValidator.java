package com.scorebridge.credit_score_sys.modules.data_ingestion.validation;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import com.scorebridge.credit_score_sys.modules.data_ingestion.dto.FinancialAccountDto;
import com.scorebridge.credit_score_sys.modules.data_ingestion.dto.FinancialProfileRequest;
import com.scorebridge.credit_score_sys.modules.data_ingestion.dto.TransactionDto;
import com.scorebridge.credit_score_sys.modules.data_ingestion.exception.DataValidationException;

/**
 * Utility class for validating financial data before saving.
 * Provides comprehensive validation for financial profiles, accounts, and
 * transactions.
 *
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-10
 */
@Component
public class FinancialDataValidator {

    private static final int MAX_ACCOUNTS_PER_USER = 20;
    private static final int MAX_TRANSACTIONS_PER_ACCOUNT = 1000;
    private static final double MAX_TRANSACTION_AMOUNT = 1_000_000.0;
    private static final double MAX_ACCOUNT_BALANCE = 10_000_000.0;

    /**
     * Validates a complete financial profile request.
     *
     * @param request the profile request to validate
     * @return list of validation error messages (empty if valid)
     */
    public List<String> validateProfile(FinancialProfileRequest request) {
        List<String> errors = new ArrayList<>();

        if (request == null) {
            errors.add("Financial profile request cannot be null");
            return errors;
        }

        if (request.getUserId() == null) {
            errors.add("User ID is required");
        }

        if (request.getAccounts() == null || request.getAccounts().isEmpty()) {
            errors.add("At least one financial account is required");
        } else {
            if (request.getAccounts().size() > MAX_ACCOUNTS_PER_USER) {
                errors.add(String.format("Cannot save more than %d accounts per user", MAX_ACCOUNTS_PER_USER));
            }

            int accountIndex = 0;
            for (FinancialAccountDto account : request.getAccounts()) {
                List<String> accountErrors = validateAccount(account, accountIndex);
                errors.addAll(accountErrors);
                accountIndex++;
            }
        }

        return errors;
    }

    /**
     * Validates a financial account DTO.
     *
     * @param account the account to validate
     * @param index   the index of the account in the list (for error messages)
     * @return list of validation error messages
     */
    public List<String> validateAccount(FinancialAccountDto account, int index) {
        List<String> errors = new ArrayList<>();
        String prefix = String.format("Account #%d: ", index + 1);

        if (account == null) {
            errors.add(prefix + "Account cannot be null");
            return errors;
        }

        // Validate institution name
        if (account.getInstitutionName() == null || account.getInstitutionName().isBlank()) {
            errors.add(prefix + "Institution name is required");
        } else if (account.getInstitutionName().length() > 255) {
            errors.add(prefix + "Institution name must not exceed 255 characters");
        }

        // Validate account type
        if (account.getAccountType() == null || account.getAccountType().isBlank()) {
            errors.add(prefix + "Account type is required");
        } else if (!isValidAccountType(account.getAccountType())) {
            errors.add(prefix + "Invalid account type. Allowed values: checking, savings, credit_card, investment");
        }

        // Validate account number last 4
        if (account.getAccountNumberLast4() != null && !account.getAccountNumberLast4().matches("\\d{4}")) {
            errors.add(prefix + "Account number last 4 must be exactly 4 digits");
        }

        // Validate current balance
        if (account.getCurrentBalance() == null) {
            errors.add(prefix + "Current balance is required");
        } else if (account.getCurrentBalance() < 0) {
            errors.add(prefix + "Current balance cannot be negative");
        } else if (account.getCurrentBalance() > MAX_ACCOUNT_BALANCE) {
            errors.add(prefix + String.format("Current balance cannot exceed $%.2f", MAX_ACCOUNT_BALANCE));
        }

        // Validate transactions
        if (account.getTransactions() != null) {
            if (account.getTransactions().size() > MAX_TRANSACTIONS_PER_ACCOUNT) {
                errors.add(prefix + String.format("Cannot have more than %d transactions per account",
                        MAX_TRANSACTIONS_PER_ACCOUNT));
            }

            int transactionIndex = 0;
            for (TransactionDto transaction : account.getTransactions()) {
                List<String> transactionErrors = validateTransaction(transaction, index, transactionIndex);
                errors.addAll(transactionErrors);
                transactionIndex++;
            }
        }

        return errors;
    }

    /**
     * Validates a transaction DTO.
     *
     * @param transaction      the transaction to validate
     * @param accountIndex     the index of the account
     * @param transactionIndex the index of the transaction
     * @return list of validation error messages
     */
    public List<String> validateTransaction(TransactionDto transaction, int accountIndex, int transactionIndex) {
        List<String> errors = new ArrayList<>();
        String prefix = String.format("Account #%d, Transaction #%d: ", accountIndex + 1, transactionIndex + 1);

        if (transaction == null) {
            errors.add(prefix + "Transaction cannot be null");
            return errors;
        }

        // Validate amount
        if (transaction.getAmount() == null) {
            errors.add(prefix + "Transaction amount is required");
        } else if (transaction.getAmount() <= 0) {
            errors.add(prefix + "Transaction amount must be greater than 0");
        } else if (transaction.getAmount() > MAX_TRANSACTION_AMOUNT) {
            errors.add(prefix + String.format("Transaction amount cannot exceed $%.2f", MAX_TRANSACTION_AMOUNT));
        }

        // Validate transaction type
        if (transaction.getTransactionType() == null || transaction.getTransactionType().isBlank()) {
            errors.add(prefix + "Transaction type is required");
        } else if (!transaction.getTransactionType().matches("^(INCOME|EXPENSE)$")) {
            errors.add(prefix + "Transaction type must be either INCOME or EXPENSE");
        }

        // Validate category
        if (transaction.getCategory() == null || transaction.getCategory().isBlank()) {
            errors.add(prefix + "Category is required");
        } else if (transaction.getCategory().length() > 100) {
            errors.add(prefix + "Category must not exceed 100 characters");
        } else if (!isValidCategory(transaction.getCategory())) {
            errors.add(prefix
                    + "Invalid category. Please use standard categories like Salary, Rent, Utilities, Groceries, etc.");
        }

        // Validate description
        if (transaction.getDescription() != null && transaction.getDescription().length() > 255) {
            errors.add(prefix + "Description must not exceed 255 characters");
        }

        // Validate transaction date
        if (transaction.getTransactionDate() == null) {
            errors.add(prefix + "Transaction date is required");
        } else {
            LocalDate now = LocalDate.now();
            LocalDate oneYearAgo = now.minusYears(1);

            if (transaction.getTransactionDate().isAfter(now)) {
                errors.add(prefix + "Transaction date cannot be in the future");
            } else if (transaction.getTransactionDate().isBefore(oneYearAgo)) {
                errors.add(prefix + "Transaction date cannot be more than 1 year in the past");
            }
        }

        return errors;
    }

    /**
     * Checks if the account type is valid.
     *
     * @param accountType the account type to check
     * @return true if valid, false otherwise
     */
    private boolean isValidAccountType(String accountType) {
        return accountType.matches("(?i)^(checking|savings|credit_card|investment)$");
    }

    /**
     * Checks if the transaction category is valid.
     *
     * @param category the category to check
     * @return true if valid, false otherwise
     */
    private boolean isValidCategory(String category) {
        // List of common valid categories
        String[] validCategories = {
                "Salary", "Wages", "Freelance", "Investment Income", "Rental Income", "Other Income",
                "Rent", "Mortgage", "Utilities", "Groceries", "Dining", "Transportation",
                "Entertainment", "Healthcare", "Insurance", "Education", "Shopping",
                "Travel", "Subscriptions", "Debt Payment", "Savings", "Other Expense"
        };

        for (String validCategory : validCategories) {
            if (category.equalsIgnoreCase(validCategory)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Validates and throws exception if errors are found.
     *
     * @param request the profile request to validate
     * @throws DataValidationException if validation fails
     */
    public void validateAndThrow(FinancialProfileRequest request) {
        List<String> errors = validateProfile(request);
        if (!errors.isEmpty()) {
            throw new DataValidationException("Validation failed: " + String.join("; ", errors));
        }
    }
}
