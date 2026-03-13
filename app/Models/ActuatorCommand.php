<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ActuatorCommand extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'actuator_commands';
    public $timestamps = true;

    protected $fillable = [
        'iot_device_id',
        'command',
        'status',
    ];

    /**
     * Get the IoT device that the command belongs to.
     */
    public function iotDevice()
    {
        return $this->belongsTo(IotDevice::class);
    }
}
