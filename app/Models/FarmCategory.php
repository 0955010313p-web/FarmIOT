<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FarmCategory extends Model
{
    use HasFactory;

    protected $table = 'farm_categories';
    public $timestamps = true;

    protected $fillable = [
        'name',
        'description',
    ];

    public function farms()
    {
        return $this->hasMany(Farm::class);
    }
}
