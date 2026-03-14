<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserFarm extends Model
{
    use HasFactory;

    protected $table = 'user_farms';

    protected $fillable = [
        'user_id',
        'farm_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function farm()
    {
        return $this->belongsTo(Farm::class);
    }
}
