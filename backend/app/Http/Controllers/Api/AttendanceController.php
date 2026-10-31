<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Attendance;
use App\Models\Student;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    public function index()
    {
        $attendances = Attendance::with('student')->latest()->get();
        return response()->json($attendances, 200);
    }

    public function scan(Request $request)
    {
        $request->validate([
            'student_code' => 'required|exists:students,student_code',
        ]);

        $student = Student::where('student_code', $request->student_code)->first();
        $today = Carbon::today();

        // Enforce duplicate prevention: One scan per student per day
        $existingAttendance = Attendance::where('student_id', $student->id)
            ->whereDate('scanned_at', $today)
            ->first();

        if ($existingAttendance) {
            return response()->json([
                'message' => 'Attendance already recorded for today.'
            ], 422);
        }

        $attendance = Attendance::create([
            'student_id' => $student->id,
            'status' => 'Present',
            'scanned_at' => now(),
        ]);

        return response()->json([
            'message' => 'Attendance recorded successfully!',
            'attendance' => $attendance
        ], 201);
    }

    public function stats()
    {
        $totalStudents = Student::count();
        $totalAttendances = Attendance::count();
        $todayScans = Attendance::whereDate('scanned_at', Carbon::today())->count();

        return response()->json([
            'total_students' => $totalStudents,
            'total_attendances' => $totalAttendances,
            'today_scans' => $todayScans,
        ], 200);
    }
}