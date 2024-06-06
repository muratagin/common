package com.affinitybox.scheduled.model.payload;

import lombok.Data;

import java.util.List;

@Data
public class EmailForm {

    private String subject;
    private String body;
    private List<String> to;
    private Integer emailId;
    private String nickname;
}
