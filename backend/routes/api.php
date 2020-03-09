<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('admin/register','AdminController@adminregister');
Route::post('admin/login','AdminController@adminlogin');
Route::group(['middleware'=>['auth.jwt']] , function(){
    Route::post('admin/logout','AdminController@adminlogout');
    Route::post('admin/authadmin','AdminController@adminme');

    Route::put('state/updateplace/{place}','PlaceController@update');
    Route::post('state/{state_id}/addplace','PlaceController@store');

    Route::post('newstate','StateController@store');
    Route::put('editstate/{state}','StateController@update');
    Route::post('deletestate/{state}','StateController@delete');


    Route::put('editadmin/{admin}','AdminController@update');

});
Route::post('sendemail/send','SendEmailController@send');
Route::post('adherent/register','AdherentController@adherentregister');
Route::post('adherent/login','AdherentController@adherentlogin');

Route::group(['middleware'=>['auth.jwt']] , function(){
    Route::post('adherent/logout','AdherentController@adherentlogout');
    Route::post('adherent/authadherent','AdherentController@adherentme');
    Route::post('state/removeplace/{place}','PlaceController@delete');

    Route::put('editadherent/{adherent}','AdherentController@update');



    Route::post('adherent/{adherent_id}/reactions','ReactionController@index');
    Route::post('adherent/{id}/addreaction','ReactionController@store');
    Route::post('adherent/{adherent_id}/reaction/{place_id}','ReactionController@reactionToPlace');
    Route::post('adherent/reaction/{reaction_id}','ReactionController@show');
    Route::put('adherent/updatereaction/{reaction}','ReactionController@update');
    Route::post('adherent/removereaction/{reaction}','ReactionController@delete');


    Route::post('adherent/{id}/collections','CollectionController@index');
    Route::post('adherent/{id}/addcollection','CollectionController@store');
    Route::post('adherent/collection/{collection}/addplace/{place}','CollectionController@addPlaceToCollection');
    Route::post('adherent/collection/{collection_id}/allplaces','CollectionController@AllPlacesFromCollection');
    Route::post('adherent/collection/{collection_id}','CollectionController@show');
    Route::put('adherent/updatecollection/{collection}','CollectionController@update');
    Route::post('adherent/removecollection/{collection}','CollectionController@delete');
    Route::post('adherent/collection/{collection}/removeplace/{place}','CollectionController@deletePlaceFromCollection');

});


// adherent controller
Route::get('adherents','AdherentController@index');
Route::get('adherent/{id}','AdherentController@show');
Route::post('newadherent','AdherentController@store');
Route::delete('deleteadherent/{adherent}','AdherentController@delete');

//States controller
Route::get('states','StateController@index');
Route::get('state/{state_id}','StateController@show');

/* places controller */
Route::get('places','PlaceController@AllPlaces');
Route::get('state/{state_id}/places','PlaceController@index');
Route::get('state/place/{place_id}','PlaceController@show');


/*images controller*/
Route::post('addimage','ImageController@addimage');
Route::post('deleteimage','ImageController@deleteimage');

Route::get('place/{place_id}/images','ImageController@index');
Route::post('place/{place_id}/addimage','ImageController@store');
Route::get('place/image/{image_id}','ImageController@show');
Route::put('place/updateimage/{image}','ImageController@update');
Route::delete('place/removeimage/{image}','ImageController@delete');



















