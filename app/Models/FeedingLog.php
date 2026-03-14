<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeedingLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'iot_device_id',
        'farm_id',
        'user_id',
        'status',
        'fed_at',
        'next_feeding_at',
        'notes',
    ];

    protected $casts = [
        'fed_at' => 'datetime',
        'next_feeding_at' => 'datetime',
    ];

    public function device()
    {
        return $this->belongsTo(IotDevice::class, 'iot_device_id');
    }

    public function farm()
    {
        return $this->belongsTo(Farm::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scopeForDevice($query, $deviceId)
    {
        return $query->where('iot_device_id', $deviceId);
    }

    public function scopeLatestFeeding($query)
    {
        return $query->orderBy('fed_at', 'desc');
    }

    public function getNextFeedingInHoursAttribute()
    {
        if (!$this->next_feeding_at) {
            return null;
        }
        
        $now = now();
        $diff = $this->next_feeding_at->diffInHours($now);
        
        return $diff;
    }
}
