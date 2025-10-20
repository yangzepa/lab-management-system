# Lab Management System - Development Instructions

## Project Overview
Develop a comprehensive laboratory management system using Spring Boot. This system will replace Notion for managing research lab operations, including researchers, projects, and tasks.

## Tech Stack
- Backend: Spring Boot 3.x
- Database: MySQL or PostgreSQL
- ORM: Spring Data JPA
- Security: Spring Security with JWT authentication
- Build Tool: Gradle
- Utilities: Lombok, MapStruct

## Core Requirements

### 1. Entity Structure

#### Researcher Entity
- id (Long, Primary Key)
- name (String, required)
- studentId (String, unique, required)
- grade (Enum: FRESHMAN, SOPHOMORE, JUNIOR, SENIOR, GRADUATE)
- admissionYear (Integer)
- email (String, unique, required)
- phone (String, nullable)
- status (Enum: ACTIVE, ON_LEAVE, GRADUATED, INTERNSHIP)
- joinDate (LocalDate, required)
- researchAreas (List of String): Medical_AI, Deep_Learning, CT_Physics, Computer_Vision, LLM, Backend, Data_Analysis
- photoUrl (String, nullable)
- ManyToMany relationship with Project
- ManyToMany relationship with Task

#### Project Entity
- id (Long, Primary Key)
- name (String, required)
- description (Text, nullable)
- status (Enum: PLANNING, IN_PROGRESS, COMPLETED, ON_HOLD, CANCELLED)
- priority (Enum: HIGH, MEDIUM, LOW)
- progress (Integer, 0-100)
- startDate (LocalDate, required)
- endDate (LocalDate, nullable)
- budget (Long, nullable)
- categories (List of String): Research, Paper, Conference, Infrastructure, Data_Collection, Collaboration
- ManyToMany relationship with Researcher
- OneToMany relationship with Task

#### Task Entity
- id (Long, Primary Key)
- name (String, required)
- description (Text, nullable)
- status (Enum: TODO, IN_PROGRESS, DONE, BLOCKED)
- priority (Enum: HIGH, MEDIUM, LOW)
- dueDate (LocalDate, nullable)
- estimatedHours (Integer, nullable)
- ManyToOne relationship with Project (required)
- ManyToMany relationship with Researcher (assignees)

### 2. API Endpoints

#### Public APIs (No Authentication Required)
- GET /api/public/lab/info - Lab information
- GET /api/public/researchers - List all active researchers (without sensitive data)
- GET /api/public/projects - List all non-confidential projects
- GET /api/public/research-areas - Research areas

#### Admin APIs (Authentication Required)
Researchers:
- GET /api/admin/researchers - List all researchers
- GET /api/admin/researchers/{id} - Get researcher details
- POST /api/admin/researchers - Create new researcher
- PUT /api/admin/researchers/{id} - Update researcher
- DELETE /api/admin/researchers/{id} - Delete researcher

Projects:
- GET /api/admin/projects - List all projects
- GET /api/admin/projects/{id} - Get project details
- POST /api/admin/projects - Create new project
- PUT /api/admin/projects/{id} - Update project
- DELETE /api/admin/projects/{id} - Delete project

Tasks:
- GET /api/admin/tasks - List all tasks
- GET /api/admin/tasks/{id} - Get task details
- POST /api/admin/tasks - Create new task
- PUT /api/admin/tasks/{id} - Update task
- DELETE /api/admin/tasks/{id} - Delete task

Dashboard:
- GET /api/admin/dashboard/stats - Dashboard statistics
- GET /api/admin/dashboard/projects-by-status
- GET /api/admin/dashboard/tasks-by-status
- GET /api/admin/dashboard/researcher-workload

#### User APIs (Researcher Login)
- GET /api/user/my-profile - Get my profile
- PUT /api/user/my-profile - Update my profile
- GET /api/user/my-tasks - Get my assigned tasks
- GET /api/user/my-projects - Get my projects

### 3. Database Schema
Create proper indexes on:
- Researcher: studentId, email, status
- Project: status, startDate, endDate
- Task: status, dueDate, project_id

### 4. Security Requirements
- JWT-based authentication
- Two roles: ADMIN, RESEARCHER
- Password encryption using BCrypt
- CORS configuration for frontend
- Secure endpoints appropriately

### 5. Initial Data
Seed the database with:

Researchers (6 people):
1. 박평진 - 20204103, 3학년, areas: Medical_AI, Computer_Vision, LLM, Backend
2. 최태성 - 20214104, 3학년, areas: Medical_AI, Deep_Learning, Computer_Vision, LLM
3. 황주연 - 20214072, 3학년, areas: Medical_AI, Backend
4. 김병환 - 20204080, 3학년, areas: Backend
5. 강민선 - 20244029, 2학년, areas: Backend
6. 김규린 - 20244010, 2학년, areas: Backend

Projects (2 initial):
1. CT Dose 계산 프로젝트 - Status: IN_PROGRESS, Priority: HIGH, Progress: 40%
2. 연구실을 연구실답게 - Status: PLANNING, Priority: MEDIUM, Progress: 10%

Tasks (sample for each project):
- 3 tasks for CT Dose project
- 3 tasks for Lab Environment project

## Implementation Steps

### Phase 1: Project Setup (Priority: HIGHEST)
1. Initialize Spring Boot project with Gradle
2. Set up project structure following best practices
3. Configure application.yml for database connection
4. Add all necessary dependencies (Spring Web, JPA, Security, MySQL Driver, Lombok, etc.)
5. Create base package structure: entity, repository, service, controller, dto, config, security

### Phase 2: Database and Entities (Priority: HIGHEST)
1. Create all entity classes with proper annotations
2. Set up relationships (ManyToMany, OneToMany)
3. Create repository interfaces extending JpaRepository
4. Test database connection and entity creation

### Phase 3: Core Business Logic (Priority: HIGH)
1. Implement service layer for each entity
2. Create DTOs for request/response
3. Implement MapStruct mappers
4. Add validation annotations
5. Create custom exceptions and global exception handler

### Phase 4: Security (Priority: HIGH)
1. Implement JWT token generation and validation
2. Create UserDetails and UserDetailsService implementation
3. Configure Spring Security
4. Create authentication endpoints (/api/auth/login, /api/auth/register)
5. Add role-based access control

### Phase 5: REST APIs (Priority: HIGH)
1. Implement all controller endpoints
2. Add proper HTTP status codes
3. Implement pagination for list endpoints
4. Add filtering and sorting capabilities
5. Create comprehensive API documentation (Swagger/OpenAPI)

### Phase 6: Dashboard Logic (Priority: MEDIUM)
1. Create dashboard statistics calculation service
2. Implement aggregation queries for:
   - Project status distribution
   - Task completion rates
   - Researcher workload analysis
   - Upcoming deadlines
3. Create dashboard controller with summary endpoints

### Phase 7: Testing (Priority: MEDIUM)
1. Unit tests for service layer
2. Integration tests for repositories
3. API endpoint tests
4. Security configuration tests

### Phase 8: Deployment Preparation (Priority: LOW)
1. Create Dockerfile
2. Add docker-compose.yml for local development
3. Configure environment-specific properties
4. Add health check endpoint
5. Set up logging configuration

## Important Notes

### Code Quality Requirements
- Follow Spring Boot best practices
- Use proper exception handling
- Implement validation on all input
- Write clean, readable code with proper comments
- Use meaningful variable and method names
- Follow RESTful API conventions

### Data Validation Rules
- Email must be valid format and unique
- Student ID must be unique
- Phone number format validation
- Date validations (startDate before endDate)
- Progress must be 0-100
- Enum values must match defined constants

### Performance Considerations
- Use lazy loading where appropriate
- Implement pagination for large datasets
- Create database indexes on frequently queried fields
- Use DTOs to avoid exposing entire entities
- Implement caching for static data if needed

## Sample Data Details

### Admin User
Username: admin
Email: yangzepa@sch.ac.kr
Password: admin123! (to be encrypted)
Role: ADMIN

### Initial Projects Details

Project 1: CT Dose 계산 프로젝트
- Status: IN_PROGRESS
- Priority: HIGH
- Progress: 40%
- Start Date: 2024-09-01
- End Date: 2025-08-31
- Category: Research
- Assigned: 박평진, 최태성
- Description: CT 영상 촬영 시 환자가 받는 방사선량(Dose)을 정확하게 계산하고 최적화하는 연구

Project 2: 연구실을 연구실답게
- Status: PLANNING
- Priority: MEDIUM
- Progress: 10%
- Start Date: 2025-10-08
- End Date: 2025-12-31
- Category: Infrastructure
- Assigned: 강민선, 김규린
- Description: 연구실 환경 개선 프로젝트. 책상, 의자, 수납공간 등 연구원들이 쾌적하게 연구할 수 있는 공간 조성

## Expected Deliverables
1. Fully functional Spring Boot application
2. Complete REST API with all specified endpoints
3. Database schema with sample data
4. API documentation (Swagger UI)
5. README.md with setup instructions
6. Docker configuration for easy deployment

## Additional Features (Optional, if time permits)
- File upload functionality for researcher photos
- Email notification system for task deadlines
- Export data to Excel/PDF
- Activity log/audit trail
- Search functionality across all entities
- Calendar view for project timelines
- Kanban board view for tasks

## Success Criteria
- All CRUD operations work correctly
- Authentication and authorization work properly
- API endpoints return correct data with proper status codes
- Sample data is loaded successfully
- Application can be run with Docker
- Code is well-structured and follows best practices
- No major security vulnerabilities

## Questions to Clarify (if needed)
- Preferred database: MySQL or PostgreSQL?
- Frontend needed or API-only?
- Deployment target: Local, AWS, or other cloud platform?
- Any specific UI framework preference if frontend is needed?

---

Start with Phase 1 and proceed sequentially. Focus on getting a working MVP before adding advanced features.