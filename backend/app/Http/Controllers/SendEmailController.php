<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\SendMail ;

class SendEmailController extends Controller
{

    public function send(Request $request){
        $data = ['firstname'      =>  $request->firstname,'lastname'   =>   $request->lastname,
        'code'      =>    $request->code];

     Mail::to($request->email)->send(new SendMail($data));
    }
}
