<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Adherent;
use App\Reaction;
use Illuminate\Support\Facades\Config;

class ReactionController extends Controller
{

    public function __construct(){
        Config::set('jwt.user','App\Adherent');
        Config::set('auth.providers.users.model',Adherent::class);

    }

    public function index($adherent_id){
        $reactions = Adherent::find($adherent_id)->reactions;
        return response()->json($reactions,200);
    }

    public  function store(Request $request , $id){
        $input = $request->reaction;
        $adherent = Adherent::find($id);
        $adherent->reactions()->create($input);
        return response()->json(Reaction::latest()->first(),201);
    }

    public function show($reaction_id){
        $reaction = Reaction::find($reaction_id);
        return response()->json($reaction, 200);

    }

    public function update(Request $request , Reaction $reaction){
        $input = $request->reaction;
        $reaction->update($input);
        return response()->json($reaction,200);
    }

    public function delete( Reaction $reaction){
        $reaction->delete();
        return response()->json(null,204);
    }

    public function reactionToPlace(string $adherent_id , string $place_id){
        $reaction = Reaction::where('adherent_id', $adherent_id)->where('place_id',$place_id)->first();
        return response()->json($reaction, 200);

    }
}
