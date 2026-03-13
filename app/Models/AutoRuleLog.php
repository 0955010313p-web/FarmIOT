<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AutoRuleLog extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'auto_rule_logs';
    public $timestamps = true;

    protected $fillable = [
        'auto_rule_id',
        'action',
    ];

    /**
     * Get the auto rule that the log belongs to.
     */
    public function autoRule()
    {
        return $this->belongsTo(AutoRule::class);
    }
}
