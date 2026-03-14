<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UserRole;
use Illuminate\Support\Facades\Validator;

class UserRolesController extends Controller
{
    public function index()
    {
        return response()->json(UserRole::paginate(50));
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:user_roles,name',
            'description' => 'nullable|string',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        $role = UserRole::create($validator->validated());
        return response()->json($role, 201);
    }

    public function show(UserRole $userRole)
    {
        return response()->json($userRole);
    }

    public function update(Request $request, UserRole $userRole)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255|unique:user_roles,name,' . $userRole->id,
            'description' => 'sometimes|nullable|string',
        ]);
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }
        $userRole->update($validator->validated());
        return response()->json($userRole);
    }

    public function destroy(UserRole $userRole)
    {
        $userRole->delete();
        return response()->json(['message' => 'Role deleted'], 200);
    }
}
