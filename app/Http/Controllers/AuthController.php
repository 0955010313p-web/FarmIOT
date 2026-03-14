<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Http\Resources\UserResource; // <-- Import the UserResource
use App\Models\UserRole;

class AuthController extends Controller
{

    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register']]);
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        if (! $token = auth('api')->attempt($validator->validated())) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        return $this->respondWithToken($token);
    }

    /**
     * Register a new user.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        $payload = $request->all();
        // Normalize common alternate field names from frontend
        $payload['firstname'] = $payload['firstname'] ?? $payload['first_name'] ?? null;
        $payload['lastname'] = $payload['lastname'] ?? $payload['last_name'] ?? null;
        $payload['tel'] = $payload['tel'] ?? $payload['phone'] ?? null;

        $validator = Validator::make($payload, [
            'username' => 'required|string|max:255|unique:users,username',
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'required|string|email|max:100|unique:users',
            'tel' => 'required|string|max:50',
            'password' => 'required|string|confirmed|min:6',
        ]);

        if($validator->fails()){
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $defaultRoleId = UserRole::where('name', 'User')->value('id')
            ?? UserRole::where('name', 'Farm Owner')->value('id')
            ?? UserRole::min('id');

        try {
            $user = User::create([
                'username' => $payload['username'],
                'firstname' => $payload['firstname'],
                'lastname' => $payload['lastname'],
                'email' => $payload['email'],
                'tel' => $payload['tel'],
                'user_role_id' => $defaultRoleId ?? 2,
                'password' => $payload['password'] // 'hashed' cast in User will hash automatically
            ]);
        } catch (\Illuminate\Database\QueryException $e) {
            return response()->json([
                'message' => 'Registration failed',
                'error' => $e->getMessage(),
            ], 422);
        }

        $token = auth('api')->login($user);

        return $this->respondWithToken($token);
    }


    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth('api')->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        $user = auth('api')->user();
        $user->load('farms'); // Eager load farms
        return new UserResource($user); // Return user through the resource
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        $user = auth('api')->user();
        $user->load('farms'); // Eager load farms

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'user' => new UserResource($user) // Embed the user object
        ]);
    }
}
