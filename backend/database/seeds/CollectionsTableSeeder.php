<?php

use Illuminate\Database\Seeder;

class CollectionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $adherent = App\Adherent::find(10);
        $collections = App\Collection::find([4,5]);
        $places = App\Place::find([1,2,6]);
        foreach($collections as $collection){
            $collection->places()->attach($places);
        }

    }
}
