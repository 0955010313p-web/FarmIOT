<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ActuatorCommand;
use Illuminate\Support\Facades\Validator;

class ActuatorCommandsController extends Controller
{
    public function index(Request $request)
    {
        $query = ActuatorCommand::query();
        if ($request->has('iot_device_id')) {
            $query->where('iot_device_id', $request->iot_device_id);
        }
        return response()->json($query->orderBy('created_at', 'desc')->paginate(50));
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'iot_device_id' => 'required|exists:iot_devices,id',
            'command' => 'required|string',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        $data = $validator->validated();
        $data['status'] = 'pending';
        $data['sent_at'] = now();
        $cmd = ActuatorCommand::create($data);
        return response()->json($cmd, 201);
    }

    public function show(ActuatorCommand $actuatorCommand)
    {
        return response()->json($actuatorCommand);
    }

    public function update(Request $request, ActuatorCommand $actuatorCommand)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'sometimes|required|string|in:pending,sent,acknowledged,failed',
            'acknowledged_at' => 'sometimes|nullable|date',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        $actuatorCommand->update($validator->validated());
        return response()->json($actuatorCommand);
    }

    public function destroy(ActuatorCommand $actuatorCommand)
    {
        $actuatorCommand->delete();
        return response()->json(['message' => 'Command deleted'], 200);
    }
}
