-- V6: Add new columns to orders table for enhanced order management
-- liquibase formatted sql
-- changeset marketplace:6

ALTER TABLE orders
  ADD COLUMN payment_method  VARCHAR(20)  DEFAULT NULL,
  ADD COLUMN cancel_reason   TEXT         DEFAULT NULL,
  ADD COLUMN return_status   VARCHAR(100) DEFAULT NULL,
  ADD COLUMN customer_phone  VARCHAR(20)  DEFAULT NULL,
  ADD COLUMN customer_email  VARCHAR(150) DEFAULT NULL;
