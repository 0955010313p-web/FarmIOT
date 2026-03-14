<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('farms', function (Blueprint $table) {
            if (!Schema::hasColumn('farms', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('user_id');
            }
        });

        Schema::table('iot_devices', function (Blueprint $table) {
            if (!Schema::hasColumn('iot_devices', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('sensor_type_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('farms', function (Blueprint $table) {
            if (Schema::hasColumn('farms', 'is_active')) {
                $table->dropColumn('is_active');
            }
        });

        Schema::table('iot_devices', function (Blueprint $table) {
            if (Schema::hasColumn('iot_devices', 'is_active')) {
                $table->dropColumn('is_active');
            }
        });
    }
};

