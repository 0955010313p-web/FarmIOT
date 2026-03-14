import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-purple-400 text-purple-100 focus:border-purple-300'
                    : 'border-transparent text-purple-300 hover:border-purple-400/50 hover:text-purple-100 focus:border-purple-400/50 focus:text-purple-100') +
                className
            }
        >
            {children}
        </Link>
    );
}
