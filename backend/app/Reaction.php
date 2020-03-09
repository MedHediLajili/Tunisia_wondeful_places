<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Reaction extends Model
{
    protected $fillable = [
        'place_id','is_like','is_favoris'
    ];
    protected $table = 'reactions';

    public function place(){
        return $this->belongsTo('App\Place');
    }
    public function adherent(){
        return $this->belongsTo('App\Adherent');
    }
}
