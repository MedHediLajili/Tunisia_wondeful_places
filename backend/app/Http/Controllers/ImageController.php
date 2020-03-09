<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Image;
use App\Place;
use File;

class ImageController extends Controller
{
    public function index($place_id){
        $images = Place::find($place_id)->images;
        return response()->json($images,200);
      }

      public function addimage(Request $request){
        $path = $request->file('photo')->move(public_path("/images"),$request->file('photo')->getClientOriginalName());
         return  response()->json('image has been saved',201);
    }

      public function deleteimage(Request $request){
          $namephoto = $request->photo;
          $folder_name=$request->folder;
          if($folder_name === 'images'){
                if(File::exists(public_path($folder_name.'/'.$namephoto))){
                    File::delete(public_path($folder_name.'/'.$namephoto));
                }else{
                    dd('File does not exists.');
                }
                return  response()->json('image has been deleted',200);
           }
          else if($folder_name==='places'){
            if(File::exists(public_path($folder_name.'/'.$namephoto))){
                File::delete(public_path($folder_name.'/'.$namephoto));
            }else{
                dd('File does not exists.');
            }
            $image = Image::where('url', 'http://127.0.0.1:8000/places/'.$namephoto)->first();
            $this->delete($image);
            return  response()->json('image has been deleted from DataBase',200);
          }
          else{
            if(File::exists(public_path($folder_name.'/'.$namephoto))){
                File::delete(public_path($folder_name.'/'.$namephoto));
            }else{
                dd('File does not exists.');
            }
            return  response()->json('image has been deleted',200);
          }
      }

      public function store( Request $request ,$place_id){
          $place = Place::find($place_id);
          $old_image_name=$request->image;
          $new_image_name= "place".strval($place->id)."image".$place->images->count().".jpg";
          $old_directory = public_path("images\\".$old_image_name);
          $new_directory= public_path("places\\".$new_image_name);
          rename($old_directory,$new_directory);
          $photoUrl = url('/places/'.$new_image_name);
          $place->images()->create(['url'=>$photoUrl]);
          return response()->json(Image::latest()->first(),201);
          /*return response()->json(['old'=>$old_directory,
        'new'=>$new_directory],200);*/
      }


      public function show($image_id){
          $image = Image::find($image_id);
          return response()->json($image,200);
      }

      public function update(Request $request, Image $image){
          $image->update($request->all());
          return response()->json($image,200);
      }

      public function delete(Image $image){
          $image->delete();
          return response()->json(null,204);
      }
}
