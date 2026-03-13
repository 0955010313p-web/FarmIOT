<?php

namespace App\Http\Controllers\Api;

use App\Models\SensorData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;
use App\Http\Resources\SensorDataResource;

class SensorDataController extends Controller
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
        $validator = Validator::make($request->all(), [
            'iot_device_id' => 'sometimes|required|exists:iot_devices,id',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $query = SensorData::with('iotDevice'); // Eager load the relationship

        if ($request->has('iot_device_id')) {
            $query->where('iot_device_id', $request->iot_device_id);
        }

        if ($request->has('start_date')) {
            $query->where('created_at', '>=', $request->start_date);
        }

        if ($request->has('end_date')) {
            $query->where('created_at', '<=', $request->end_date);
        }

        $sensorData = $query->orderBy('created_at', 'desc')->paginate(100);

        return SensorDataResource::collection($sensorData);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // TODO: Authorization
        $validator = Validator::make($request->all(), [
            'iot_device_id' => 'required|exists:iot_devices,id',
            'sensor_type' => 'required|string|max:100',
            'value' => 'required|numeric',
            'unit' => 'required|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $sensorData = SensorData::create($validator->validated());

        $sensorData->load('iotDevice'); // Load the relationship

        return response(new SensorDataResource($sensorData), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(SensorData $sensorData)
    {
        // TODO: Authorization
        $sensorData->load('iotDevice'); // Load the relationship

        return new SensorDataResource($sensorData);
    }

    /**
     * Sensor data is immutable, so the update method is omitted.
     */

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SensorData $sensorData)
    {
        // TODO: Authorization
        $sensorData->delete();

        return response()->json(['message' => 'Sensor data record deleted successfully'], 200);
    }
}
