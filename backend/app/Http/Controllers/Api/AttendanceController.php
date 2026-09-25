<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Student;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    public function index()
    {
        try {
            $attendances = Attendance::with('student')->latest()->get();
            return response()->json($attendances, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function scanQrCode(Request $request)
    {
        $request->validate([
            'qr_code' => 'required|string',
        ]);

        $student = Student::where('qr_code', $request->qr_code)
            ->orWhere('student_code', $request->qr_code)
            ->first();

        if (!$student) {
            return response()->json(['message' => 'Student not found with this code.'], 404);
        }

        $today = Carbon::today()->toDateString();
        $now = Carbon::now()->toTimeString();

        // Check if student already marked attendance today
        $existing = Attendance::where('student_id', $student->id)
            ->where('date', $today)
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'Attendance already recorded for today.',
                'data' => $existing->load('student')
            ], 200);
        }

        $attendance = Attendance::create([
            'student_id'   => $student->id,
            'scanned_code' => $request->qr_code,
            'date'         => $today,
            'time'         => $now,
            'status'       => 'present',
        ]);

        return response()->json([
            'message' => 'Attendance marked successfully!',
            'data'    => $attendance->load('student')
        ], 201);
    }

    public function destroy($id)
    {
        $attendance = Attendance::find($id);
        if (!$attendance) {
            return response()->json(['message' => 'Record not found'], 404);
        }

        $attendance->delete();
        return response()->json(['message' => 'Attendance record deleted'], 200);
    }
}