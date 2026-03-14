import { useEffect, useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Toast from '@/Components/Toast';
import ModernButton from '@/Components/ModernButton';
import ModernCard, { ModernCardHeader, ModernCardBody } from '@/Components/ModernCard';
import StarryBackground from '@/Components/StarryBackground';
import { Head, Link } from '@inertiajs/react';
import apiClient from '@/apiClient';

export default function Login({ status, canResetPassword }) {
    const [data, setData] = useState({ email: '', password: '', remember: false });
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [statusMsg, setStatusMsg] = useState(status);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        return () => {
            setData(prev => ({ ...prev, password: '' }));
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        setProcessing(true);
        setErrors({});

        // Basic client-side validation (UX)
        const nextErrors = {};
        const email = (data.email || '').trim();
        if (!email) {
            nextErrors.email = ['กรุณากรอกอีเมล'];
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            nextErrors.email = ['รูปแบบอีเมลไม่ถูกต้อง'];
        }
        if (!data.password || String(data.password).length < 6) {
            nextErrors.password = ['รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'];
        }
        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors);
            setProcessing(false);
            return;
        }

        apiClient.post('/auth/login', {
            email: data.email,
            password: data.password,
        }).then(res => {
            const { access_token, user } = res.data;
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('user', JSON.stringify(user));
            setToast({ message: `ยินดีต้อนรับ ${user.name}! กำลังเข้าสู่ระบบ...`, type: 'success' });
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1000);
        }).catch(err => {
            if (err.response && err.response.status === 422) {
                const apiErrors = err.response.data?.errors ?? err.response.data;
                setErrors(apiErrors || {});
                setToast({ message: 'กรุณาตรวจสอบข้อมูลที่กรอก', type: 'error' });
            } else if (err.response && err.response.status === 401) {
                setStatusMsg('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
                setToast({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง', type: 'error' });
            } else {
                setStatusMsg('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
                setToast({ message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ', type: 'error' });
            }
        }).finally(() => setProcessing(false));
    };

    return (
        <StarryBackground>
            <Head title="Sign In - FarmIOT" />

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="min-h-screen flex items-center justify-center px-4">
                <ModernCard variant="cosmicGlass" className="w-full max-w-md">
                    <ModernCardHeader className="text-center pb-6">
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                FarmIOT
                            </h1>
                            <p className="text-gray-300 text-center mt-2">Welcome back to the universe of smart farming</p>
                        </div>
                        
                        {statusMsg && (
                            <div className="mb-4 p-3 bg-green-500/20 border border-green-400/30 rounded-lg">
                                <p className="text-green-300 text-sm text-center">{statusMsg}</p>
                            </div>
                        )}
                    </ModernCardHeader>

                    <ModernCardBody>
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel htmlFor="email" value="Email" className="text-purple-300" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full bg-gray-800/50 border-purple-400/30 text-purple-100 placeholder-purple-400/50 focus:border-purple-400 focus:ring-purple-400/20"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) => setData(prev => ({ ...prev, email: e.target.value }))}
                                    placeholder="Enter your email"
                                    required
                                />
                                <InputError message={errors.email && errors.email[0]} className="mt-2 text-pink-400" />
                            </div>

                            <div>
                                <InputLabel htmlFor="password" value="Password" className="text-purple-300" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full bg-gray-800/50 border-purple-400/30 text-purple-100 placeholder-purple-400/50 focus:border-purple-400 focus:ring-purple-400/20"
                                    autoComplete="current-password"
                                    onChange={(e) => setData(prev => ({ ...prev, password: e.target.value }))}
                                    showPasswordToggle={true}
                                    placeholder="Enter your password"
                                    required
                                />
                                <InputError message={errors.password && errors.password[0]} className="mt-2 text-pink-400" />
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <Checkbox 
                                        name="remember" 
                                        checked={data.remember}
                                        onChange={(e) => setData(prev => ({ ...prev, remember: e.target.checked }))}
                                        className="border-purple-400/30 text-purple-400 focus:ring-purple-400/20"
                                    />
                                    <span className="ml-2 text-sm text-gray-300">Remember me</span>
                                </label>

                                {canResetPassword && (
                                    <Link
                                        href="/forgot-password"
                                        className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                                    >
                                        Forgot password?
                                    </Link>
                                )}
                            </div>

                            <div className="space-y-3">
                                <ModernButton 
                                    variant="cosmic" 
                                    size="lg" 
                                    disabled={processing}
                                    className="w-full"
                                    type="submit"
                                >
                                    {processing ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Signing in...
                                        </span>
                                    ) : 'Sign In'}
                                </ModernButton>

                                <Link
                                    href="/register"
                                    className="block text-center"
                                >
                                    <ModernButton 
                                        variant="cosmicOutline" 
                                        size="lg" 
                                        className="w-full"
                                    >
                                        Create Account
                                    </ModernButton>
                                </Link>
                            </div>
                        </form>
                    </ModernCardBody>
                </ModernCard>
            </div>
        </StarryBackground>
    );
}
