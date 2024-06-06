package com.affinitybox.scheduled.service;

import com.affinitybox.scheduled.model.entity.Request;
import com.affinitybox.scheduled.model.entity.Result;
import com.affinitybox.scheduled.model.enumerator.EmailResult;

public interface ResultService {

    Result create(Request result);

    Result update(Result result);

    void updateEmailResult(EmailResult emailResult, Long resultId);
}
