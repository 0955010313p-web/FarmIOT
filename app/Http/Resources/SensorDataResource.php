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
            'iot_device_id' => $this->iot_device_id,
            'value' => $this->value,
            'recorded_at' => $this->recorded_at ? $this->recorded_at : $this->created_at,
            'created_at' => $this->created_at->toDateTimeString(),
            'iot_device' => new IotDeviceResource($this->whenLoaded('iotDevice')),
        ];
    }
}
