<?php

namespace App\Http\Controllers;

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

    public function stats()
    {
        $totalStudents = Student::count();
        $totalAttendances = Attendance::count();
        $todayScans = Attendance::whereDate('scanned_at', Carbon::today())->count();

        return response()->json([
            'total_students'    => $totalStudents,
            'total_attendances' => $totalAttendances,
            'today_scans'       => $todayScans,
        ], 200);
    }

    public function scan(Request $request)
    {
        $request->validate([
            'student_code' => 'required|string|exists:students,student_code',
        ]);

        $student = Student::where('student_code', $request->student_code)->first();

        $attendance = Attendance::create([
            'student_id' => $student->id,
            'status'     => 'Present',
            'scanned_at' => Carbon::now(),
        ]);

        return response()->json([
            'message'    => 'Attendance recorded successfully',
            'attendance' => $attendance->load('student')
        ], 201);
    }

    public function getByStudent($id)
    {
        // Return 404 if the student doesn't exist
        $student = Student::find($id);
        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        $attendances = Attendance::where('student_id', $id)->with('student')->latest()->get();
        return response()->json($attendances, 200);
    }

    public function update(Request $request, $id)
    {
        $attendance = Attendance::find($id);
        if (!$attendance) {
            return response()->json(['message' => 'Attendance record not found'], 404);
        }

        // Constrained validation ensuring status is strictly Present or Absent
        $validated = $request->validate([
            'status'     => 'required|in:Present,Absent',
            'scanned_at' => 'sometimes|date', // Optional: allow editing timestamp if supplied
        ]);

        $attendance->update($validated);

        return response()->json($attendance->load('student'), 200);
    }

    public function destroy($id)
    {
        $attendance = Attendance::find($id);
        if (!$attendance) {
            return response()->json(['message' => 'Attendance record not found'], 404);
        }

        $attendance->delete();

        return response()->json(['message' => 'Attendance record deleted successfully'], 200);
    }
}