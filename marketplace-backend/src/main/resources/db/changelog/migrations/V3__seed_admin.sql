-- V3: Seed Admin Account
-- liquibase formatted sql
-- changeset marketplace:3
-- Password: Admin@123 (BCrypt encoded)

INSERT INTO users (name, email, password_hash, role, enabled, email_verified)
VALUES ('System Admin', 'admin@marketplace.com',
        '$2a$12$LDfyUvuJ8mYe5j.JFP6yNu2sXjKBKLBk8sHOuSfgIf2YiY7bJPFMm',
        'ADMIN', TRUE, TRUE);
