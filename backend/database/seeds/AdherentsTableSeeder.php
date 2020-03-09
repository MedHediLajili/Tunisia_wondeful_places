<?php

use Illuminate\Database\Seeder;
use App\Adherent;
class AdherentsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        factory(Adherent::class,5)->create();
        /*$a = new Adherent();
        $a->firstname = 'Med';
        $a->lastname = 'Hedi lajili';
        $a->email = "med@gmail.com";
        $a->password = '050408';
        $a->description = 'fdkfdjfdk kdfjkfdjf dfdj ,dfgffd ,,fd, f,fd,df, fd';
        $a->photo = 'https/balle.png';
        $a->save();*/
    }
}
