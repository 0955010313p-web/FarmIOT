<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\FarmCategory;

class FarmCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $categories = [
            ['name' => 'Crop', 'description' => 'Farms that primarily grow crops.'],
            ['name' => 'Livestock', 'description' => 'Farms that primarily raise livestock.'],
            ['name' => 'Aquaculture', 'description' => 'Farms that cultivate aquatic organisms.'],
            ['name' => 'Mixed', 'description' => 'Farms that have a mix of crops and livestock.'],
            ['name' => 'Urban', 'description' => 'Farms that are located in urban areas.'],
        ];

        foreach ($categories as $c) {
            FarmCategory::firstOrCreate(['name' => $c['name']], $c);
        }
    }
}
