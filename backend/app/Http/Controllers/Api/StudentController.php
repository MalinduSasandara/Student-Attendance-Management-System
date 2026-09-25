<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index()
    {
        try {
            $students = Student::latest()->get();
            return response()->json($students, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_code' => 'required|string|unique:students,student_code',
            'name'         => 'required|string|max:255',
            'email'        => 'required|email|unique:students,email',
            'phone'        => 'required|string',
            'qr_code'      => 'required|string|unique:students,qr_code',
            'status'       => 'nullable|string',
        ]);

        $student = Student::create($validated);
        return response()->json($student, 201);
    }

    public function show($id)
    {
        $student = Student::find($id);
        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }
        return response()->json($student, 200);
    }

    public function update(Request $request, $id)
    {
        $student = Student::find($id);
        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        $validated = $request->validate([
            'student_code' => 'sometimes|required|string|unique:students,student_code,'.$id,
            'name'         => 'sometimes|required|string|max:255',
            'email'        => 'sometimes|required|email|unique:students,email,'.$id,
            'phone'        => 'sometimes|required|string',
            'qr_code'      => 'sometimes|required|string|unique:students,qr_code,'.$id,
            'status'       => 'nullable|string',
        ]);

        $student->update($validated);
        return response()->json($student, 200);
    }

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