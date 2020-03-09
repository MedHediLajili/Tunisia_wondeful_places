<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class Adherent extends Authenticatable implements JWTSubject
{
    protected $fillable = [
        'firstname',
        'lastname',
        'email',
        'password',
        'description',
        'photo'
    ];
    protected $table = 'adherents';


    public function collections(){
        return $this->hasMany('App\Collection');
    }
    public function reactions(){
        return $this->hasMany('App\Reaction');
    }

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
