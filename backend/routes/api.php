<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\AttendanceController;

// Public authentication route
Route::post('/login', [AuthController::class, 'login']);

// Protected API routes using Sanctum middleware
Route::middleware('auth:sanctum')->group(function () {
    // Logout route to revoke tokens
    Route::post('/logout', [AuthController::class, 'logout']);

    // Authenticated user check
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Dashboard Statistics
    Route::get('/dashboard/stats', [AttendanceController::class, 'stats']);

    // Student CRUD routes
    Route::apiResource('students', StudentController::class);

    // Attendance routes
    Route::get('/attendances', [AttendanceController::class, 'index']);
    Route::post('/attendances/scan', [AttendanceController::class, 'scan']);
    Route::get('/attendances/student/{id}', [AttendanceController::class, 'getByStudent']);
    Route::put('/attendances/{id}', [AttendanceController::class, 'update']);
    Route::delete('/attendances/{id}', [AttendanceController::class, 'destroy']);
});