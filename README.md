SWC Learning Platform
A comprehensive educational platform for academic programs, courses, mock tests, and learning management built with NestJS.

🚀 Features
Academic Structure Management
Multi-board Support: WBBSE, CBSE, ICSE, WBCHSE
Hierarchical Organization: Levels → Programs → Classes → Streams → Semesters
Flexible Curriculum: Secondary (Class I-X) & Higher Secondary (Class XI-XII) with Arts/Science/Commerce streams
Graduation Programs: Degree universities with semester management
Learning Management
Course Catalog: Free & paid courses with thumbnails, descriptions, pricing
Content Delivery: Videos, PDFs, Mock Tests via BunnyCDN
Progress Tracking: Course enrollment, content completion
Mock Tests: Timed tests with scoring, review, and analytics
Assessment System
Mock Test Engine: Configurable duration, marks, question types
Attempt Tracking: Single/multiple attempts, score history
Detailed Review: Question-wise analysis with explanations
Caching: Redis-cached results for performance
Authentication & Security
JWT Authentication: Access tokens (1h) with HTTP-only cookies
Password Reset: OTP-based flow with email delivery
Rate Limiting: Per-endpoint throttling (login, password reset)
Input Validation: Global DTO validation with class-validator
File & Media Management
BunnyCDN Integration: Optimized content delivery
Image Upload: Profile images, course thumbnails
File Validation: Type/size restrictions
Communication
Transactional Emails: Nodemailer + BullMQ queue
Background Processing: Non-blocking email delivery
Retry Logic: Exponential backoff for failed emails
🛠 Tech Stack
Layer	Technology
Framework	NestJS 10+
Database	MySQL + TypeORM
Cache	Redis + Cache Manager
Queue	BullMQ + Redis
Auth	Passport-JWT, bcrypt
Email	Nodemailer (Gmail SMTP)
Storage	BunnyCDN
Validation	class-validator, class-transformer


📚 API Documentation
Base URL
http://localhost:3000/api/v1
Authentication
POST   /auth/login              # Login (sets HttpOnly cookies)
GET    /auth/profile            # Get current user profile
POST   /auth/logout             # Logout (clears cookies)
POST   /auth/forgot-password    # Request OTP
POST   /auth/verify-code        # Verify OTP
POST   /auth/reset-password     # Reset password
Academic Structure
GET    /academic-levels                    # List levels
GET    /academic-programs                  # List programs
GET    /academic-classes                   # List classes
GET    /academic-streams                   # List streams
GET    /academic-semesters                 # List semesters
Courses & Content
GET    /courses                            # Paginated course list
GET    /courses/:id                        # Course details
GET    /courses/:id/contents               # Course contents
GET    /course-contents/:id                # Content details
Mock Tests
GET    /mock-tests/:id                     # Test details
POST   /mock-test-attempts/submit          # Submit attempt
GET    /mock-test-attempts/my-results      # User's results
GET    /mock-test-attempts/review/:id      # Detailed review
Account
POST   /account/register                   # Register
GET    /account/profile                    # Get profile
PATCH  /account/profile                    # Update profile
PUT    /account/profile/image              # Upload profile image
🔐 Authentication Flow
1. POST /auth/login → Returns access_token in HttpOnly cookie
2. Subsequent requests → Cookie sent automatically
3. JWT validated via JwtAuthGuard
4. CurrentUser decorator extracts user from request
5. POST /auth/logout → Clears cookie, revokes token
