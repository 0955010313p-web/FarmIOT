
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - FarmHarmony</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@^2.0/dist/tailwind.min.css" rel="stylesheet">
    <style>
        body {
            background-color: #f0f2f5;
        }
    </style>
</head>
<body class="flex items-center justify-center h-screen">

    <div class="w-full max-w-md">
        <form id="login-form" class="bg-white shadow-lg rounded-xl px-8 pt-6 pb-8 mb-4">
            <div class="mb-8 text-center">
                <h1 class="text-3xl font-bold text-gray-800">FarmHarmony</h1>
                <p class="text-gray-500">Welcome back! Please login to your account.</p>
            </div>

            <div id="error-message" class="hidden bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong class="font-bold">Error!</strong>
                <span class="block sm:inline">Invalid email or password.</span>
            </div>

            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
                    Email
                </label>
                <input class="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" id="email" type="email" placeholder="you@example.com" required>
            </div>

            <div class="mb-6">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
                    Password
                </label>
                <input class="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500" id="password" type="password" placeholder="******************" required>
            </div>

            <div class="flex items-center justify-between">
                <button id="login-button" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg w-full focus:outline-none focus:shadow-outline transition-transform transform hover:scale-105" type="submit">
                    Sign In
                </button>
            </div>
             <div class="text-center mt-6">
                <p class="text-sm text-gray-600">
                    Don't have an account? 
                    <a href="/register" class="font-bold text-blue-500 hover:text-blue-700">
                        Sign Up
                    </a>
                </p>
            </div>
        </form>
    </div>

    <script>
        document.getElementById('login-form').addEventListener('submit', async function(event) {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('error-message');
            const loginButton = document.getElementById('login-button');

            // Reset UI
            errorMessage.classList.add('hidden');
            loginButton.disabled = true;
            loginButton.textContent = 'Signing In...';

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Login failed');
                }
                
                // --- SUCCESS ---
                // Store the token and redirect
                localStorage.setItem('api_token', data.access_token);
                window.location.href = '/'; // Redirect to dashboard

            } catch (error) {
                // --- FAILURE ---
                console.error('Login Error:', error);
                errorMessage.classList.remove('hidden');
                
                // Re-enable button
                loginButton.disabled = false;
                loginButton.textContent = 'Sign In';
            }
        });
    </script>

</body>
</html>
