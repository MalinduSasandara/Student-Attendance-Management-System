<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Student;

class StudentController extends Controller
{
    public function index()
    {
        return response()->json(Student::latest()->get(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_code' => 'required|unique:students,student_code',
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:students,email',
        ]);

        $student = Student::create($validated);

        return response()->json([
            'message' => 'Student created successfully!',
            'student' => $student
        ], 201);
    }

    public function show($id)
    {
        $student = Student::findOrFail($id);
        return response()->json($student, 200);
    }

    public function update(Request $request, $id)
    {
        $student = Student::findOrFail($id);

        $validated = $request->validate([
            'student_code' => 'required|unique:students,student_code,' . $id,
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:students,email,' . $id,
        ]);

        $student->update($validated);

        return response()->json([
            'message' => 'Student updated successfully!',
            'student' => $student
        ], 200);
    }

    public function destroy($id)
    {
        $student = Student::findOrFail($id);
        $student->delete();

        return response()->json([
            'message' => 'Student deleted successfully!'
        ], 200);
    }
}