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
        User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'username' => 'admin',
                'firstname' => 'Admin',
                'lastname' => 'User',
                'tel' => '0000000000',
                'password' => Hash::make('password'),
                'user_role_id' => 1, // Admin
            ]
        );

        // Create Farm Owner User with a Farm and IoT Devices
        $farmOwner = User::firstOrCreate(
            ['email' => 'owner@example.com'],
            [
                'username' => 'owner',
                'firstname' => 'Farm',
                'lastname' => 'Owner',
                'tel' => '0000000001',
                'password' => Hash::make('password'),
                'user_role_id' => 2, // Farm Owner
            ]
        );

        $farm = Farm::firstOrCreate(
            ['name' => 'My First Farm', 'user_id' => $farmOwner->id],
            [
                'description' => 'A small, mixed farm.',
                'farm_category_id' => 4, // Mixed
            ]
        );

        IotDevice::firstOrCreate(
            ['name' => 'Living Room Temp Sensor', 'farm_id' => $farm->id],
            [
                'description' => 'Measures temperature in the living room.',
                'type' => 'sensor',
                'sensor_type_id' => 1, // Temperature
            ]
        );

        IotDevice::firstOrCreate(
            ['name' => 'Water Pump', 'farm_id' => $farm->id],
            [
                'description' => 'Controls the water pump for irrigation.',
                'type' => 'actuator',
            ]
        );

        // Create a regular user
        User::firstOrCreate(
            ['email' => 'user@example.com'],
            [
                'username' => 'user',
                'firstname' => 'Regular',
                'lastname' => 'User',
                'tel' => '0000000002',
                'password' => Hash::make('password'),
                'user_role_id' => 3, // User
            ]
        );
    }
}
