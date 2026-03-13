<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('auto_rules', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('farm_id')->constrained()->onDelete('cascade');
            $table->foreignId('sensor_type_id')->constrained()->onDelete('cascade');
            $table->string('threshold');
            $table->string('action'); // e.g., 'turn_on', 'turn_off'
            $table->foreignId('actuator_id')->constrained('iot_devices')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('auto_rules');
    }
};
