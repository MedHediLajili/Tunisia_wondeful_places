<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\State;
use App\Admin ;
use Illuminate\Support\Facades\Config;
class StateController extends Controller
{
    public function __construct(){
        Config::set('jwt.user','App\Admin');
        Config::set('auth.providers.users.model',Admin::class);
    }

    public function index(){
        $states = State::all();
        return response()->json($states,200);
    }

    public function show($state_id){
        $state = State::find($state_id);

        return response()->json($state, 200);
    }

    public function store(Request $request){
        $state = new State($request->state);
        $state->save();
        return response()->json($state ,201);
    }

    public function update(Request $request , State $state){
        $state->update($request->state);
        return response()->json($state,200);
    }

    public function delete (State $state){
        $state->delete();
        return response()->json(null,204);
    }

}
