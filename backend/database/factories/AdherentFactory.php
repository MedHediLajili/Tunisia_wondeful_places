<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Adherent;
use Faker\Generator as Faker;

$factory->define(Adherent::class, function (Faker $faker) {
    return [
        'firstname'=> $faker->firstName(),
        'lastname' => $faker->lastName(),
        'email'=> $faker->unique()->email,
        'password'=> $faker->password(),
        'description'=> $faker->text(200),
        'photo'=> $faker->imageUrl(640,480),
    ];
});
