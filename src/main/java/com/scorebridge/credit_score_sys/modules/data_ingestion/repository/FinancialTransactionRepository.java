package com.scorebridge.credit_score_sys.modules.data_ingestion.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.scorebridge.credit_score_sys.modules.data_ingestion.model.FinancialTransactions;

/**
 * Repository interface for performing database operations on
 * FinancialTransactions entities.
 * Provides methods for querying transactions by account, date range, and
 * category.
 *
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-10
 */
@Repository
public interface FinancialTransactionRepository extends JpaRepository<FinancialTransactions, Long> {

    /**
     * Finds all transactions for a specific financial account.
     *
     * @param accountId the ID of the account
     * @return list of transactions for the account
     */
    @Query("SELECT ft FROM FinancialTransactions ft WHERE ft.account.id = :accountId ORDER BY ft.transactionDate DESC")
    List<FinancialTransactions> findByAccountId(@Param("accountId") Long accountId);

    /**
     * Finds transactions for a specific account within a date range.
     *
     * @param accountId the ID of the account
     * @param startDate the start date
     * @param endDate   the end date
     * @return list of transactions within the date range
     */
    @Query("SELECT ft FROM FinancialTransactions ft WHERE ft.account.id = :accountId " +
            "AND ft.transactionDate BETWEEN :startDate AND :endDate ORDER BY ft.transactionDate DESC")
    List<FinancialTransactions> findByAccountIdAndDateRange(
            @Param("accountId") Long accountId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    /**
     * Finds transactions by category for a specific account.
     *
     * @param accountId the ID of the account
     * @param category  the transaction category
     * @return list of transactions in the category
     */
    @Query("SELECT ft FROM FinancialTransactions ft WHERE ft.account.id = :accountId " +
            "AND ft.category = :category ORDER BY ft.transactionDate DESC")
    List<FinancialTransactions> findByAccountIdAndCategory(
            @Param("accountId") Long accountId,
            @Param("category") String category);

    /**
     * Finds transactions by type (INCOME or EXPENSE) for a specific account.
     *
     * @param accountId       the ID of the account
     * @param transactionType the transaction type
     * @return list of transactions of the specified type
     */
    @Query("SELECT ft FROM FinancialTransactions ft WHERE ft.account.id = :accountId " +
            "AND ft.transactionType = :transactionType ORDER BY ft.transactionDate DESC")
    List<FinancialTransactions> findByAccountIdAndType(
            @Param("accountId") Long accountId,
            @Param("transactionType") String transactionType);

    /**
     * Calculates the total amount for transactions of a specific type.
     *
     * @param accountId       the ID of the account
     * @param transactionType the transaction type
     * @return sum of transaction amounts
     */
    @Query("SELECT COALESCE(SUM(ft.amount), 0.0) FROM FinancialTransactions ft " +
            "WHERE ft.account.id = :accountId AND ft.transactionType = :transactionType")
    Double sumByAccountIdAndType(
            @Param("accountId") Long accountId,
            @Param("transactionType") String transactionType);

    /**
     * Deletes all transactions for a specific account.
     *
     * @param accountId the ID of the account
     */
    @Query("DELETE FROM FinancialTransactions ft WHERE ft.account.id = :accountId")
    void deleteByAccountId(@Param("accountId") Long accountId);
}
