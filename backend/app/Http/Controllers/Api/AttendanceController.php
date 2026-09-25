<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Student;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class AttendanceController extends Controller
{
    public function scan(Request $request)
    {
        try {
            $request->validate([
                'qr_code' => 'required|string',
            ]);

            $qrCode = trim($request->qr_code);

            // Look up student by student_code or qr_code
            $student = Student::where('student_code', $qrCode)
                ->orWhere('qr_code', $qrCode)
                ->first();

            if (!$student) {
                return response()->json([
                    'status' => 'error',
                    'message' => "Student with code '{$qrCode}' not found in database."
                ], 404);
            }

            $today = Carbon::today()->toDateString();
            $currentTime = Carbon::now()->toTimeString();

            // Create record
            $attendance = new Attendance();
            $attendance->student_id = $student->id;
            $attendance->scanned_code = $qrCode;
            $attendance->date = $today;
            $attendance->time = $currentTime;
            $attendance->status = 'present';
            $attendance->save();

            return response()->json([
                'status' => 'success',
                'message' => "Attendance recorded for {$student->name}!",
                'data' => $attendance
            ], 200);

        } catch (\Exception $e) {
            Log::error('Scan Attendance Error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to log attendance: ' . $e->getMessage()
            ], 500);
        }
    }

    public function index()
    {
        return response()->json(Attendance::with('student')->latest()->get());
    }

    public function destroy($id)
    {
        $attendance = Attendance::find($id);
        if ($attendance) {
            $attendance->delete();
            return response()->json(['message' => 'Record deleted successfully']);
        }
        return response()->json(['message' => 'Record not found'], 404);
    }
}