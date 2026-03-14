<?php

namespace Database\Seeders;

use App\Models\SensorType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SensorTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $types = [
            ['name' => 'Temperature', 'unit' => '°C'],
            ['name' => 'Humidity', 'unit' => '%'],
            ['name' => 'Soil Moisture', 'unit' => '%'],
            ['name' => 'Light Intensity', 'unit' => 'lux'],
            ['name' => 'pH', 'unit' => 'pH'],
        ];
        foreach ($types as $t) {
            SensorType::firstOrCreate(['name' => $t['name']], $t);
        }
    }
}
