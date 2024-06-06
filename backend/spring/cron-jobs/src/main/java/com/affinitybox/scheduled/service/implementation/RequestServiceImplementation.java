package com.affinitybox.scheduled.service.implementation;

import com.affinitybox.scheduled.model.entity.Request;
import com.affinitybox.scheduled.model.enumerator.EmailResult;
import com.affinitybox.scheduled.repository.RequestRepository;
import com.affinitybox.scheduled.service.RequestService;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public class RequestServiceImplementation implements RequestService {

    final RequestRepository requestRepository;

    public RequestServiceImplementation(
            RequestRepository requestRepository
    ) {
        this.requestRepository = requestRepository;
    }

    @Override
    public List<Request> find() {
        return requestRepository.find();
    }

    @Override
    public void updateAllIsNew() {
        List<Request> requests = requestRepository.findIsNew();
        if (requests != null && !requests.isEmpty()) {
            for (Request request : requests) {
                request.setIsNew(false);
                requestRepository.saveAndFlush(request);
            }
        }
    }

    @Override
    public void updateIsApplicable(boolean isApplicable, Long requestId) {
        requestRepository.updateIsApplicable(isApplicable, requestId);
    }
}
