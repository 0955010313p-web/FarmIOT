<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class IotDeviceResource extends JsonResource
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
            'name' => $this->name,
            'type' => $this->type,
            'farm_id' => $this->farm_id,
            'sensor_type_id' => $this->sensor_type_id,
            'is_active' => (bool) ($this->is_active ?? true),
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
            'farm' => new FarmResource($this->whenLoaded('farm')),
        ];
    }
}
