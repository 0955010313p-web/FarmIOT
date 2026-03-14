<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SensorType extends Model
{
    use HasFactory;

    protected $table = 'sensor_types';
    public $timestamps = true;

    protected $fillable = [
        'name',
        'unit',
    ];

    public function iotDevices()
    {
        return $this->hasMany(IotDevice::class);
    }
}
