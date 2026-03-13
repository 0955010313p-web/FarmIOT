<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Fetch dashboard statistics.
     *
     * This method will gather all the necessary data for the dashboard.
     * For now, it returns static data. In the future, this will query the database.
     */
    public function getStats(Request $request)
    {
        // In the future, these values will come from the database.
        // For example: $totalDevices = Device::count();
        // $onlineDevices = Device::where('status', 'online')->count();
        
        $stats = [
            'totalDevices' => 12,       // Replace with dynamic data later
            'devicesOnline' => 10,      // Replace with dynamic data later
            'alerts' => 3,              // Replace with dynamic data later
            'devicesOffline' => 2,      // Replace with dynamic data later
            'greenhouseTemp' => 24.5,   // Example temperature
            'waterPumpStatus' => 'ON',  // Example status
            'lightingStatus' => 'OFF'    // Example status
        ];

        return response()->json($stats);
    }
}
