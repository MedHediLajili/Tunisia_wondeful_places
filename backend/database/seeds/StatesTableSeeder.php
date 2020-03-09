<?php

use Illuminate\Database\Seeder;

class StatesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(App\State::class, 5)->create()->each(function ($state) {
            $state->places()->save(factory(App\Place::class)->make());
        });
    }
}
