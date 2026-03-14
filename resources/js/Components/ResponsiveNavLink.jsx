import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`flex w-full items-start border-l-4 py-2 pe-4 ps-3 ${
                active
                    ? 'border-purple-400 bg-purple-500/20 text-purple-100 focus:border-purple-300 focus:bg-purple-500/30 focus:text-purple-100'
                    : 'border-transparent text-purple-300 hover:border-purple-400/50 hover:bg-purple-500/10 hover:text-purple-100 focus:border-purple-400/50 focus:bg-purple-500/10 focus:text-purple-100'
            } text-base font-medium transition duration-150 ease-in-out focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}
