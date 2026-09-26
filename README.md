# SWC Learning Platform

A comprehensive educational platform for academic programs, courses, learning content, mock tests, and competitive exams, built with **NestJS and TypeScript**.

---

## 🚀 Features

### 🎓 Academic Management

- Multi-board support: WBBSE, CBSE, ICSE, WBCHSE
- Academic hierarchy:
  - Academic Levels
  - Programs
  - Classes
  - Streams
  - Semesters
- Secondary and Higher Secondary education
- Arts, Science, and Commerce streams
- Graduation degree and university management
- Graduation semester management

### 📚 Learning Management

- Free and paid courses
- Course thumbnails and descriptions
- Video lectures
- Study materials / PDFs
- SWC Radio
- Mock tests
- Course content type filtering
- Course and content caching

### 📝 Mock Tests

- Mock test creation
- Configurable duration and marks
- Multiple-choice questions
- Attempt tracking
- Score history
- Detailed result review
- Question-wise analysis

### 🔐 Authentication & Security

- JWT authentication
- HTTP-only cookie authentication
- Role-based authorization
- Password reset with OTP
- Email-based verification
- API rate limiting
- DTO validation
- Protected admin APIs

### 📁 File & Media Management

- BunnyCDN integration
- Video uploads
- PDF uploads
- Audio uploads
- Profile image uploads
- Course thumbnails
- File type and size validation

### 📧 Communication

- Nodemailer email service
- Gmail SMTP
- BullMQ background email processing
- Redis-based queue
- Retry support for failed jobs

### ⚡ Performance

- Redis caching
- Cache invalidation
- Paginated APIs
- Keyword-based searching
- BullMQ background processing

---

## 🛠 Tech Stack

| Category | Technology |
|---|---|
| Framework | NestJS |
| Language | TypeScript |
| Database | MySQL |
| ORM | TypeORM |
| Authentication | Passport JWT |
| Password Hashing | bcrypt |
| Cache | Redis + Cache Manager |
| Queue | BullMQ + Redis |
| Email | Nodemailer |
| Storage | BunnyCDN |
| Validation | class-validator |
| File Upload | Multer |

---

## 📂 Main Modules

Authentication
Account
Academic Level
Academic Program
Academic Class
Academic Stream
Academic Semester
Graduation Degree
University
Degree University
Graduation Semester
Subject
Course
Course Content
Mock Test
Mock Test Question
Mock Test Attempt
Competitive Category
Competitive Exam
Competitive Subject
Email Service


🔗 API
Base URL
http://localhost:3000/api/v1


Authentication
POST /auth/login
GET  /auth/profile
POST /auth/logout
POST /auth/forgot-password
POST /auth/verify-code
POST /auth/reset-password

Academic Structure
GET /academic-levels
GET /academic-programs
GET /academic-classes
GET /academic-streams
GET /academic-semesters

Courses & Content
GET /course
GET /course/:id
GET /course-content/course/:courseId
GET /course-content/course/:courseId?type=VIDEO

Mock Tests
GET  /mock-tests/:id
POST /mock-test-attempts/submit
GET  /mock-test-attempts/my-results
GET  /mock-test-attempts/review/:id

Account
POST  /account/register
GET   /account/profile
PATCH /account/profile
PUT   /account/profile/image

🔐 Authentication Flow
User logs in using POST /auth/login
Server validates the credentials
JWT is generated
JWT is stored in an HTTP-only cookie
Protected requests are authenticated using JwtAuthGuard
RolesGuard checks user permissions where required
POST /auth/logout clears the authentication cookie


🗄️ Database

The project uses:

MySQL
TypeORM

Create the database before starting the application:

CREATE DATABASE swc_learning;

⚡ Redis

Redis is used for:

API caching
Cache invalidation
BullMQ background jobs

Make sure Redis is running before starting the application.

📌 Project Status

Completed Backend Project

The backend includes authentication, academic management, course management, learning content, mock tests, competitive exams, caching, email services, file management, and API security.

👨‍💻 Author

Arijit Sau

Backend Developer

**Technologies:** NestJS • TypeScript • MySQL • TypeORM • Redis • BullMQ • JWT • Nodemailer • HTTP-only Cookies • BunnyCDN
