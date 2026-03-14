<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use App\Models\User;
use App\Models\Farm;
use App\Models\IotDevice;

class SampleDataSeeder extends Seeder
{
    public function run(): void
    {
        // Ensure base seeders have run
        $this->call([
            RoleSeeder::class,
            FarmCategorySeeder::class,
            SensorTypeSeeder::class,
            UserSeeder::class,
        ]);

        $owner = User::where('email', 'owner@example.com')->first();
        if (! $owner) {
            return;
        }
        $farm = Farm::where('user_id', $owner->id)->first();
        if (! $farm) {
            return;
        }
        $sensor = IotDevice::where('farm_id', $farm->id)->where('type', 'sensor')->first();
        if (! $sensor) {
            return;
        }

        // Insert sample sensor_data points (idempotent by timestamp uniqueness check)
        $now = Carbon::now()->startOfMinute();
        for ($i = 0; $i < 12; $i++) {
            $t = $now->copy()->subMinutes(11 - $i);
            $exists = DB::table('sensor_data')
                ->where('iot_device_id', $sensor->id)
                ->where('recorded_at', $t)
                ->exists();
            if (! $exists) {
                DB::table('sensor_data')->insert([
                    'iot_device_id' => $sensor->id,
                    'value' => (string) (20 + rand(0, 100) / 10), // 20.0 - 30.0
                    'recorded_at' => $t,
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ]);
            }
        }
    }
}
