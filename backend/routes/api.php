<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\AttendanceController;

// Auth
Route::post('/login', [AuthController::class, 'login']);

// Dashboard Stats
Route::get('/dashboard/stats', [AttendanceController::class, 'stats']);

// Student CRUD
Route::get('/students', [StudentController::class, 'index']);          // View all
Route::get('/students/{id}', [StudentController::class, 'show']);       // View single
Route::post('/students', [StudentController::class, 'store']);         // Create
Route::put('/students/{id}', [StudentController::class, 'update']);     // Update
Route::delete('/students/{id}', [StudentController::class, 'destroy']); // Delete

// Attendance Operations
Route::post('/attendances/scan', [AttendanceController::class, 'scan']);           // Create by scan
Route::get('/attendances', [AttendanceController::class, 'index']);                // View all
Route::get('/attendances/student/{student_id}', [AttendanceController::class, 'byStudent']); // View by student
Route::put('/attendances/{id}', [AttendanceController::class, 'update']);          // Update record
Route::delete('/attendances/{id}', [AttendanceController::class, 'destroy']);      // Delete record