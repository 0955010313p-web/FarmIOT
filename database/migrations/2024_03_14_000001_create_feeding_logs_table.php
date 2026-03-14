<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('feeding_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('iot_device_id')->constrained('iot_devices')->onDelete('cascade');
            $table->foreignId('farm_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->enum('status', ['fed', 'scheduled'])->default('fed');
            $table->dateTime('fed_at');
            $table->dateTime('next_feeding_at')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->index(['iot_device_id', 'fed_at']);
            $table->index(['farm_id', 'fed_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('feeding_logs');
    }
};
