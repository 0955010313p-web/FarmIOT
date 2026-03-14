<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Farm extends Model
{
    use HasFactory;

    protected $fillable = [
        'farm_category_id',
        'user_id', // owner
        'name',
        'description',
        'location', // Added to match the controller
        'status', // This was in IotDevicesController, but makes sense here too.
        'is_active',
    ];

    /**
     * Get the user that owns the farm.
     */
    public function owner()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * The users that belong to the farm as members.
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'user_farms');
    }

    /**
     * Get the category of the farm.
     */
    public function category()
    {
        return $this->belongsTo(FarmCategory::class, 'farm_category_id');
    }

    /**
     * Get the devices for the farm.
     */
    public function iotDevices()
    {
        return $this->hasMany(IotDevice::class);
    }

    /**
     * Get the auto rules for the farm.
     */
    public function autoRules()
    {
        return $this->hasMany(AutoRule::class);
    }
}
