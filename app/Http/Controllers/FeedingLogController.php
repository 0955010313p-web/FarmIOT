<?php

namespace App\Http\Controllers;

use App\Models\FeedingLog;
use App\Models\IotDevice;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class FeedingLogController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $logs = FeedingLog::with(['device', 'farm', 'user'])
            ->when($request->device_id, function ($query, $deviceId) {
                return $query->forDevice($deviceId);
            })
            ->latestFeeding()
            ->paginate(20);

        return response()->json(['data' => $logs]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'iot_device_id' => 'required|exists:iot_devices,id',
            'status' => 'required|in:fed,scheduled',
            'notes' => 'nullable|string|max:255',
        ]);

        $device = IotDevice::findOrFail($request->iot_device_id);
        $user = auth()->user();
        
        $fedAt = now();
        $nextFeedingAt = $fedAt->copy()->addHours(5); // 5 ชั่วโมงถัดไป

        $log = FeedingLog::create([
            'iot_device_id' => $request->iot_device_id,
            'farm_id' => $device->farm_id,
            'user_id' => $user?->id,
            'status' => $request->status,
            'fed_at' => $fedAt,
            'next_feeding_at' => $nextFeedingAt,
            'notes' => $request->notes,
        ]);

        return response()->json([
            'message' => 'Feeding log created successfully',
            'data' => $log->load(['device', 'farm', 'user'])
        ], 201);
    }

    public function latest(Request $request): JsonResponse
    {
        $deviceId = $request->device_id;
        
        if (!$deviceId) {
            return response()->json(['error' => 'Device ID is required'], 400);
        }

        $latestLog = FeedingLog::forDevice($deviceId)
            ->latestFeeding()
            ->with(['device', 'farm', 'user'])
            ->first();

        return response()->json(['data' => $latestLog]);
    }

    public function status(Request $request): JsonResponse
    {
        $deviceId = $request->device_id;
        
        if (!$deviceId) {
            return response()->json(['error' => 'Device ID is required'], 400);
        }

        $latestLog = FeedingLog::forDevice($deviceId)
            ->latestFeeding()
            ->first();

        $nextFeedingIn = null;
        $canFeed = true;
        
        if ($latestLog && $latestLog->next_feeding_at) {
            $now = now();
            $nextFeedingIn = $latestLog->next_feeding_at->diffInHours($now, false);
            $canFeed = $nextFeedingIn <= 0;
        }

        return response()->json([
            'data' => [
                'latest_log' => $latestLog,
                'next_feeding_in_hours' => $nextFeedingIn,
                'can_feed' => $canFeed,
                'next_feeding_at' => $latestLog?->next_feeding_at,
            ]
        ]);
    }
}
