<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class Admin  extends Authenticatable implements JWTSubject
{
    protected $fillable = [
        'pseudo',
        'email',
        'password',
    ];
    protected $table = 'admins';
    
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
