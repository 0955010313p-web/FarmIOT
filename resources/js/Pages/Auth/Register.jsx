import { useEffect, useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import ModernButton from '@/Components/ModernButton';
import ModernCard, { ModernCardHeader, ModernCardBody } from '@/Components/ModernCard';
import StarryBackground from '@/Components/StarryBackground';
import { Head, Link } from '@inertiajs/react';
import apiClient from '@/apiClient';

export default function Register() {
    const [data, setData] = useState({
        username: '',
        firstname: '',
        lastname: '',
        email: '',
        tel: '',
        password: '',
        password_confirmation: ''
    });
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        return () => {
            setData(prev => ({ ...prev, password: '', password_confirmation: '' }));
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        setProcessing(true);
        setErrors({});

        // Basic client-side validation (UX)
        const nextErrors = {};
        const tel = (data.tel || '').trim();
        const email = (data.email || '').trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            nextErrors.email = ['รูปแบบอีเมลไม่ถูกต้อง'];
        }
        // Thai phone numbers are commonly 9-10 digits; allow leading +
        if (!tel) {
            nextErrors.tel = ['กรุณากรอกเบอร์โทร'];
        } else if (!/^\+?\d{9,12}$/.test(tel.replace(/[\s-]/g, ''))) {
            nextErrors.tel = ['รูปแบบเบอร์โทรไม่ถูกต้อง (ตัวเลข 9-12 หลัก)'];
        }
        if (!data.password || String(data.password).length < 6) {
            nextErrors.password = ['รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'];
        }
        if (data.password !== data.password_confirmation) {
            nextErrors.password_confirmation = ['รหัสผ่านยืนยันไม่ตรงกัน'];
        }
        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            setProcessing(false);
            return;
        }

        apiClient.post('/auth/register', data).then(res => {
            const { access_token, user } = res.data;
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('user', JSON.stringify(user));
            window.location.href = '/dashboard';
        }).catch(err => {
            if (err.response && err.response.status === 422) {
                const apiErrors = err.response.data?.errors ?? err.response.data;
                setErrors(apiErrors || {});
            }
        }).finally(() => setProcessing(false));
    };

    return (
        <StarryBackground>
            <Head title="Register - FarmIOT" />

            <div className="min-h-screen flex items-center justify-center px-4 py-8">
                <ModernCard variant="cosmicGlass" className="w-full max-w-2xl">
                    <ModernCardHeader className="text-center pb-6">
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                FarmIOT
                            </h1>
                            <p className="text-gray-300 text-center mt-2">Join the universe of smart farming</p>
                        </div>
                    </ModernCardHeader>

                    <ModernCardBody>
                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="username" value="Username" className="text-purple-300" />
                                    <TextInput 
                                        id="username" 
                                        name="username" 
                                        value={data.username} 
                                        className="mt-1 block w-full bg-gray-800/50 border-purple-400/30 text-purple-100 placeholder-purple-400/50 focus:border-purple-400 focus:ring-purple-400/20" 
                                        autoComplete="off" 
                                        isFocused={true} 
                                        onChange={(e) => setData(prev => ({ ...prev, username: e.target.value }))} 
                                        placeholder="Choose a username"
                                        required 
                                    />
                                    <InputError message={errors.username && errors.username[0]} className="mt-2 text-pink-400" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="email" value="Email" className="text-purple-300" />
                                    <TextInput 
                                        id="email" 
                                        type="email" 
                                        name="email" 
                                        value={data.email} 
                                        className="mt-1 block w-full bg-gray-800/50 border-purple-400/30 text-purple-100 placeholder-purple-400/50 focus:border-purple-400 focus:ring-purple-400/20" 
                                        autoComplete="username" 
                                        onChange={(e) => setData(prev => ({ ...prev, email: e.target.value }))} 
                                        placeholder="Enter your email"
                                        required 
                                    />
                                    <InputError message={errors.email && errors.email[0]} className="mt-2 text-pink-400" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="firstname" value="First name" className="text-purple-300" />
                                    <TextInput 
                                        id="firstname" 
                                        name="firstname" 
                                        value={data.firstname} 
                                        className="mt-1 block w-full bg-gray-800/50 border-purple-400/30 text-purple-100 placeholder-purple-400/50 focus:border-purple-400 focus:ring-purple-400/20" 
                                        autoComplete="given-name" 
                                        onChange={(e) => setData(prev => ({ ...prev, firstname: e.target.value }))} 
                                        placeholder="First name"
                                        required 
                                    />
                                    <InputError message={errors.firstname && errors.firstname[0]} className="mt-2 text-pink-400" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="lastname" value="Last name" className="text-purple-300" />
                                    <TextInput 
                                        id="lastname" 
                                        name="lastname" 
                                        value={data.lastname} 
                                        className="mt-1 block w-full bg-gray-800/50 border-purple-400/30 text-purple-100 placeholder-purple-400/50 focus:border-purple-400 focus:ring-purple-400/20" 
                                        autoComplete="family-name" 
                                        onChange={(e) => setData(prev => ({ ...prev, lastname: e.target.value }))} 
                                        placeholder="Last name"
                                        required 
                                    />
                                    <InputError message={errors.lastname && errors.lastname[0]} className="mt-2 text-pink-400" />
                                </div>
                                <div className="md:col-span-2">
                                    <InputLabel htmlFor="tel" value="Phone" className="text-purple-300" />
                                    <TextInput 
                                        id="tel" 
                                        name="tel" 
                                        value={data.tel} 
                                        className="mt-1 block w-full bg-gray-800/50 border-purple-400/30 text-purple-100 placeholder-purple-400/50 focus:border-purple-400 focus:ring-purple-400/20" 
                                        autoComplete="tel" 
                                        onChange={(e) => setData(prev => ({ ...prev, tel: e.target.value }))} 
                                        placeholder="Phone number"
                                        required 
                                    />
                                    <InputError message={errors.tel && errors.tel[0]} className="mt-2 text-pink-400" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="password" value="Password" className="text-purple-300" />
                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="mt-1 block w-full bg-gray-800/50 border-purple-400/30 text-purple-100 placeholder-purple-400/50 focus:border-purple-400 focus:ring-purple-400/20"
                                        autoComplete="new-password"
                                        onChange={(e) => setData(prev => ({ ...prev, password: e.target.value }))}
                                        showPasswordToggle={true}
                                        placeholder="Create a password"
                                        required
                                    />
                                    <InputError message={errors.password && errors.password[0]} className="mt-2 text-pink-400" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" className="text-purple-300" />
                                    <TextInput
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className="mt-1 block w-full bg-gray-800/50 border-purple-400/30 text-purple-100 placeholder-purple-400/50 focus:border-purple-400 focus:ring-purple-400/20"
                                        autoComplete="new-password"
                                        onChange={(e) => setData(prev => ({ ...prev, password_confirmation: e.target.value }))}
                                        showPasswordToggle={true}
                                        placeholder="Confirm your password"
                                        required
                                    />
                                    <InputError message={errors.password_confirmation && errors.password_confirmation[0]} className="mt-2 text-pink-400" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4">
                                <Link
                                    href="/login"
                                    className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                                >
                                    Already registered? Sign in
                                </Link>

                                <ModernButton 
                                    variant="cosmic" 
                                    size="lg" 
                                    disabled={processing}
                                    type="submit"
                                >
                                    {processing ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Creating Account...
                                        </span>
                                    ) : 'Create Account'}
                                </ModernButton>
                            </div>
                        </form>
                    </ModernCardBody>
                </ModernCard>
            </div>
        </StarryBackground>
    );
}
