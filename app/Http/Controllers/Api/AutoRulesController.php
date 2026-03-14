<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AutoRule;
use Illuminate\Support\Facades\Validator;

class AutoRulesController extends Controller
{
    public function index()
    {
        return response()->json(AutoRule::paginate(50));
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'farm_id' => 'required|exists:farms,id',
            'sensor_type_id' => 'required|exists:sensor_types,id',
            'threshold' => 'required|string',
            'action' => 'required|string|in:turn_on,turn_off',
            'actuator_id' => 'required|exists:iot_devices,id',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        $rule = AutoRule::create($validator->validated());
        return response()->json($rule, 201);
    }

    public function show(AutoRule $autoRule)
    {
        return response()->json($autoRule);
    }

    public function update(Request $request, AutoRule $autoRule)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'farm_id' => 'sometimes|required|exists:farms,id',
            'sensor_type_id' => 'sometimes|required|exists:sensor_types,id',
            'threshold' => 'sometimes|required|string',
            'action' => 'sometimes|required|string|in:turn_on,turn_off',
            'actuator_id' => 'sometimes|required|exists:iot_devices,id',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        $autoRule->update($validator->validated());
        return response()->json($autoRule);
    }

    public function destroy(AutoRule $autoRule)
    {
        $autoRule->delete();
        return response()->json(['message' => 'Rule deleted'], 200);
    }
}
