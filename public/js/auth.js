document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const errorMessageDiv = document.getElementById('error-message');

    const api = axios.create({
        baseURL: '/api/auth',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        }
    });

    const displayError = (message) => {
        errorMessageDiv.textContent = message;
        errorMessageDiv.style.display = 'block';
    };

    const clearError = () => {
        errorMessageDiv.textContent = '';
        errorMessageDiv.style.display = 'none';
    };

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearError();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await api.post('/login', { email, password });
                const { access_token } = response.data;

                // **FIXED**: Use the correct key 'auth_token' to store the token.
                localStorage.setItem('auth_token', access_token);

                // Redirect directly to the dashboard.
                window.location.href = '/dashboard';

            } catch (error) {
                if (error.response && error.response.data) {
                    if (error.response.status === 401) {
                        displayError('Invalid email or password.');
                    } else if (error.response.data.errors) {
                        const errors = Object.values(error.response.data.errors).flat().join(' ');
                        displayError(errors);
                    } else {
                        displayError('An unexpected error occurred. Please try again.');
                    }
                } else {
                    displayError('Could not connect to the server. Please check your network.');
                }
                console.error('Login error:', error);
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            clearError();

            const username = document.getElementById('username').value;
            const firstname = document.getElementById('firstname').value;
            const email = document.getElementById('email').value;
            const tel = document.getElementById('tel').value;
            const password = document.getElementById('password').value;
            const password_confirmation = document.getElementById('password_confirmation').value;
            const admin_secret_code = document.getElementById('admin_secret_code').value;

            if (password !== password_confirmation) {
                displayError('Passwords do not match.');
                return;
            }

            try {
                const payload = {
                    username,
                    firstname,
                    email,
                    tel,
                    password,
                    password_confirmation
                };

                if (admin_secret_code) {
                    payload.admin_secret_code = admin_secret_code;
                }

                const response = await api.post('/register', payload);

                window.location.href = '/login?registered=true';

            } catch (error) {
                 if (error.response && error.response.data) {
                    const errors = error.response.data.errors || error.response.data;
                    let errorMessages = 'An unexpected error occurred. Please try again.';
                    if(typeof errors === 'object'){
                        errorMessages = Object.values(errors).flat().join(' ');
                    } else if (typeof errors === 'string') {
                        errorMessages = errors;
                    }                       
                    displayError(errorMessages);

                } else {
                    displayError('An unexpected error occurred. Please try again.');
                }
                console.error('Registration error:', error);
            }
        });
    }

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('registered')) {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Registration successful! Please log in.';
        const authForm = document.querySelector('.auth-form');
        if(authForm) {
            authForm.insertBefore(successMessage, authForm.firstChild);
        }
    }
});
