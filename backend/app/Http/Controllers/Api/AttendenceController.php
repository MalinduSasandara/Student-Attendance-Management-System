<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Student;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    // Get all attendance records with student details
    public function index()
    {
        $records = Attendance::with('student')
            ->orderBy('date', 'desc')
            ->orderBy('time', 'desc')
            ->get();

        return response()->json($records, 200);
    }

    // Process scanned QR code
    public function scanQrCode(Request $request)
    {
        $request->validate(['qr_code' => 'required|string']);

        $student = Student::where('qr_code', $request->qr_code)->first();

        if (!$student) {
            return response()->json(['message' => 'Invalid QR / Barcode value.'], 404);
        }

        if ($student->status !== 'active') {
            return response()->json(['message' => 'Student status is inactive.'], 400);
        }

        $today = Carbon::today()->toDateString();

        // Check if student already marked attendance today
        $alreadyMarked = Attendance::where('student_id', $student->id)
            ->where('date', $today)
            ->exists();

        if ($alreadyMarked) {
            return response()->json(['message' => 'Attendance already marked for today.'], 409);
        }

        $attendance = Attendance::create([
            'student_id'   => $student->id,
            'date'         => $today,
            'time'         => Carbon::now()->toTimeString(),
            'status'       => 'present',
            'scanned_code' => $request->qr_code,
        ]);

        return response()->json([
            'message' => 'Attendance marked successfully!',
            'data'    => $attendance->load('student')
        ], 201);
    }

    // Update attendance status
    public function update(Request $request, $id)
    {
        $request->validate(['status' => 'required|in:present,late,absent']);
        $attendance = Attendance::findOrFail($id);
        $attendance->update(['status' => $request->status]);

        return response()->json(['message' => 'Attendance record updated.']);
    }

    // Delete attendance log
    public function destroy($id)
    {
        $attendance = Attendance::findOrFail($id);
        $attendance->delete();

        return response()->json(['message' => 'Attendance record deleted.']);
    }
}