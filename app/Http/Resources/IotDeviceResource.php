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
            // 'farm_id' => $this->farm_id, // Redundant, as we are including the farm object
            'device_type' => $this->device_type,
            'ip_address' => $this->ip_address,
            'status' => $this->status,
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
            // Include the farm object only when the relationship is loaded
            'farm' => new FarmResource($this->whenLoaded('farm')),
        ];
    }
}
