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
        FarmCategory::create(['name' => 'Crop', 'description' => 'Farms that primarily grow crops.']);
        FarmCategory::create(['name' => 'Livestock', 'description' => 'Farms that primarily raise livestock.']);
        FarmCategory::create(['name' => 'Aquaculture', 'description' => 'Farms that cultivate aquatic organisms.']);
        FarmCategory::create(['name' => 'Mixed', 'description' => 'Farms that have a mix of crops and livestock.']);
        FarmCategory::create(['name' => 'Urban', 'description' => 'Farms that are located in urban areas.']);
    }
}
