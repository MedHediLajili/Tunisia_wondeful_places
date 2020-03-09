<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Adherent;
use App\Collection;
use App\Place;
use Illuminate\Support\Facades\Config;
use Illuminate\Database\QueryException;

class CollectionController extends Controller
{
    public function __construct(){
        Config::set('jwt.user','App\Adherent');
        Config::set('auth.providers.users.model',Adherent::class);

    }
    public function index($id){
        $collections = Adherent::find($id)->collections;
        return response()->json($collections,200);
    }

    public function store(Request $request , $id){
        $adherent = Adherent::find($id);
        $adherent->collections()->create($request->collection);
        return response()->json(Collection::latest()->first(),201);
    }

    public function show($collection_id){
        $collection = Collection::find($collection_id);
        return response()->json($collection, 200);

    }

    public function update(Request $request , Collection $collection){
        $collection->update($request->collection);
        return response()->json($collection,200);
    }


    public function delete( Collection $collection){
        $collection->delete();
        return response()->json(null,204);
    }

    public function AllPlacesFromCollection($collection_id){
        $collection = Collection::find($collection_id);
        return response()->json($collection->places ,200);
    }

    public function deletePlaceFromCollection(Collection $collection, Place $place){
        $collection->places()->detach($place);
        return response()->json($collection->places,204);
    }

    public function addPlaceToCollection(Collection $collection,Place $place){
        if($collection->places()->where('place_id',$place->id)->first()){
            return response()->json(['success'=> false,'error' => "Place allready exists in that Collection "] , 200);
        }
        else{
            $collection->places()->attach($place);
            return response()->json(['success'=> true,'data' => $collection->places],201);
        }

    }
}
