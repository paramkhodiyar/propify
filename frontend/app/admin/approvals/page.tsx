'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '@/app/dashboard/layout';
import { Check, X, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import Loading from '@/components/loader';

interface PendingUser {
    id: number;
    name: string;
    email: string;
    aadharNumber: string;
    upgradeRequested: boolean;
}

interface PendingListing {
    id: number;
    title: string;
    location: string;
    price: number;
    user: {
        name: string;
        email: string;
    };
    createdAt: string;
}

export default function AdminApprovalsPage() {

    const [users, setUsers] = useState<PendingUser[]>([]);
    const [listings, setListings] = useState<PendingListing[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<number | null>(null);

    const fetchData = async () => {
        try {
            const [usersRes, listingsRes] = await Promise.all([
                api.get('/admin/pending-users'),
                api.get('/admin/pending-listings')
            ]);
            setUsers(usersRes.data);
            setListings(listingsRes.data);
        } catch (error) {
            console.error("Error fetching admin data", error);
            toast.error("Failed to load pending approvals");

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleUserAction = async (id: number, action: 'approve' | 'reject') => {
        setActionLoading(id);
        try {
            await api.post(`/admin/users/${id}/${action}`);
            toast.success(`User ${action}d successfully`);
            setUsers(prev => prev.filter(u => u.id !== id));
        } catch (error) {
            toast.error(`Failed to ${action} user`);
        } finally {
            setActionLoading(null);
        }
    };

    const handleListingAction = async (id: number, action: 'approve' | 'reject') => {
        setActionLoading(id);
        try {
            await api.post(`/admin/listings/${id}/${action}`);
            toast.success(`Listing ${action}d successfully`);
            setListings(prev => prev.filter(l => l.id !== id));
        } catch (error) {
            toast.error(`Failed to ${action} listing`);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
                    <Loading />
                </div>
            </DashboardLayout>
        )
    }

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>

                {/* Users Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                        <h2 className="font-semibold text-gray-900">Seller Upgrade Requests</h2>
                    </div>
                    {users.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No pending user upgrades</div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {users.map(user => (
                                <div key={user.id} className="p-6 flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium text-gray-900">{user.name}</h3>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                        <div className="mt-1 text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded inline-block">
                                            Aadhar: {user.aadharNumber}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleUserAction(user.id, 'approve')}
                                            disabled={!!actionLoading}
                                            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                                            title="Approve"
                                        >
                                            {actionLoading === user.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                                        </button>
                                        <button
                                            onClick={() => handleUserAction(user.id, 'reject')}
                                            disabled={!!actionLoading}
                                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                            title="Reject"
                                        >
                                            {actionLoading === user.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <X className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Listings Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                        <h2 className="font-semibold text-gray-900">Property Listing Approvals</h2>
                    </div>
                    {listings.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No pending listings</div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {listings.map(listing => (
                                <div key={listing.id} className="p-6 flex items-center justify-between">
                                    <div>
                                        <h3 className="font-medium text-gray-900">{listing.title}</h3>
                                        <p className="text-sm text-gray-500">{listing.location} • ₹{listing.price.toLocaleString()}</p>
                                        <p className="text-xs text-gray-400 mt-1">Posted by {listing.user.name}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleListingAction(listing.id, 'approve')}
                                            disabled={!!actionLoading}
                                            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                                            title="Approve"
                                        >
                                            <Check className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleListingAction(listing.id, 'reject')}
                                            disabled={!!actionLoading}
                                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                            title="Reject"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </DashboardLayout>
    );
}
