-- Disable foreign key checks for MySQL
SET FOREIGN_KEY_CHECKS = 0;

-- Clear existing data
TRUNCATE TABLE task_assignees;
TRUNCATE TABLE researcher_research_areas;
TRUNCATE TABLE project_categories;
TRUNCATE TABLE project_researchers;
TRUNCATE TABLE tasks;
TRUNCATE TABLE projects;
TRUNCATE TABLE users;
TRUNCATE TABLE researchers;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Insert Sample Researchers (NOT REAL DATA - FOR DEMONSTRATION ONLY)
INSERT INTO researchers (id, name, student_id, grade, admission_year, email, phone, status, join_date, photo_url, created_at, updated_at) VALUES
(1, 'Sample Researcher 1', '20201001', 'JUNIOR', 2020, 'researcher1@example.com', '010-0000-0001', 'ACTIVE', '2020-03-01', NULL, NOW(), NOW()),
(2, 'Sample Researcher 2', '20211001', 'JUNIOR', 2021, 'researcher2@example.com', '010-0000-0002', 'ACTIVE', '2021-03-01', NULL, NOW(), NOW()),
(3, 'Sample Researcher 3', '20211002', 'JUNIOR', 2021, 'researcher3@example.com', '010-0000-0003', 'ACTIVE', '2021-03-01', NULL, NOW(), NOW()),
(4, 'Sample Researcher 4', '20201002', 'JUNIOR', 2020, 'researcher4@example.com', '010-0000-0004', 'ACTIVE', '2020-03-01', NULL, NOW(), NOW()),
(5, 'Sample Researcher 5', '20241001', 'SOPHOMORE', 2024, 'researcher5@example.com', '010-0000-0005', 'ACTIVE', '2024-03-01', NULL, NOW(), NOW()),
(6, 'Sample Researcher 6', '20241002', 'SOPHOMORE', 2024, 'researcher6@example.com', '010-0000-0006', 'ACTIVE', '2024-03-01', NULL, NOW(), NOW()),
(7, 'Admin User', 'ADMIN001', 'GRADUATE', 2020, 'admin@example.com', '010-0000-0000', 'ACTIVE', '2020-03-01', NULL, NOW(), NOW());

-- Insert Research Areas
INSERT INTO researcher_research_areas (researcher_id, research_area) VALUES
(1, 'Medical_AI'),
(1, 'Computer_Vision'),
(1, 'LLM'),
(1, 'Backend'),
(2, 'Medical_AI'),
(2, 'Deep_Learning'),
(2, 'Computer_Vision'),
(2, 'LLM'),
(3, 'Medical_AI'),
(3, 'Backend'),
(4, 'Backend'),
(5, 'Backend'),
(6, 'Backend'),
(7, 'Medical_AI'),
(7, 'Deep_Learning'),
(7, 'Backend');

-- Insert Projects
INSERT INTO projects (id, name, description, status, priority, progress, start_date, end_date, budget, created_at, updated_at) VALUES
(1, 'Sample Research Project 1', 'Sample medical imaging research project description', 'IN_PROGRESS', 'HIGH', 40, '2024-09-01', '2025-08-31', 50000000, NOW(), NOW()),
(2, 'Sample Infrastructure Project', 'Sample lab environment improvement project description', 'PLANNING', 'MEDIUM', 10, '2025-10-08', '2025-12-31', 10000000, NOW(), NOW());

-- Insert Project Categories
INSERT INTO project_categories (project_id, category) VALUES
(1, 'Research'),
(1, 'Paper'),
(2, 'Infrastructure');

-- Insert Project Researchers
INSERT INTO project_researchers (project_id, researcher_id) VALUES
(1, 1),
(1, 2),
(2, 5),
(2, 6);

-- Insert Tasks
INSERT INTO tasks (id, name, description, status, priority, due_date, estimated_hours, project_id, created_at, updated_at) VALUES
(1, 'Sample Task 1', 'Sample task description for data collection', 'IN_PROGRESS', 'HIGH', '2024-12-31', 120, 1, NOW(), NOW()),
(2, 'Sample Task 2', 'Sample task description for algorithm development', 'TODO', 'HIGH', '2025-03-31', 200, 1, NOW(), NOW()),
(3, 'Sample Task 3', 'Sample task description for paper writing', 'TODO', 'MEDIUM', '2025-08-31', 80, 1, NOW(), NOW()),
(4, 'Sample Task 4', 'Sample task description for furniture selection', 'IN_PROGRESS', 'MEDIUM', '2025-11-30', 20, 2, NOW(), NOW()),
(5, 'Sample Task 5', 'Sample task description for budget planning', 'TODO', 'HIGH', '2025-11-15', 10, 2, NOW(), NOW()),
(6, 'Sample Task 6', 'Sample task description for layout design', 'TODO', 'LOW', '2025-12-15', 15, 2, NOW(), NOW());

-- Insert Task Assignees
INSERT INTO task_assignees (task_id, researcher_id) VALUES
(1, 1),
(1, 2),
(2, 1),
(3, 2),
(4, 5),
(4, 6),
(5, 5),
(6, 6);

-- Insert Sample Users (password is BCrypt hash of 'demo123' for demonstration)
-- IMPORTANT: Change all passwords in production!
-- Admin user
INSERT INTO users (id, username, password, role, researcher_id, enabled, created_at, updated_at) VALUES
(1, 'admin', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'ADMIN', 7, true, NOW(), NOW());

-- Sample researcher users
INSERT INTO users (id, username, password, role, researcher_id, enabled, created_at, updated_at) VALUES
(2, 'user1', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'RESEARCHER', 1, true, NOW(), NOW()),
(3, 'user2', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'RESEARCHER', 2, true, NOW(), NOW()),
(4, 'user3', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'RESEARCHER', 3, true, NOW(), NOW()),
(5, 'user4', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'RESEARCHER', 4, true, NOW(), NOW()),
(6, 'user5', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'RESEARCHER', 5, true, NOW(), NOW()),
(7, 'user6', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'RESEARCHER', 6, true, NOW(), NOW());
