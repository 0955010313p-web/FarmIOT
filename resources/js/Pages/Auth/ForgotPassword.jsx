import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import ModernButton from '@/Components/ModernButton';
import ModernCard, { ModernCardHeader, ModernCardBody } from '@/Components/ModernCard';
import StarryBackground from '@/Components/StarryBackground';
import InputLabel from '@/Components/InputLabel';
import { Head, useForm, Link } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <StarryBackground>
            <Head title="Forgot Password - FarmIOT" />

            <div className="min-h-screen flex items-center justify-center px-4">
                <ModernCard variant="cosmicGlass" className="w-full max-w-md">
                    <ModernCardHeader className="text-center pb-6">
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                FarmIOT
                            </h1>
                            <p className="text-gray-300 text-center mt-2">Reset your password in the universe</p>
                        </div>
                        
                        <div className="text-center text-gray-300 text-sm">
                            Forgot your password? No problem. Just let us know your email
                            address and we will email you a password reset link that will
                            allow you to choose a new one.
                        </div>
                        
                        {status && (
                            <div className="mt-4 p-3 bg-green-500/20 border border-green-400/30 rounded-lg">
                                <p className="text-green-300 text-sm text-center">{status}</p>
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
                                    isFocused={true}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Enter your email"
                                />
                                <InputError message={errors.email} className="mt-2 text-pink-400" />
                            </div>

                            <div className="flex items-center justify-between pt-4">
                                <Link
                                    href="/login"
                                    className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                                >
                                    Remember your password? Sign in
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
                                            Sending...
                                        </span>
                                    ) : 'Email Reset Link'}
                                </ModernButton>
                            </div>
                        </form>
                    </ModernCardBody>
                </ModernCard>
            </div>
        </StarryBackground>
    );
}
