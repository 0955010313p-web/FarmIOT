<?php

namespace App\Http\Controllers\Api;

use App\Models\Farm;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\FarmResource;

class FarmsController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // TODO: Authorization
        // Eager load the iotDevices relationship for efficiency
        $farms = Farm::with('iotDevices')->paginate(15);

        return FarmResource::collection($farms);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // TODO: Authorization
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'location' => 'nullable|string|max:500',
            'farm_category_id' => 'required|exists:farm_categories,id',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $validatedData = $validator->validated();
        $validatedData['user_id'] = Auth::id();

        $farm = Farm::create($validatedData);

        // Load the relationship before returning the response
        $farm->load('iotDevices');

        return response(new FarmResource($farm), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Farm $farm)
    {
        // TODO: Authorization
        // Eager load the relationship
        $farm->load('iotDevices');

        return new FarmResource($farm);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Farm $farm)
    {
        // TODO: Authorization
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'location' => 'sometimes|nullable|string|max:500',
            'farm_category_id' => 'sometimes|required|exists:farm_categories,id',
            'description' => 'sometimes|nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $farm->update($validator->validated());

        // Load the relationship before returning the response
        $farm->load('iotDevices');
        
        return new FarmResource($farm);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Farm $farm)
    {
        // TODO: Authorization
        $farm->delete();

        return response()->json(['message' => 'Farm deleted successfully'], 200);
    }
}
