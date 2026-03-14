<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IotDevice extends Model
{
    use HasFactory;

    protected $table = 'iot_devices';

    protected $fillable = [
        'name',
        'description',
        'farm_id',
        'type',
        'sensor_type_id',
        'is_active',
    ];

    public function farm()
    {
        return $this->belongsTo(Farm::class);
    }

    public function sensorData()
    {
        return $this->hasMany(SensorData::class);
    }

    public function actuatorCommands()
    {
        return $this->hasMany(ActuatorCommand::class);
    }
}
