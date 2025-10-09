package com.scorebridge.credit_score_sys.modules.data_ingestion.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.scorebridge.credit_score_sys.modules.data_ingestion.model.FinancialAccount;

/**
 * Repository interface for performing database operations on FinancialAccount
 * entities.
 * Provides methods for querying financial accounts by user and institution.
 *
 * @author ScoreBridge Team
 * @version 1.0
 * @since 2025-10-10
 */
@Repository
public interface FinancialAccountRepository extends JpaRepository<FinancialAccount, Long> {

    /**
     * Finds all financial accounts for a specific user.
     *
     * @param userId the ID of the user
     * @return list of financial accounts belonging to the user
     */
    @Query("SELECT fa FROM FinancialAccount fa WHERE fa.user.id = :userId")
    List<FinancialAccount> findByUserId(@Param("userId") Long userId);

    /**
     * Finds a specific account by user and institution name.
     *
     * @param userId          the ID of the user
     * @param institutionName the name of the financial institution
     * @return optional containing the account if found
     */
    @Query("SELECT fa FROM FinancialAccount fa WHERE fa.user.id = :userId AND fa.institutionName = :institutionName")
    Optional<FinancialAccount> findByUserIdAndInstitutionName(
            @Param("userId") Long userId,
            @Param("institutionName") String institutionName);

    /**
     * Counts the total number of accounts for a user.
     *
     * @param userId the ID of the user
     * @return number of accounts
     */
    @Query("SELECT COUNT(fa) FROM FinancialAccount fa WHERE fa.user.id = :userId")
    Long countByUserId(@Param("userId") Long userId);

    /**
     * Checks if a user has any accounts.
     *
     * @param userId the ID of the user
     * @return true if user has at least one account
     */
    @Query("SELECT CASE WHEN COUNT(fa) > 0 THEN true ELSE false END FROM FinancialAccount fa WHERE fa.user.id = :userId")
    boolean existsByUserId(@Param("userId") Long userId);
}
