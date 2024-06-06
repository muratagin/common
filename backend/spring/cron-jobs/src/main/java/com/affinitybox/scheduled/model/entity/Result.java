package com.affinitybox.scheduled.model.entity;

import com.affinitybox.scheduled.model.enumerator.EmailResult;
import com.affinitybox.scheduled.model.enumerator.ResultStatus;
import lombok.Data;

import javax.persistence.*;
import java.util.Date;

@Entity
@Data
public class Result {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "request_id", referencedColumnName = "id")
    private Request request;

    private Integer statusCode;

    private String response;

    @Temporal(TemporalType.TIMESTAMP)
    private Date startDate;

    @Temporal(TemporalType.TIMESTAMP)
    private Date endDate;

    @Enumerated(EnumType.ORDINAL)
    private ResultStatus status;

    @Enumerated(EnumType.ORDINAL)
    private EmailResult emailResult;
}
