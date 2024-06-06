package com.affinitybox.scheduled.repository;

import com.affinitybox.scheduled.model.entity.Request;
import com.affinitybox.scheduled.model.enumerator.EmailResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestRepository extends JpaRepository<Request, Long> {

    @Query("select r from Request r where r.isNew = true and r.isDeleted = false")
    List<Request> findIsNew();

    @Query("select r from Request r where r.isDeleted = false")
    List<Request> find();

    @Modifying
    @Query("update Request x " +
            "set   x.isApplicable = :isApplicable " +
            "where x.id = :requestId")
    void updateIsApplicable(
            @Param("isApplicable") boolean isApplicable,
            @Param("requestId") Long requestId
    );
}
