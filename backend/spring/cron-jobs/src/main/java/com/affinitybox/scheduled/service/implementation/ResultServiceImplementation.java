package com.affinitybox.scheduled.service.implementation;

import com.affinitybox.scheduled.model.entity.Request;
import com.affinitybox.scheduled.model.entity.Result;
import com.affinitybox.scheduled.model.enumerator.EmailResult;
import com.affinitybox.scheduled.model.enumerator.ResultStatus;
import com.affinitybox.scheduled.repository.ResultRepository;
import com.affinitybox.scheduled.service.ResultService;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Date;

@Service
@Transactional
public class ResultServiceImplementation implements ResultService {

    final ResultRepository resultRepository;

    public ResultServiceImplementation(ResultRepository resultRepository) {
        this.resultRepository = resultRepository;
    }

    @Override
    public Result create(Request request) {

        Result result = new Result();
        result.setStartDate(new Date());
        result.setRequest(request);
        result.setStatus(ResultStatus.STARTED);
        return resultRepository.saveAndFlush(result);
    }

    @Override
    public Result update(Result result) {
        return resultRepository.saveAndFlush(result);
    }

    @Override
    public void updateEmailResult(EmailResult emailResult, Long resultId) {
        resultRepository.updateEmailResult(emailResult, resultId);
    }
}
