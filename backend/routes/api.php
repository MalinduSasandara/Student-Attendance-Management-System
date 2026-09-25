<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\DashboardController;

// Public login route
Route::post('/login', [AuthController::class, 'login']);

// Protected routes (require valid login session token)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Dashboard Stats
    Route::get('/dashboard/stats', [DashboardController::class, 'index']);
    
    // Student CRUD
    Route::apiResource('students', StudentController::class);
    
    // Attendance Operations
    Route::get('/attendances', [AttendanceController::class, 'index']);
    Route::post('/attendances/scan', [AttendanceController::class, 'scanQrCode']);
    Route::put('/attendances/{id}', [AttendanceController::class, 'update']);
    Route::delete('/attendances/{id}', [AttendanceController::class, 'destroy']);
});