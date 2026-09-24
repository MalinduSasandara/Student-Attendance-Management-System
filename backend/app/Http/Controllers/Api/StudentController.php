<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    // Fetch all students
    public function index()
    {
        return response()->json(Student::all(), 200);
    }

    // Create a new student
    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_code' => 'required|unique:students',
            'name'         => 'required|string|max:255',
            'email'        => 'required|email|unique:students',
            'phone'        => 'required|string',
            'qr_code'      => 'required|unique:students',
            'status'       => 'in:active,inactive',
        ]);

        $student = Student::create($validated);
        return response()->json(['message' => 'Student created successfully', 'data' => $student], 201);
    }

    // View single student details
    public function show($id)
    {
        $student = Student::findOrFail($id);
        return response()->json($student, 200);
    }

    // Update existing student
    public function update(Request $request, $id)
    {
        $student = Student::findOrFail($id);

        $validated = $request->validate([
            'student_code' => 'required|unique:students,student_code,' . $id,
            'name'         => 'required|string|max:255',
            'email'        => 'required|email|unique:students,email,' . $id,
            'phone'        => 'required|string',
            'qr_code'      => 'required|unique:students,qr_code,' . $id,
            'status'       => 'in:active,inactive',
        ]);

        $student->update($validated);
        return response()->json(['message' => 'Student updated successfully', 'data' => $student], 200);
    }

    // Delete a student
    public function destroy($id)
    {
        $student = Student::findOrFail($id);
        $student->delete();
        return response()->json(['message' => 'Student deleted successfully'], 200);
    }
}