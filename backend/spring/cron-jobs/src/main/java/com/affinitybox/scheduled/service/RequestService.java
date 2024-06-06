package com.affinitybox.scheduled.service;

import com.affinitybox.scheduled.model.entity.Request;

import java.util.List;

public interface RequestService {

    List<Request> find();

    void updateAllIsNew();

    void updateIsApplicable(boolean isApplicable, Long requestId);
}
