package com.affinitybox.scheduled.utility;

import com.affinitybox.scheduled.model.entity.Request;
import com.affinitybox.scheduled.model.entity.Result;
import com.affinitybox.scheduled.model.enumerator.EmailResult;
import com.affinitybox.scheduled.model.payload.EmailForm;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;

import static com.affinitybox.scheduled.utility.Constants.*;

public class Utility {

    public static HashMap<String, String> extractHeaders(String headers) {

        HashMap<String, String> headersHashMap;
        ObjectMapper mapper = new ObjectMapper();
        try {
            headersHashMap = (HashMap<String, String>) mapper.readValue(headers, HashMap.class);
        } catch (JsonProcessingException e) {
            return null;
        }
        return headersHashMap;
    }

    public static EmailResult sendEmail(Request request, Result result) {

        // create headers
        HttpHeaders headers = new HttpHeaders();
        // set `content-type` header
        headers.setContentType(MediaType.APPLICATION_JSON);
        // set `accept` header
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        // create a post object
        EmailForm emailForm = new EmailForm();
        emailForm.setSubject("[SCHEDULED] - " + request.getId() + " // " + request.getDescription());
        String body = "<strong>Scheduled Cron Job Request & Result :</strong>"
                + "<p>Request :"
                + "<br/>---------"
                + "<br/>ID          : " + request.getId()
                + "<br/>Description : " + request.getDescription()
                + "<br/>URL         : " + request.getUrl()
                + "<br/>Method Type  : " + request.getMethodType()
                + "<br/>Headers     : " + request.getHeaders()
                + "<br/>Cron        : " + request.getCron()
                + "<br/>Emails      : " + request.getEmails() + "</p>"
                + "<p>Result :"
                + "<br/>--------"
                + "<br/>ID          : " + result.getId()
                + "<br/>Status      : " + result.getStatus().toString()
                + "<br/>Status Code : " + result.getStatusCode()
                + "<br/>Start Date  : " + result.getStartDate()
                + "<br/>End Date    : " + result.getEndDate()
                + "<br/>Response    : " + result.getResponse() + "</p>";
        emailForm.setBody(body);
        emailForm.setEmailId(EMAIL_EMAIL_ID);
        emailForm.setNickname(EMAIL_NICKNAME);
        emailForm.setTo(Arrays.asList(request.getEmails().split(";")));

        // build the request
        HttpEntity<EmailForm> entity = new HttpEntity<>(emailForm, headers);

        // send POST request
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> resultOfEmail = restTemplate.postForEntity(EMAIL_MICROSERVICE_URL, entity, String.class);

        //Verify request succeed (20X)
        boolean emailResult = resultOfEmail.getStatusCodeValue() < 300;
        if (emailResult) {
            return EmailResult.SUCCEED;
        } else {
            return EmailResult.FAILED;
        }
    }
}
