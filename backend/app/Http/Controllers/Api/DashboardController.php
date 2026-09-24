<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Attendance;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            'total_students'           => Student::count(),
            'total_attendance_records' => Attendance::count(),
            'today_attendance_count'   => Attendance::where('date', Carbon::today()->toDateString())->count(),
        ]);
    }
}