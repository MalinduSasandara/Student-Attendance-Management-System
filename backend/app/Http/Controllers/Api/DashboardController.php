<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        try {
            $totalStudents = Student::count();
            $totalAttendance = Attendance::count();
            $todayAttendance = Attendance::whereDate('date', Carbon::today()->toDateString())->count();

            return response()->json([
                'total_students' => $totalStudents,
                'total_attendance_records' => $totalAttendance,
                'today_attendance_count' => $todayAttendance,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'total_students' => 0,
                'total_attendance_records' => 0,
                'today_attendance_count' => 0,
                'error' => $e->getMessage()
            ], 200);
        }
    }
}