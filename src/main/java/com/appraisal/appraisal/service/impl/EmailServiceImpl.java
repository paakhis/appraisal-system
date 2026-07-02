//package com.appraisal.appraisal.service.impl;
//
//import com.appraisal.appraisal.service.EmailService;
//import lombok.RequiredArgsConstructor;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.mail.SimpleMailMessage;
//import org.springframework.mail.javamail.JavaMailSender;
//import org.springframework.scheduling.annotation.Async;
//import org.springframework.stereotype.Service;
//
//@Service
//@RequiredArgsConstructor
//public class EmailServiceImpl implements EmailService {
//
//    private static final Logger log = LoggerFactory.getLogger(EmailServiceImpl.class);
//
//    private final JavaMailSender mailSender;
//
//    @Value("${app.notifications.email-enabled:false}")
//    private boolean emailEnabled;
//
//    @Value("${app.notifications.mail-from}")
//    private String mailFrom;
//
//    @Override
//    @Async
//    public void sendEmail(String to, String subject, String body) {
//        if (!emailEnabled) {
//            log.info("[email-disabled] Would have sent to={} subject='{}'", to, subject);
//            return;
//        }
//        if (to == null || to.isBlank()) {
//            log.warn("Skipping email send - recipient address is missing (subject='{}')", subject);
//            return;
//        }
//
//        try {
//            SimpleMailMessage message = new SimpleMailMessage();
//            message.setFrom(mailFrom);
//            message.setTo(to);
//            message.setSubject(subject);
//            message.setText(body);
//            mailSender.send(message);
//        } catch (Exception ex) {
//            // Never let a mail server outage break the calling business operation.
//            log.error("Failed to send email to={} subject='{}': {}", to, subject, ex.getMessage());
//        }
//    }
//}
