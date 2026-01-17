'use client';

import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
            <div className="text-center max-w-md">
                <h1 className="text-7xl font-bold text-amber-600 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    Page Not Found
                </h2>
                <p className="text-gray-600 mb-6">
                    The page you are looking for doesn&apos;t exist or has been moved.
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center px-6 py-3 rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-colors"
                >
                    Go back home
                </Link>
            </div>
        </div>
    );
}
