<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\Attendance;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    // Create attendance by scanning QR / Barcode
    public function scan(Request $request)
    {
        $request->validate([
            'qr_code' => 'required|string',
        ]);

        $student = Student::where('qr_code', $request->qr_code)
                    ->orWhere('student_code', $request->qr_code)
                    ->first();

        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        $attendance = Attendance::create([
            'student_id' => $student->id,
            'status'     => 'Present',
            'scanned_at' => now(),
        ]);

        return response()->json([
            'message' => 'Attendance recorded successfully',
            'data'    => $attendance->load('student')
        ], 201);
    }

    // View all attendance records
    public function index()
    {
        $records = Attendance::with('student')->latest()->get();
        return response()->json($records, 200);
    }

    // View attendance records by student ID
    public function byStudent($student_id)
    {
        $records = Attendance::with('student')
                    ->where('student_id', $student_id)
                    ->latest()
                    ->get();

        return response()->json($records, 200);
    }

    // Update attendance record (e.g., status, scanned_at)
    public function update(Request $request, $id)
    {
        $attendance = Attendance::find($id);
        if (!$attendance) {
            return response()->json(['message' => 'Record not found'], 404);
        }

        $validated = $request->validate([
            'status'     => 'required|string',
            'scanned_at' => 'nullable|date',
        ]);

        $attendance->update($validated);

        return response()->json([
            'message' => 'Attendance updated successfully',
            'data'    => $attendance->load('student')
        ], 200);
    }

    // Delete attendance record
    public function destroy($id)
    {
        $attendance = Attendance::find($id);
        if (!$attendance) {
            return response()->json(['message' => 'Record not found'], 404);
        }

        $attendance->delete();

        return response()->json(['message' => 'Attendance record deleted'], 200);
    }

    // Dashboard Statistics
    public function stats()
    {
        return response()->json([
            'total_students'           => Student::count(),
            'total_attendance_records' => Attendance::count(),
            'today_attendance_count'   => Attendance::whereDate('scanned_at', Carbon::today())->count(),
        ], 200);
    }
}