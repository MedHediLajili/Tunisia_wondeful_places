<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReactionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('reactions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('place_id');
            $table->unsignedBigInteger('adherent_id');
            $table->boolean('is_like')->default(false);
            $table->boolean('is_favoris')->default(false);

            $table->unique(['adherent_id','place_id']);
            $table->foreign('adherent_id')->references('id')->on('adherents')->onDelete('cascade');
            $table->foreign('place_id')->references('id')->on('places')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('reactions');
    }
}
