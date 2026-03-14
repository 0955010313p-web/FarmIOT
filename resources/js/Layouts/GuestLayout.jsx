import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-black pt-6 sm:justify-center sm:pt-0">
            <div>
                <Link href="/">
                    <ApplicationLogo className="h-20 w-20 fill-current text-purple-400" />
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-gray-900/80 backdrop-blur-md border border-purple-400/30 px-6 py-4 shadow-lg shadow-purple-500/10 sm:max-w-md sm:rounded-xl">
                {children}
            </div>
        </div>
    );
}
