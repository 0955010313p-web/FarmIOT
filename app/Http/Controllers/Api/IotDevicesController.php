<?php

namespace App\Http\Controllers\Api;

use App\Models\IotDevice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;
use App\Http\Resources\IotDeviceResource;

class IotDevicesController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // TODO: Authorization
        $query = IotDevice::with('farm'); // Eager load the farm relationship

        if ($request->has('farm_id')) {
            $query->where('farm_id', $request->farm_id);
        }

        $devices = $query->paginate(15);

        return IotDeviceResource::collection($devices);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // TODO: Authorization
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'farm_id' => 'required|exists:farms,id',
            'type' => 'required|string|in:sensor,actuator',
            'sensor_type_id' => 'nullable|exists:sensor_types,id',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $device = IotDevice::create($validator->validated());

        $device->load('farm'); // Load the relationship

        return response(new IotDeviceResource($device), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(IotDevice $iotDevice)
    {
        // TODO: Authorization
        $iotDevice->load('farm'); // Load the relationship

        return new IotDeviceResource($iotDevice);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, IotDevice $iotDevice)
    {
        // TODO: Authorization
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'farm_id' => 'sometimes|required|exists:farms,id',
            'type' => 'sometimes|required|string|in:sensor,actuator',
            'sensor_type_id' => 'sometimes|nullable|exists:sensor_types,id',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $iotDevice->update($validator->validated());

        $iotDevice->load('farm'); // Load the relationship

        return new IotDeviceResource($iotDevice);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(IotDevice $iotDevice)
    {
        // TODO: Authorization
        $iotDevice->delete();

        return response()->json(['message' => 'IoT device deleted successfully'], 200);
    }
}
