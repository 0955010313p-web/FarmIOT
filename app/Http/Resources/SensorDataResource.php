<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SensorDataResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            // 'iot_device_id' => $this->iot_device_id, // Redundant
            'sensor_type' => $this->sensor_type,
            'value' => $this->value,
            'unit' => $this->unit,
            'created_at' => $this->created_at->toDateTimeString(),
            // Include the IoT device object only when the relationship is loaded
            'iot_device' => new IotDeviceResource($this->whenLoaded('iotDevice')),
        ];
    }
}
