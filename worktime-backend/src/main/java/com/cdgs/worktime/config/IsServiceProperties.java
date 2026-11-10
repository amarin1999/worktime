package com.cdgs.worktime.config;

import java.net.URI;
import java.time.Duration;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;

/**
 * Settings for the CDG IS SOAP web service, bound from {@code app.is-service.*}.
 */
@ConfigurationProperties("app.is-service")
public record IsServiceProperties(URI url, @DefaultValue("15s") Duration timeout) {
}
