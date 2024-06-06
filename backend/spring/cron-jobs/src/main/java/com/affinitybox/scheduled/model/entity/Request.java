package com.affinitybox.scheduled.model.entity;

import com.affinitybox.scheduled.model.enumerator.RequestMethodType;
import lombok.Data;

import javax.persistence.*;

@Entity
@Data
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;

    private String url;

    private String cron;

    @Enumerated(EnumType.ORDINAL)
    private RequestMethodType methodType;

    private String emails;

    private String headers;

    private Boolean isNew;

    private Boolean isDeleted;

    private Boolean isApplicable;
}