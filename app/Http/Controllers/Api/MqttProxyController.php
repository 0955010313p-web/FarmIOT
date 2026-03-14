<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Services\MqttClientSimple;

class MqttProxyController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function publish(Request $request)
    {
        $v = Validator::make($request->all(), [
            'topic' => 'required|string',
            'message' => 'required|string',
        ]);
        if ($v->fails()) {
            return response()->json($v->errors(), 422);
        }

        $host = config('services.mqtt.host', env('MQTT_HOST', '127.0.0.1'));
        $port = (int) config('services.mqtt.port', env('MQTT_PORT', 1883));
        $username = config('services.mqtt.username', env('MQTT_USERNAME'));
        $password = config('services.mqtt.password', env('MQTT_PASSWORD'));

        try {
            $client = new MqttClientSimple($host, $port, $username, $password);
            $client->connect();
            $client->publish($request->topic, $request->message);
            $client->disconnect();
        } catch (\Throwable $e) {
            return response()->json(['message' => 'MQTT publish failed', 'error' => $e->getMessage()], 502);
        }

        return response()->json(['status' => 'ok']);
    }
}
