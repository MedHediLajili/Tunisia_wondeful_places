<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Reaction;
use Faker\Generator as Faker;

$factory->define(Reaction::class, function (Faker $faker) {
    return [
        'is_like'=> $faker->boolean() ,
        'is_favoris'=> $faker->boolean()
    ];
});
