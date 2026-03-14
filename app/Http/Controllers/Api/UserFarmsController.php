<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\UserFarm;
use Illuminate\Support\Facades\Validator;

class UserFarmsController extends Controller
{
    public function index(Request $request)
    {
        $q = UserFarm::query();
        if ($request->has('user_id')) {
            $q->where('user_id', $request->user_id);
        }
        if ($request->has('farm_id')) {
            $q->where('farm_id', $request->farm_id);
        }
        return response()->json($q->paginate(50));
    }

    public function store(Request $request)
    {
        $v = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'farm_id' => 'required|exists:farms,id',
        ]);
        if ($v->fails()) {
            return response()->json($v->errors(), 422);
        }
        $link = UserFarm::firstOrCreate($v->validated());
        return response()->json($link, 201);
    }

    public function show(UserFarm $userFarm)
    {
        return response()->json($userFarm);
    }

    public function update(Request $request, UserFarm $userFarm)
    {
        $v = Validator::make($request->all(), [
            'user_id' => 'sometimes|required|exists:users,id',
            'farm_id' => 'sometimes|required|exists:farms,id',
        ]);
        if ($v->fails()) {
            return response()->json($v->errors(), 422);
        }
        $userFarm->update($v->validated());
        return response()->json($userFarm);
    }

    public function destroy(UserFarm $userFarm)
    {
        $userFarm->delete();
        return response()->json(['message' => 'Deleted'], 200);
    }
}
