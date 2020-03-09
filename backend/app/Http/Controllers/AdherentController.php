<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use JWTAuth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Config;
use App\Adherent ;
use Illuminate\Database\QueryException;

class AdherentController extends Controller
{

    protected $loginAfterSignUp= true;
    public function __construct(){
        Config::set('jwt.user','App\Adherent');
        Config::set('auth.providers.users.model',Adherent::class);

    }


    public function index(){
        $adherents = Adherent::all();
        return response()->json($adherents,200);
    }

    public function show($id){
        $adherent = Adherent::find($id);
        if(is_null($adherent)){
            return response()->json('adherent non trouve' , 404);
        }
        else{
           return response()->json($adherent, 200);
        }
    }

    public function store(Request $request){
        $adherent = new Adherent(['firstname'=>$request->firstname,'lastname'=>$request->lastname,
        'email'=>$request->email,'password'=>$request->password,'description'=>$request->description
        ]);
        $fileName= "user".$adherent->email.".jpg";
        $path = $request->file('photo')->move(public_path("/adherents"),$fileName);
        $photoUrl = url('/adherents/'.$fileName);
        $adherent->photo = $photoUrl;
        $adherent->save();
        return response()->json($adherent ,201);
    }

    public function adherentregister(Request $request){
        try{
        $adherent = new Adherent(['firstname'=>$request->firstname,'lastname'=>$request->lastname,
        'email'=>$request->email,'password'=>bcrypt($request->password),'description'=>$request->description
        ]);

        $old_image_name=$request->photo;
        $new_image_name= "user".$adherent->email.".jpg";
        $old_directory = public_path("images\\".$old_image_name);
        $new_directory= public_path("adherents\\".$new_image_name);
        rename($old_directory,$new_directory);
        $photoUrl = url('/adherents/'.$new_image_name);
        $adherent->photo = $photoUrl;
        $adherent->save();
        }catch(QueryException $e){
        return response()->json(['success'=> false,'error' => "Email existe"] , 200);
      }

        if($this->loginAfterSignUp){
            return $this->adherentlogin($request);
        }
        return response()->json([
            'success'=> true,
            'data' => $adherent,
        ] , 200);

    }

    public function adherentlogout(Request $request)
    {
        $this->validate($request, [
            'token' => 'required'
        ]);

        try {
            JWTAuth::invalidate($request->token);

            return response()->json([
                'success' => true,
                'message' => 'Adherent logged out successfully'
            ]);
        } catch (JWTException $exception) {
            return response()->json([
                'success' => false,
                'message' => 'Sorry, the adherent cannot be logged out'
            ], 500);
        }
    }

    public function adherentlogin(Request $request)
    {
        $input = $request->only('email', 'password');
        $token = null;

        if ($adherent = Adherent::all()->where('email',$request->email)->first()) {

            if(!Hash::check($request->password,$adherent->password, [])){
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid Password',
                ], 200);
            }else{

                $token = JWTAuth::fromUser($adherent);
                return response()->json([
                    'success' => true,
                    'token' => $token,
                ]);
            }
        }else{
            return response()->json([
                'success' => false,
                'message' => 'Invalid Email',
            ], 200);
        }

    }

    public function update(Request $request , Adherent $adherent){

       $adherent->update(['firstname'=>$request->firstname, 'lastname'=>$request->lastname,'email'=>$request->email,'description'=>$request->description,'password'=>$request->password,]);
       if($adherent->photo != $request->photo){
        $old_image_name=$request->photo;
        $new_image_name= "user".$adherent->email.".jpg";
        $old_directory = public_path("images\\".$old_image_name);
        $new_directory= public_path("adherents\\".$new_image_name);
        rename($old_directory,$new_directory);
        $photoUrl = url('/adherents/'.$new_image_name);
        $request->photo = $photoUrl;
        $adherent->update(['photo'=>$request->photo]);
       } else{
        $adherent->update(['photo'=>$request->photo]);
       }
       return response()->json($adherent,200);
    }

    public function delete (Adherent $adherent){
        $adherent->delete();
        return response()->json(null,204);
    }

    public function adherentme(Request $request)
    {
        return response()->json(JWTAuth::toUser($request->token),200);
    }

}

