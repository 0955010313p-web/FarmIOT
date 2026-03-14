<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FarmCategory;
use Illuminate\Support\Facades\Validator;

class FarmCategoriesController extends Controller
{
    public function index()
    {
        return response()->json(FarmCategory::paginate(50));
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:farm_categories,name',
            'description' => 'nullable|string',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        $cat = FarmCategory::create($validator->validated());
        return response()->json($cat, 201);
    }

    public function show(FarmCategory $farmCategory)
    {
        return response()->json($farmCategory);
    }

    public function update(Request $request, FarmCategory $farmCategory)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255|unique:farm_categories,name,' . $farmCategory->id,
            'description' => 'sometimes|nullable|string',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        $farmCategory->update($validator->validated());
        return response()->json($farmCategory);
    }

    public function destroy(FarmCategory $farmCategory)
    {
        $farmCategory->delete();
        return response()->json(['message' => 'Category deleted'], 200);
    }
}
