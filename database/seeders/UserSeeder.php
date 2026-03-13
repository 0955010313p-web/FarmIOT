<?php

namespace Database\Seeders;

use App\Models\Farm;
use App\Models\IotDevice;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Create Admin User
        User::create([
            'username' => 'admin',
            'firstname' => 'Admin',
            'lastname' => 'User',
            'email' => 'admin@example.com',
            'tel' => '0000000000',
            'password' => Hash::make('password'),
            'user_role_id' => 1, // Admin
        ]);

        // Create Farm Owner User with a Farm and IoT Devices
        $farmOwner = User::create([
            'username' => 'owner',
            'firstname' => 'Farm',
            'lastname' => 'Owner',
            'email' => 'owner@example.com',
            'tel' => '0000000001',
            'password' => Hash::make('password'),
            'user_role_id' => 2, // Farm Owner
        ]);

        $farm = Farm::create([
            'name' => 'My First Farm',
            'description' => 'A small, mixed farm.',
            'farm_category_id' => 4, // Mixed
            'user_id' => $farmOwner->id,
        ]);

        IotDevice::create([
            'name' => 'Living Room Temp Sensor',
            'description' => 'Measures temperature in the living room.',
            'farm_id' => $farm->id,
            'type' => 'sensor',
            'sensor_type_id' => 1, // Temperature
        ]);

        IotDevice::create([
            'name' => 'Water Pump',
            'description' => 'Controls the water pump for irrigation.',
            'farm_id' => $farm->id,
            'type' => 'actuator',
        ]);

        // Create a regular user
        User::create([
            'username' => 'user',
            'firstname' => 'Regular',
            'lastname' => 'User',
            'email' => 'user@example.com',
            'tel' => '0000000002',
            'password' => Hash::make('password'),
            'user_role_id' => 3, // User
        ]);
    }
}
