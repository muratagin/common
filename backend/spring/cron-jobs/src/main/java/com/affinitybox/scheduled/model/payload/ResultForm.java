package com.affinitybox.scheduled.model.payload;

import com.affinitybox.scheduled.utility.Constants;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;
import java.util.Date;

@Data
public class ResultForm {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Integer statusCode;
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String response;
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Date issueDate;

    @NotNull(message = Constants.PLEASE_ENTER_REQUEST_ID)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Long requestId;
    @NotNull(message = Constants.PLEASE_ENTER_ISSUE_START_DATE)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String issueDateStart;
    @NotNull(message = Constants.PLEASE_ENTER_ISSUE_END_DATE)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String issueDateEnd;
}
