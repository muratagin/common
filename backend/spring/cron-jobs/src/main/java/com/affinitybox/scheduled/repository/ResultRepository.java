package com.affinitybox.scheduled.repository;

import com.affinitybox.scheduled.model.entity.Result;
import com.affinitybox.scheduled.model.enumerator.EmailResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ResultRepository extends JpaRepository<Result, Long> {

    @Modifying
    @Query("update Result x " +
            "set   x.emailResult = :emailResult " +
            "where x.id = :resultId")
    void updateEmailResult(
            @Param("emailResult") EmailResult emailResult,
            @Param("resultId") Long resultId
    );
}
