package com.affinitybox.scheduled.model.enumerator;

import org.springframework.http.HttpMethod;

public enum RequestMethodType {

    GET("GET"),
    POST("POST"),
    PUT("PUT"),
    PATCH("PATCH"),
    DELETE("DELETE");

    private final String text;

    RequestMethodType(final String text) { this.text = text; }

    public static RequestMethodType getRequestMethod(Integer ordinal) {
        if (ordinal != null) {
            if (ordinal == 0)
                return RequestMethodType.GET;
            else if (ordinal == 1)
                return RequestMethodType.POST;
            else if (ordinal == 2)
                return RequestMethodType.PUT;
            else if (ordinal == 3)
                return RequestMethodType.PATCH;
            else if (ordinal == 4)
                return RequestMethodType.DELETE;
        }
        return null;
    }

    public static HttpMethod getHttpMethod(Integer ordinal) {
        if (ordinal != null) {
            if (ordinal == 0)
                return HttpMethod.GET;
            else if (ordinal == 1)
                return HttpMethod.POST;
            else if (ordinal == 2)
                return HttpMethod.PUT;
            else if (ordinal == 3)
                return HttpMethod.PATCH;
            else if (ordinal == 4)
                return HttpMethod.DELETE;
        }
        return null;
    }

    @Override
    public String toString() { return text; }
}
