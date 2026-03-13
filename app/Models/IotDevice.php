<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class IotDevice extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'iot_devices';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'farm_id',
        'device_type', // Standardized from controller
        'ip_address',  // Standardized from controller
        'status',      // Standardized from controller
    ];

    /**
     * Get the farm that owns the device.
     */
    public function farm()
    {
        return $this->belongsTo(Farm::class);
    }

    /**
     * Get the sensor data for the device.
     */
    public function sensorData()
    {
        return $this->hasMany(SensorData::class);
    }

    /**
     * If this device is an actuator, it can have commands.
     */
    public function actuatorCommands()
    {
        return $this->hasMany(ActuatorCommand::class);
    }
}
