<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\State;
use App\Place;
use App\Admin ;
use Illuminate\Support\Facades\Config;
class PlaceController extends Controller
{
    public function __construct(){
        Config::set('jwt.user','App\Admin');
        Config::set('auth.providers.users.model',Admin::class);
    }

    public function index($state_id){
      $places = State::find($state_id)->places;
      return response()->json($places,200);
    }

    public function AllPlaces(){
        $places = Place::all();
        return response()->json($places,200);
    }

    public function store( Request $request ,$state_id){
        $state = State::find($state_id);
        $state->places()->create($request->place);
        return response()->json(Place::latest()->first(),201);
    }

    public function show($place_id){
        $place = Place::find($place_id);
        return response()->json($place,200);
    }

    public function update(Request $request, Place $place){
        $place->update($request->place);
        return response()->json($place,200);
    }

    public function delete(Place $place){
        $images = $place->images;
        $place->delete();
        return response()->json(null,204);
    }
}
