<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Database\QueryException;
use App\Admin ;
use JWTAuth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Config;

class AdminController extends Controller
{
    protected $loginAfterSignUp= true;
    public function __construct(){
        Config::set('jwt.user','App\Admin');
        Config::set('auth.providers.users.model',Admin::class);

    }
    public function index()
    {
        $admins = Admin::all();
        return response()->json($admins,200);
    }

    public  function store(Request $request)
    {
        try{
        $admin= new Admin();
        $admin->pseudo = $request->pseudo;
        $admin->email = $request->email;
        $admin->password = bcrypt($request->password);
        $admin->save();
        }catch(QueryException $e){
            return response()->json(['success'=> false,'error' => "Email existe"] , 200);
          }
        return $admin;
    }

    public function show($id)
    {
        $admin = Admin::find($id);
        return response()->json($admin,200);
    }

    public function update(Request $request, Admin $admin)
    {
        $admin->update($request->admin);
        return response()->json($admin,200);
    }

    public function delete(Admin $admin)
    {
        $admin->delete();
        return response()->json(null,204);
    }

    public function adminlogin(Request $request)
    {
        $input = $request->only('email', 'password');
        $token = null;

        if ($admin = Admin::all()->where('email',$request->email)->first()) {

            if(!Hash::check($request->password,$admin->password, [])){
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid Password',
                ], 200);
            }else{

                $token = JWTAuth::fromUser($admin);
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

    public function adminlogout(Request $request)
    {
        $this->validate($request, [
            'token' => 'required'
        ]);

        try {
            JWTAuth::invalidate($request->token);

            return response()->json([
                'success' => true,
                'message' => 'Admin logged out successfully'
            ]);
        } catch (JWTException $exception) {
            return response()->json([
                'success' => false,
                'message' => 'Sorry, the admin cannot be logged out'
            ], 500);
        }
    }

    public function adminregister(Request $request){
        try{
            $admin= new Admin();
            $admin->pseudo = $request->pseudo;
            $admin->email = $request->email;
            $admin->password = bcrypt($request->password);
            $admin->save();
        }catch(QueryException $e){
          return response()->json(['success'=> false,'error' => "Email existe"] , 200);
        }
        if($this->loginAfterSignUp){
            return $this->adminlogin($request);
        }
        return response()->json([
            'success'=> true,
            'data' => $admin,
        ] , 200);

    }

    public function adminme(Request $request)
    {
        return response()->json(JWTAuth::toUser($request->token),200);
    }
}
