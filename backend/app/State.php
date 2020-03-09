<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class State extends Model
{

    protected $fillable = [
        'name','description'
    ];


    public function places(){
        return $this->hasMany('App\Place');
    }

    protected $table = 'states';
}
