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
        SensorType::create(['name' => 'Temperature', 'unit' => '°C']);
        SensorType::create(['name' => 'Humidity', 'unit' => '%']);
        SensorType::create(['name' => 'Soil Moisture', 'unit' => '%']);
        SensorType::create(['name' => 'Light Intensity', 'unit' => 'lux']);
        SensorType::create(['name' => 'pH', 'unit' => 'pH']);
    }
}
