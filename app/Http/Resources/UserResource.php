<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            'name' => $this->name, // accessor combines firstname + lastname or fallback
            'username' => $this->username,
            'firstname' => $this->firstname,
            'lastname' => $this->lastname,
            'tel' => $this->tel,
            'email' => $this->email,
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
            // Include the collection of farms only when the relationship is loaded
            'farms' => FarmResource::collection($this->whenLoaded('farms')),
        ];
    }
}
