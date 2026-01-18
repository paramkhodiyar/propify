'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
    LayoutDashboard,
    User,
    Building2,
    MessageSquare,
    LogOut,
    ShieldCheck,
    FileText,
    BadgeCheck,
    SquarePen
} from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    if (!user) return null;

    const isActive = (path: string) => pathname === path;

    const commonLinks = [
        // { href: '/profile', label: 'Overview', icon: LayoutDashboard },
        { href: '/profile', label: 'My Profile', icon: User },
    ];

    const agentLinks = [
        { href: '/dashboard/my-listings', label: 'My Listings', icon: Building2 },
        { href: '/dashboard/edit-property', label: 'Edit Property', icon: SquarePen },
    ];

    const userLinks = [
        { href: '/profile/saved', label: 'Saved Properties', icon: Building2 },
    ];

    const adminLinks = [
        { href: '/admin/users', label: 'Manage Users', icon: User },
        { href: '/admin/approvals', label: 'Pending Approvals', icon: ShieldCheck },
    ];

    return (
        <div className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-64px)] flex flex-col">
            <div className="p-6">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    Menu
                </h2>
                <nav className="space-y-2">
                    {commonLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive(link.href)
                                    ? 'bg-amber-50 text-amber-600'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="px-6 py-2">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    {user.role === 'admin' ? 'Admin' : user.role === 'agent' ? 'Agent Tools' : 'My Account'}
                </h2>
                <nav className="space-y-2">
                    {user.role === 'user' && (
                        <>
                            {userLinks.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive(link.href)
                                            ? 'bg-amber-50 text-amber-600'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {link.label}
                                    </Link>
                                );
                            })}
                            {/* Upgrade Option for Users */}
                            <Link
                                href="/profile?tab=upgrade"
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive('/profile?tab=upgrade')
                                    ? 'bg-amber-50 text-amber-600'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <BadgeCheck className="w-5 h-5" />
                                Upgrade to Seller
                            </Link>
                        </>
                    )}

                    {user.role === 'agent' && agentLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive(link.href)
                                    ? 'bg-amber-50 text-amber-600'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {link.label}
                            </Link>
                        );
                    })}

                    {user.role === 'admin' && adminLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive(link.href)
                                    ? 'bg-amber-50 text-amber-600'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="mt-auto p-6 border-t border-gray-200">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 w-full transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </div>
    );
}
