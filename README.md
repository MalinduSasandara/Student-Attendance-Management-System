# Student Attendance Management System

A full-stack Student Attendance Management system built with **Laravel 11** and **React**. The application features complete student CRUD operations, QR-based attendance logging, and real-time dashboard analytics.

---

## Features

- **Admin Authentication**: Secure login using Laravel Sanctum tokens.
- **Dashboard Analytics**: Live counters for total students, total attendance logs, and today's scans.
- **Student Management (CRUD)**:
  - Create new student records.
  - View all students and individual student details.
  - Update student information.
  - Delete students.
- **Attendance Management (CRUD)**:
  - Record attendance via QR / Barcode scanning or manual code submission.
  - View all attendance logs.
  - Filter logs by specific student.
  - Toggle attendance status (Present / Absent) and delete logs.

---

## Tech Stack

- **Backend**: Laravel 11, PHP, MySQL, Sanctum
- **Frontend**: React, Axios, React Router
- **Database**: MySQL

---

## Project Structure

```text
Student Attendance Management/
├── backend/                  # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/ # AuthController, StudentController, AttendanceController
│   │   └── Models/          # User, Student, Attendance
│   ├── database/
│   │   └── migrations/      # Users, Students, Attendances tables
│   └── routes/
│       └── api.php          # API Endpoints
└── frontend/                 # React UI
    └── src/
        ├── components/      # Navigation, ProtectedRoute
        └── pages/           # Login, Dashboard, Students, ScanQR, AttendanceList
```

---

## Complete Setup Instructions

### Quick Start Commands

```sql
-- 1. Create MySQL Database
CREATE DATABASE attendance_db;
```

```bash
# 2. Run Backend (Laravel API)
cd backend
composer install
cp .env.example .env
php artisan migrate:fresh
php artisan tinker --execute="\App\Models\User::create(['name' => 'Admin', 'email' => 'admin@gmail.com', 'password' => bcrypt('password')]);"
php artisan route:clear
php artisan config:clear
php artisan serve
```

```bash
# 3. Run Frontend (React UI)
cd frontend
npm install
npm start
```

---

## API Routes Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/login` | Admin Authentication |
| `GET` | `/api/dashboard/stats` | Dashboard Summary Statistics |
| `GET` | `/api/students` | Get All Students |
| `GET` | `/api/students/{id}` | Get Single Student |
| `POST` | `/api/students` | Create Student |
| `PUT` | `/api/students/{id}` | Update Student |
| `DELETE` | `/api/students/{id}` | Delete Student |
| `POST` | `/api/attendances/scan` | Record Attendance (QR Scan) |
| `GET` | `/api/attendances` | Get All Attendance Records |
| `GET` | `/api/attendances/student/{id}` | Get Records by Student |
| `PUT` | `/api/attendances/{id}` | Update Attendance Status |
| `DELETE` | `/api/attendances/{id}` | Delete Attendance Record |

---

## Default Admin Credentials

- **Email**: `admin@gmail.com`
- **Password**: `password`
