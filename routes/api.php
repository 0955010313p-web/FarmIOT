
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// --- Import Controllers ---
// Auth & Dashboard
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\DashboardController;

// API Resource Controllers (Our New Controllers)
use App\Http\Controllers\Api\UsersController;
use App\Http\Controllers\Api\FarmsController;
use App\Http\Controllers\Api\IotDevicesController;
use App\Http\Controllers\Api\SensorDataController;
use App\Http\Controllers\Api\ActuatorCommandsController;
use App\Http\Controllers\Api\AutoRulesController;
use App\Http\Controllers\Api\UserRolesController;
use App\Http\Controllers\Api\SensorTypesController;
use App\Http\Controllers\Api\FarmCategoriesController;
use App\Http\Controllers\Api\UserFarmsController;
use App\Http\Controllers\Api\MqttProxyController;
use App\Http\Controllers\FeedingLogController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// --- 1. Public Authentication Endpoints ---
Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('register', [AuthController::class, 'register']);
});

// --- 2. Protected API Endpoints (Requires Authentication) ---
Route::middleware('auth:api')->group(function () {
    
    // Auth-related
    Route::prefix('auth')->group(function() {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);
    });

    // Dashboard
    Route::get('/dashboard/stats', [DashboardController::class, 'getStats']);

    // --- Standard REST API Resources ---
    Route::apiResource('users', UsersController::class);
    Route::apiResource('farms', FarmsController::class);
    Route::apiResource('iot-devices', IotDevicesController::class);
    Route::apiResource('sensor-data', SensorDataController::class);
    Route::apiResource('actuator-commands', ActuatorCommandsController::class);
    Route::apiResource('auto-rules', AutoRulesController::class);
    Route::apiResource('user-roles', UserRolesController::class);
    Route::apiResource('sensor-types', SensorTypesController::class);
    Route::apiResource('farm-categories', FarmCategoriesController::class);
    Route::apiResource('user-farms', UserFarmsController::class);
    
    // MQTT publish via backend TCP (no WS required)
    Route::post('mqtt/publish', [MqttProxyController::class, 'publish']);
    
    // Feeding Logs
    Route::get('feeding-logs', [FeedingLogController::class, 'index']);
    Route::post('feeding-logs', [FeedingLogController::class, 'store']);
    Route::get('feeding-logs/latest', [FeedingLogController::class, 'latest']);
    Route::get('feeding-logs/status', [FeedingLogController::class, 'status']);
});
