'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <div className="flex flex-1 max-w-7xl mx-auto w-full">
                <div className="hidden md:block">
                    <Sidebar />
                </div>

                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>

            <Footer />
        </div>
    );
}