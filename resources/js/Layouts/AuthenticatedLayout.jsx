import { useState, useEffect } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, router } from '@inertiajs/react';
import apiClient from '@/apiClient'; // Import apiClient

// This is our new Authentication Logic Component
const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('access_token');

        if (storedUser && token) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user from localStorage", e);
                // Clear invalid data
                localStorage.removeItem('user');
                localStorage.removeItem('access_token');
            }
        } else {
            // If no token, redirect to login
            if (window.location.pathname !== '/login') {
                 window.location.href = '/login';
            }
        }
        setLoading(false);
    }, []);

    const logout = () => {
        apiClient.post('/auth/logout').finally(() => {
            localStorage.removeItem('user');
            localStorage.removeItem('access_token');
            window.location.href = '/login';
        });
    };

    return { user, logout, loading };
};

export default function AuthenticatedLayout({ header, children }) {
    const { user, logout, loading } = useAuth(); // Use our new auth hook
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    // While checking auth, show a loading state
    if (loading || !user) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <p className="text-white text-lg">Loading...</p>
            </div>
        );
    }

    // --- The rest of the layout is mostly the same, but with updated user data and logout function ---

    return (
        <div className="min-h-screen bg-black">
            <nav className="bg-gray-900/80 border-b border-purple-400/30 backdrop-blur-md sticky top-0 z-50 shadow-lg shadow-purple-500/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/dashboard">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-purple-400" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink href="/dashboard" active={window.location.pathname === '/dashboard'}>
                                    <span className="text-purple-300 hover:text-purple-100 transition-colors duration-200">Dashboard</span>
                                </NavLink>
                                <NavLink href="/farm-management" active={window.location.pathname === '/farm-management'}>
                                    <span className="text-blue-300 hover:text-blue-100 transition-colors duration-200">Farm Management</span>
                                </NavLink>
                                <NavLink href="/iot-device-management" active={window.location.pathname === '/iot-device-management'}>
                                    <span className="text-cyan-300 hover:text-cyan-100 transition-colors duration-200">IoT Devices</span>
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ms-6">
                            <div className="ms-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-purple-400/30 text-sm leading-4 font-medium rounded-md text-purple-300 bg-gray-800/50 hover:text-purple-100 hover:bg-purple-500/20 focus:outline-none focus:ring-2 focus:ring-purple-400/50 transition ease-in-out duration-150"
                                            >
                                                {user.name}

                                                <svg
                                                    className="ms-2 -me-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link as="button" onClick={logout} className="text-purple-200 hover:text-purple-100 hover:bg-purple-500/20">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Hamburger menu for mobile */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previous) => !previous)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-purple-300 hover:text-purple-100 hover:bg-purple-500/20 focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={showingNavigationDropdown ? 'hidden' : 'inline-flex'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Mobile navigation menu */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden bg-gray-900/90 backdrop-blur-md border-t border-purple-400/20'}>
                    <div className="pt-2 pb-3 space-y-1 px-4">
                        <ResponsiveNavLink href="/dashboard" active={window.location.pathname === '/dashboard'}>
                            <span className="text-purple-300">Dashboard</span>
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href="/farm-management" active={window.location.pathname === '/farm-management'}>
                            <span className="text-blue-300">Farm Management</span>
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href="/iot-device-management" active={window.location.pathname === '/iot-device-management'}>
                            <span className="text-cyan-300">IoT Devices</span>
                        </ResponsiveNavLink>
                    </div>

                    <div className="pt-4 pb-1 border-t border-purple-400/20">
                        <div className="px-4">
                            <div className="font-medium text-base text-purple-200">{user.name}</div>
                            <div className="font-medium text-sm text-purple-400">{user.email}</div>
                        </div>

                        <div className="mt-3 space-y-1 px-4">
                            <ResponsiveNavLink as="button" onClick={logout}>
                                <span className="text-purple-300">Log Out</span>
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-gray-900/50 backdrop-blur-sm border-b border-purple-400/20 shadow-lg shadow-purple-500/10">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
