<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SensorType;
use Illuminate\Support\Facades\Validator;

class SensorTypesController extends Controller
{
    public function index()
    {
        return response()->json(SensorType::paginate(50));
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:sensor_types,name',
            'unit' => 'nullable|string|max:50',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        $sensorType = SensorType::create($validator->validated());
        return response()->json($sensorType, 201);
    }

    public function show(SensorType $sensorType)
    {
        return response()->json($sensorType);
    }

    public function update(Request $request, SensorType $sensorType)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255|unique:sensor_types,name,' . $sensorType->id,
            'unit' => 'sometimes|nullable|string|max:50',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        $sensorType->update($validator->validated());
        return response()->json($sensorType);
    }

    public function destroy(SensorType $sensorType)
    {
        $sensorType->delete();
        return response()->json(['message' => 'Sensor type deleted'], 200);
    }
}
