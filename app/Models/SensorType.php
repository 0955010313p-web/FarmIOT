<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SensorType extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'sensor_types';
    public $timestamps = true;

    protected $fillable = [
        'name',
        'unit',
        'description',
    ];

    /**
     * Get the iot devices for the sensor type.
     */
    public function iotDevices()
    {
        return $this->hasMany(IotDevice::class);
    }
}
