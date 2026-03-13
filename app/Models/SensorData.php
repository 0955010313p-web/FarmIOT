<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SensorData extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'sensor_data';
    public $timestamps = true; // Ensures created_at and updated_at are managed automatically

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'iot_device_id',
        'sensor_type', // Standardized from controller
        'value',         // Standardized from controller
        'unit',          // Standardized from controller
    ];

    /**
     * Since we do not want to update sensor data, we can prevent the updated_at field from being modified after creation.
     */
    public function setUpdatedAt($value)
    {
        // Do nothing
        return null;
    }

    /**
     * Get the IoT device that recorded this data.
     */
    public function iotDevice()
    {
        return $this->belongsTo(IotDevice::class);
    }
}
