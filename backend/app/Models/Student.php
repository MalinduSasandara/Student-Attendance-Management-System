<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_code',
        'name',
        'email',
        'phone',
        'qr_code',
        'status',
    ];

    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'student_id');
    }
}