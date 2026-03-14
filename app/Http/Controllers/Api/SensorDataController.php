<?php

namespace App\Http\Controllers\Api;

use App\Models\SensorData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;
use App\Http\Resources\SensorDataResource;
use Carbon\Carbon;

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
        $validator = Validator::make($request->all(), [
            'iot_device_id' => 'sometimes|required|exists:iot_devices,id',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $query = SensorData::with('iotDevice');

        if ($request->has('iot_device_id')) {
            $query->where('iot_device_id', $request->iot_device_id);
        }

        if ($request->has('start_date')) {
            $query->where('recorded_at', '>=', Carbon::parse($request->start_date));
        }

        if ($request->has('end_date')) {
            $query->where('recorded_at', '<=', Carbon::parse($request->end_date));
        }

        $sensorData = $query->orderBy('recorded_at', 'desc')->paginate(100);

        return SensorDataResource::collection($sensorData);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'iot_device_id' => 'required|exists:iot_devices,id',
            'value' => 'required|string',
            'recorded_at' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $data = $validator->validated();
        if (!isset($data['recorded_at'])) {
            $data['recorded_at'] = now();
        }

        $record = SensorData::create($data);
        $record->load('iotDevice');

        return response(new SensorDataResource($record), 201);
    }

    public function show(SensorData $sensorDatum)
    {
        $sensorDatum->load('iotDevice');
        return new SensorDataResource($sensorDatum);
    }

    public function update(Request $request, SensorData $sensorDatum)
    {
        $validator = Validator::make($request->all(), [
            'value' => 'sometimes|required|string',
            'recorded_at' => 'sometimes|nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $sensorDatum->update($validator->validated());
        $sensorDatum->load('iotDevice');

        return new SensorDataResource($sensorDatum);
    }

    public function destroy(SensorData $sensorDatum)
    {
        $sensorDatum->delete();
        return response()->json(['message' => 'Sensor data deleted'], 200);
    }
}
