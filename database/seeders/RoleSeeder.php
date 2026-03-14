<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\UserRole;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        foreach (['Admin', 'Farm Owner', 'User'] as $roleName) {
            UserRole::firstOrCreate(['name' => $roleName]);
        }
    }
}
