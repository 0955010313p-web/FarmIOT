<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FarmCategory extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'farm_categories';
    public $timestamps = true;

    protected $fillable = [
        'name',
        'description',
    ];

    /**
     * Get the farms for the category.
     */
    public function farms()
    {
        return $this->hasMany(Farm::class);
    }
}
