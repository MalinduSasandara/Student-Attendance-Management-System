<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;

class StudentController extends Controller
{
    // View all students
    public function index()
    {
        return response()->json(Student::latest()->get(), 200);
    }

    // View single student
    public function show($id)
    {
        $student = Student::find($id);
        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }
        return response()->json($student, 200);
    }

    // Create student
    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_code' => 'required|string|unique:students,student_code',
            'name'         => 'required|string',
            'email'        => 'required|email|unique:students,email',
            'phone'        => 'nullable|string',
        ]);

        $validated['qr_code'] = $validated['student_code'];
        $student = Student::create($validated);

        return response()->json($student, 201);
    }

    // Update student
    public function update(Request $request, $id)
    {
        $student = Student::find($id);
        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        $validated = $request->validate([
            'student_code' => 'required|string|unique:students,student_code,' . $id,
            'name'         => 'required|string',
            'email'        => 'required|email|unique:students,email,' . $id,
            'phone'        => 'nullable|string',
        ]);

        $validated['qr_code'] = $validated['student_code'];
        $student->update($validated);

        return response()->json($student, 200);
    }

    // Delete student
    public function destroy($id)
    {
        $student = Student::find($id);
        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        $student->delete();
        return response()->json(['message' => 'Student deleted successfully'], 200);
    }
}