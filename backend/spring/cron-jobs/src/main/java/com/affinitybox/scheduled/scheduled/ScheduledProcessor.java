package com.affinitybox.scheduled.scheduled;

import com.affinitybox.scheduled.model.entity.Request;
import com.affinitybox.scheduled.model.entity.Result;
import com.affinitybox.scheduled.model.enumerator.EmailResult;
import com.affinitybox.scheduled.model.enumerator.RequestMethodType;
import com.affinitybox.scheduled.model.enumerator.ResultStatus;
import com.affinitybox.scheduled.model.payload.ResultForm;
import com.affinitybox.scheduled.service.RequestService;
import com.affinitybox.scheduled.service.ResultService;
import com.affinitybox.scheduled.utility.Utility;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.annotation.SchedulingConfigurer;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.scheduling.config.ScheduledTaskRegistrar;
import org.springframework.scheduling.support.CronTrigger;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.concurrent.Future;
import java.util.concurrent.ScheduledFuture;

@Component
@Slf4j
public class ScheduledProcessor implements SchedulingConfigurer {

    final RequestService requestService;
    final ResultService resultService;

    ScheduledTaskRegistrar scheduledTaskRegistrar;

    ScheduledFuture future;
    ScheduledFuture newFuture;

    public ScheduledProcessor(
            RequestService requestService,
            ResultService resultService
    ) {
        this.requestService = requestService;
        this.resultService = resultService;
    }

    List<Future> futures1 = new ArrayList<>();
    List<Future> futures2 = new ArrayList<>();

    public TaskScheduler poolScheduler() {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
        scheduler.setThreadNamePrefix("ThreadPoolTaskScheduler");
        scheduler.setPoolSize(1);
        scheduler.initialize();
        return scheduler;
    }

    @Override
    public void configureTasks(ScheduledTaskRegistrar taskRegistrar) {

        if (scheduledTaskRegistrar == null) {
            scheduledTaskRegistrar = taskRegistrar;
        }

        if (taskRegistrar.getScheduler() == null) {
            TaskScheduler taskScheduler = poolScheduler();
            taskRegistrar.setScheduler(taskScheduler);
        }

        List<Request> requests = requestService.find();
        for(Request request : requests) {
            try {
                CronTrigger cronTrigger = new CronTrigger(request.getCron(), TimeZone.getDefault());
                if (future == null || !future.isCancelled()) {
                    future = taskRegistrar.getScheduler().schedule(() -> scheduleCron(request), cronTrigger);
                    futures1.add(future);
                }
                requestService.updateIsApplicable(true, request.getId());
            } catch (IllegalArgumentException e) {
                requestService.updateIsApplicable(false, request.getId());
                log.error("Cron is not applicable for Request id : " + request.getId());
            }
        }

        log.info("All requests are loaded! Request count : " + requests.size());

        CronTrigger cronTrigger = new CronTrigger("30 * * * * *", TimeZone.getDefault());
        if(newFuture == null) {
            newFuture = taskRegistrar.getScheduler().schedule(this::activateScheduler, cronTrigger);
            futures2.add(newFuture);
        }
        else if(!newFuture.isCancelled()) {
            newFuture = taskRegistrar.getScheduler().schedule(this::activateScheduler, cronTrigger);
            futures2.add(newFuture);
        }

        log.info("New controller is loaded!");
    }

    public void scheduleCron(Request request) {

        log.info("Request is started! Request id : " + request.getId());

        HashMap<String, String> headers = null;
        if (StringUtils.hasText(request.getHeaders())) {
            headers = Utility.extractHeaders(request.getHeaders());
        }

        Result result = resultService.create(request);

        log.info("HTTPRequest is sent for Request id : " + request.getId());
        ResultForm resultForm;
        try {
            resultForm = requestToUrl(request.getUrl(), request.getMethodType(), headers);
        } catch (Exception e) {
            resultForm = new ResultForm();
            resultForm.setResponse("No Response (Service Unavailable)");
            resultForm.setStatusCode(503);
        }
        log.info("HTTPRequest result is received for Request id : " + request.getId());

        Date endDate = new Date();
        result.setEndDate(endDate);
        result.setResponse(resultForm.getResponse());
        result.setStatusCode(resultForm.getStatusCode());
        if (resultForm.getStatusCode() < 300) {
            result.setStatus(ResultStatus.SUCCEED);
        } else {
            result.setStatus(ResultStatus.FAILED);
        }
        result = resultService.update(result);

        log.info("Result(" + result.getId() + ") is ended for Request id : " + request.getId());

        if (StringUtils.hasText(request.getEmails())) {
            EmailResult emailResult = Utility.sendEmail(request, result);
            resultService.updateEmailResult(emailResult, result.getId());
        } else {
            resultService.updateEmailResult(EmailResult.NOT_SENT, result.getId());
        }
        log.info("Result(" + result.getId() + ") email process is ended for Request id : " + request.getId());
    }

    public void cancelTasks(boolean mayInterruptIfRunning) {
        future = null;
        newFuture = null;
        for(Future future : futures1) {
            future.cancel(mayInterruptIfRunning);
        }
        for(Future future : futures2) {
            future.cancel(mayInterruptIfRunning);
        }
        requestService.updateAllIsNew();
        log.info("All running tasks are cancelled!");
    }

    public void activateScheduler() {

        log.info("New controller is started!");

        int counter = 0;
        List<Request> requests = requestService.find();
        for(Request request : requests) {
            if(request.getIsNew()) {
                log.info("New request is found! Request id : " + request.getId());
                cancelTasks(false);
                configureTasks(scheduledTaskRegistrar);
                counter++;
                break;
            }
        }
        log.info("New controller is finished! New task count : " + counter);
    }

    public ResultForm requestToUrl(String url, RequestMethodType methodType, HashMap<String, String> headers) {

        ResultForm resultForm = new ResultForm();

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders requestHeaders = new HttpHeaders();
        if (headers != null && !headers.isEmpty()) {
            headers.forEach(requestHeaders::add);
        }

        String contentType = requestHeaders.getFirst("Content-Type");
        if (!StringUtils.hasText(contentType)) {
            requestHeaders.setContentType(MediaType.APPLICATION_JSON);
        }

        HttpEntity<Object> httpEntity = new HttpEntity<>(requestHeaders);
        try {
            ResponseEntity<String> result = restTemplate.exchange(
                    url,
                    RequestMethodType.getHttpMethod(methodType.ordinal()),
                    httpEntity, String.class
            );
            if (result.getBody() != null) {
                resultForm.setResponse(result.getBody());
            } else {
                resultForm.setResponse("Empty Response");
            }
            resultForm.setStatusCode(result.getStatusCodeValue());
        } catch (HttpClientErrorException e) {
            resultForm.setStatusCode(e.getStatusCode().value());
            resultForm.setResponse(e.getResponseBodyAsString());
        }
        return resultForm;
    }
}