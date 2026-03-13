<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if the user is authenticated and has the admin role.
        // Note: The role check logic depends on your User model and database structure.
        // Here, we assume the User model has a relationship `role` 
        // and the role's name is 'Admin'.
        if (Auth::check() && Auth::user()->user_role_id == 1) {
            return $next($request);
        }

        // If not an admin, return a 403 Forbidden response.
        return response()->json(['message' => 'Forbidden: Requires admin privileges.'], 403);
    }
}
