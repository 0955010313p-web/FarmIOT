<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActuatorCommand extends Model
{
    use HasFactory;

    protected $table = 'actuator_commands';

    protected $fillable = [
        'iot_device_id',
        'command',
        'status',
        'sent_at',
        'acknowledged_at',
    ];

    protected $casts = [
        'sent_at' => 'datetime',
        'acknowledged_at' => 'datetime',
    ];

    public function device()
    {
        return $this->belongsTo(IotDevice::class, 'iot_device_id');
    }
}
