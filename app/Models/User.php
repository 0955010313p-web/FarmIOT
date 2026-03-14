<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'username',
        'firstname',
        'lastname',
        'email',
        'tel',
        'user_role_id',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token', // Good practice to hide this too
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime', // Standard practice
            'password' => 'hashed',
        ];
    }

    public function getNameAttribute(): string
    {
        $full = trim(($this->firstname ?? '') . ' ' . ($this->lastname ?? ''));
        if ($full !== '') {
            return $full;
        }
        return $this->username ?? $this->email ?? '';
    }

    /**
     * Get the user roles for the user.
     */
    public function roles(): HasMany
    {
        return $this->hasMany(UserRole::class);
    }

    /**
     * Get the farms owned by the user.
     */
    public function ownedFarms(): HasMany
    {
        return $this->hasMany(Farm::class, 'user_id');
    }

    /**
     * The farms that the user has access to as a member.
     */
    public function farms()
    {
        return $this->belongsToMany(Farm::class, 'user_farms');
    }

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }
}
