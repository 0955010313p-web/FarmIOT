<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AutoRule extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'auto_rules';
    public $timestamps = true;

    protected $fillable = [
        'farm_id',
        'name',
        'sensor_type_id',
        'operator',
        'threshold',
        'actuator_id',
    ];

    /**
     * Get the farm that the rule belongs to.
     */
    public function farm()
    {
        return $this->belongsTo(Farm::class);
    }

    /**
     * Get the sensor type for the rule.
     */
    public function sensorType()
    {
        return $this->belongsTo(SensorType::class, 'sensor_type_id');
    }

    /**
     * Get the actuator for the rule.
     */
    public function actuator()
    {
        return $this->belongsTo(IotDevice::class, 'actuator_id');
    }

    /**
     * Get the logs for the auto rule.
     */
    public function logs()
    {
        return $this->hasMany(AutoRuleLog::class);
    }
}
