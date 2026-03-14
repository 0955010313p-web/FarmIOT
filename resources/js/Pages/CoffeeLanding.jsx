import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import ModernButton from '@/Components/ModernButton';

export default function CoffeeLanding() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <Head title="FarmIOT - Smart Farming Solutions" />
            
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
                
                {/* Navigation */}
                <nav className="fixed top-0 w-full z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                                        FarmIOT
                                    </h1>
                                </div>
                                <div className="hidden md:block ml-10">
                                    <div className="flex items-baseline space-x-8">
                                        <a href="#features" className="text-gray-300 hover:text-amber-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                            Features
                                        </a>
                                        <a href="#how-it-works" className="text-gray-300 hover:text-amber-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                            How It Works
                                        </a>
                                        <a href="#pricing" className="text-gray-300 hover:text-amber-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                            Pricing
                                        </a>
                                        <a href="#contact" className="text-gray-300 hover:text-amber-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                            Contact
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="hidden md:block">
                                <div className="ml-4 flex items-center md:ml-6 space-x-4">
                                    <Link 
                                        href="/login"
                                        className="text-gray-300 hover:text-amber-400 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        Sign In
                                    </Link>
                                    <ModernButton 
                                        variant="coffee" 
                                        size="sm"
                                        onClick={() => window.location.href = '/register'}
                                    >
                                        Get Started
                                    </ModernButton>
                                </div>
                            </div>
                            <div className="md:hidden">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="text-gray-300 hover:text-amber-400 p-2 rounded-md"
                                >
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        {isMenuOpen ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                        )}
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Mobile menu */}
                    {isMenuOpen && (
                        <div className="md:hidden bg-gray-800/95 backdrop-blur-md">
                            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                                <a href="#features" className="text-gray-300 hover:text-amber-400 block px-3 py-2 rounded-md text-base font-medium">
                                    Features
                                </a>
                                <a href="#how-it-works" className="text-gray-300 hover:text-amber-400 block px-3 py-2 rounded-md text-base font-medium">
                                    How It Works
                                </a>
                                <a href="#pricing" className="text-gray-300 hover:text-amber-400 block px-3 py-2 rounded-md text-base font-medium">
                                    Pricing
                                </a>
                                <a href="#contact" className="text-gray-300 hover:text-amber-400 block px-3 py-2 rounded-md text-base font-medium">
                                    Contact
                                </a>
                                <div className="pt-4 pb-3 border-t border-gray-700">
                                    <div className="flex items-center px-3 space-x-3">
                                        <Link 
                                            href="/login"
                                            className="text-gray-300 hover:text-amber-400 block px-3 py-2 rounded-md text-base font-medium"
                                        >
                                            Sign In
                                        </Link>
                                        <ModernButton 
                                            variant="coffee" 
                                            size="sm"
                                            onClick={() => window.location.href = '/register'}
                                        >
                                            Get Started
                                        </ModernButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </nav>

                {/* Hero Section */}
                <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center">
                            <h1 className="text-4xl md:text-6xl font-bold mb-6">
                                <span className="block text-white mb-2">Smart Farming</span>
                                <span className="block bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                                    Made Simple
                                </span>
                            </h1>
                            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                                Transform your farm with intelligent IoT solutions. Monitor sensors, control devices, and automate feeding schedules—all from one beautiful dashboard.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <ModernButton 
                                    variant="coffee" 
                                    size="lg"
                                    onClick={() => window.location.href = '/register'}
                                    className="text-lg px-8 py-4"
                                >
                                    Start Free Trial
                                </ModernButton>
                                <ModernButton 
                                    variant="outline" 
                                    size="lg"
                                    onClick={() => document.getElementById('demo-video').scrollIntoView({ behavior: 'smooth' })}
                                    className="text-lg px-8 py-4 border-gray-600 text-white hover:bg-gray-800"
                                >
                                    Watch Demo
                                </ModernButton>
                            </div>
                        </div>
                        
                        {/* Hero Image/Visual */}
                        <div className="mt-16 relative">
                            <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/10 rounded-2xl p-8 border border-amber-500/20">
                                <div className="aspect-video bg-gray-800/50 rounded-xl flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full flex items-center justify-center">
                                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-semibold text-amber-400 mb-2">Live Dashboard Preview</h3>
                                        <p className="text-gray-400">Real-time monitoring and control</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/50">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Powerful Features for Modern Farms
                            </h2>
                            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                                Everything you need to manage your farm efficiently and increase productivity.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-amber-500/30 transition-colors">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">Real-time Monitoring</h3>
                                <p className="text-gray-300">
                                    Track temperature, humidity, and soil moisture levels with live data updates and beautiful charts.
                                </p>
                            </div>
                            
                            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-amber-500/30 transition-colors">
                                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">Smart Device Control</h3>
                                <p className="text-gray-300">
                                    Control actuators and feeding systems remotely with instant feedback and scheduling capabilities.
                                </p>
                            </div>
                            
                            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-amber-500/30 transition-colors">
                                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">Automated Feeding</h3>
                                <p className="text-gray-300">
                                    Set up feeding schedules with smart notifications and prevent over-feeding with our intelligent system.
                                </p>
                            </div>
                            
                            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-amber-500/30 transition-colors">
                                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">Data Analytics</h3>
                                <p className="text-gray-300">
                                    Analyze historical data trends and make informed decisions with comprehensive reporting tools.
                                </p>
                            </div>
                            
                            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-amber-500/30 transition-colors">
                                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19l5-5m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">Alert System</h3>
                                <p className="text-gray-300">
                                    Receive instant notifications about important events and system status updates.
                                </p>
                            </div>
                            
                            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-amber-500/30 transition-colors">
                                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">Secure & Reliable</h3>
                                <p className="text-gray-300">
                                    Enterprise-grade security with encrypted data transmission and 99.9% uptime guarantee.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                How FarmIOT Works
                            </h2>
                            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                                Get started in minutes with our simple setup process.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl font-bold text-white">1</span>
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">Sign Up</h3>
                                <p className="text-gray-300">
                                    Create your free account and set up your farm profile in minutes.
                                </p>
                            </div>
                            
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl font-bold text-white">2</span>
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">Connect Devices</h3>
                                <p className="text-gray-300">
                                    Add your IoT sensors and actuators through our intuitive interface.
                                </p>
                            </div>
                            
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl font-bold text-white">3</span>
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">Configure</h3>
                                <p className="text-gray-300">
                                    Set up automation rules and feeding schedules for your farm.
                                </p>
                            </div>
                            
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-2xl font-bold text-white">4</span>
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">Monitor & Control</h3>
                                <p className="text-gray-300">
                                    Watch your farm thrive with real-time monitoring and remote control.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-amber-600/20 to-amber-700/20">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Ready to Transform Your Farm?
                        </h2>
                        <p className="text-xl text-gray-300 mb-8">
                            Join thousands of farmers who are already using FarmIOT to increase productivity and reduce costs.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <ModernButton 
                                variant="coffee" 
                                size="lg"
                                onClick={() => window.location.href = '/register'}
                                className="text-lg px-8 py-4"
                            >
                                Start Free Trial
                            </ModernButton>
                            <ModernButton 
                                variant="outline" 
                                size="lg"
                                onClick={() => window.location.href = '/login'}
                                className="text-lg px-8 py-4 border-gray-600 text-white hover:bg-gray-800"
                            >
                                Sign In
                            </ModernButton>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div>
                                <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent mb-4">
                                    FarmIOT
                                </h3>
                                <p className="text-gray-300">
                                    Smart farming solutions for modern agriculture.
                                </p>
                            </div>
                            
                            <div>
                                <h4 className="text-lg font-semibold text-white mb-4">Product</h4>
                                <ul className="space-y-2">
                                    <li><a href="#features" className="text-gray-300 hover:text-amber-400">Features</a></li>
                                    <li><a href="#pricing" className="text-gray-300 hover:text-amber-400">Pricing</a></li>
                                    <li><a href="#how-it-works" className="text-gray-300 hover:text-amber-400">How It Works</a></li>
                                </ul>
                            </div>
                            
                            <div>
                                <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
                                <ul className="space-y-2">
                                    <li><a href="#about" className="text-gray-300 hover:text-amber-400">About Us</a></li>
                                    <li><a href="#contact" className="text-gray-300 hover:text-amber-400">Contact</a></li>
                                    <li><a href="#blog" className="text-gray-300 hover:text-amber-400">Blog</a></li>
                                </ul>
                            </div>
                            
                            <div>
                                <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
                                <ul className="space-y-2">
                                    <li><a href="#help" className="text-gray-300 hover:text-amber-400">Help Center</a></li>
                                    <li><a href="#docs" className="text-gray-300 hover:text-amber-400">Documentation</a></li>
                                    <li><a href="#api" className="text-gray-300 hover:text-amber-400">API</a></li>
                                </ul>
                            </div>
                        </div>
                        
                        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
                            <p className="text-gray-400">
                                © 2024 FarmIOT. All rights reserved. Built with ❤️ for farmers.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
