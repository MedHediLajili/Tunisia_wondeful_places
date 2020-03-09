<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Collection extends Model
{
    protected $fillable = [
        'name'
    ];
    protected $table = 'collections';

    public function adherent(){
        return $this->belongsTo('App\Adherent');
    }
    public function places(){
        return $this->belongsToMany('App\Place')->withTimestamps();
    }
}
