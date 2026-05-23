package com.marketplace.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Async
    public void sendOrderConfirmation(String to, Long orderId) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(to);
            msg.setSubject("Order #" + orderId + " Confirmed — Marketplace");
            msg.setText("Thank you for your order!\n\nOrder ID: " + orderId
                    + "\n\nYour order has been placed successfully and will be processed shortly.\n\nMarketplace Team");
            mailSender.send(msg);
            log.info("Sent order confirmation to {}", to);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", to, e.getMessage());
        }
    }

    @Async
    public void sendStatusUpdate(String to, Long orderId, String status) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(to);
            msg.setSubject("Order #" + orderId + " Status Update — Marketplace");
            msg.setText("Your order #" + orderId + " status has been updated to: " + status
                    + "\n\nMarketplace Team");
            mailSender.send(msg);
        } catch (Exception e) {
            log.error("Failed to send status email to {}: {}", to, e.getMessage());
        }
    }
}
