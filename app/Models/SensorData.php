<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SensorData extends Model
{
    use HasFactory;

    protected $table = 'sensor_data';
    public $timestamps = true;

    protected $fillable = [
        'iot_device_id',
        'value',
        'recorded_at',
    ];

    public function setUpdatedAt($value)
    {
        return null;
    }

    public function iotDevice()
    {
        return $this->belongsTo(IotDevice::class);
    }
}
