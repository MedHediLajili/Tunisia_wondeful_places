<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Place extends Model
{
    protected $fillable = [
        'name','description','state_id'
    ];
    protected $table = 'places';




    public function state(){
        return $this->belongsTo('App\State');
    }
    public function images(){
        return $this->hasMany('App\Image');
    }
    public function collections(){
        return $this->belongsToMany('App\Collection')->withTimestamps();
    }
    public function reactions(){
        return $this->hasMany('App\Reaction');
    }
}
