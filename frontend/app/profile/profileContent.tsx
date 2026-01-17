'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import Loading from '@/components/loader';
import DashboardLayout from '@/app/dashboard/layout';
import { User, Shield, BadgeCheck, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { useSearchParams, useRouter, redirect } from 'next/navigation';

export default function ProfileContent() {
    const { user, loading } = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'details');
    const [aadhar, setAadhar] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);


    useEffect(() => {
        if (searchParams.get('tab')) {
            setActiveTab(searchParams.get('tab') as string);
        }
    }, [searchParams]);

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <Loading />
        </div>
    );
    if (!user) return (
        toast.error("Please login to access your profile"),
        redirect("/login")
    );

    const handleUpgradeRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post(`/users/${user.id}/upgrade`, { aadharNumber: aadhar });

            toast.success("Request Submitted. Your upgrade request is pending admin approval.");
            router.refresh();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Request Failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h1>

                <div className="flex space-x-4 border-b border-gray-200 mb-6">
                    <button
                        onClick={() => setActiveTab('details')}
                        className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 ${activeTab === 'details'
                            ? 'border-amber-600 text-amber-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Personal Details
                    </button>
                    {user.role === 'user' && (
                        <button
                            onClick={() => setActiveTab('upgrade')}
                            className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 ${activeTab === 'upgrade'
                                ? 'border-amber-600 text-amber-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Become a Seller
                        </button>
                    )}
                </div>

                {activeTab === 'details' && (
                    <div className="space-y-6 max-w-xl">
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="h-20 w-20 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 text-2xl font-bold">
                                {user.avatar
                                    ? <img src={user.avatar} className="h-full w-full rounded-full object-cover" />
                                    : (user.name || 'U').charAt(0).toUpperCase()
                                }

                            </div>
                            <div>
                                <h3 className="font-semibold text-lg text-gray-900">{user.name}</h3>
                                <p className="text-gray-500">{user.email}</p>
                                <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                                    {user.role}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Display Name</label>
                                <div className="mt-1 p-3 bg-gray-50 rounded-md border border-gray-200 text-gray-900">
                                    {user.name}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                                <div className="mt-1 p-3 bg-gray-50 rounded-md border border-gray-200 text-gray-900">
                                    {user.email}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'upgrade' && user.role === 'user' && (
                    <div className="max-w-xl space-y-6">
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-3">
                            <Shield className="w-5 h-5 text-amber-600 mt-0.5" />
                            <div>
                                <h3 className="text-sm font-semibold text-amber-900">Why verify?</h3>
                                <p className="text-sm text-amber-800 mt-1">
                                    Verified sellers get a badge, higher visibility, and access to post unlimited property listings.
                                </p>
                            </div>
                        </div>

                        {user.upgradeRequested ? (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                                    <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
                                </div>
                                <h3 className="text-lg font-medium text-blue-900">Verification In Progress</h3>
                                <p className="text-blue-700 mt-2">
                                    Your request has been submitted and is pending admin approval. This usually takes 24-48 hours.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleUpgradeRequest} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Aadhar Number
                                    </label>
                                    <input
                                        type="text"
                                        value={aadhar}
                                        onChange={(e) => setAadhar(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                                        placeholder="XXXX XXXX XXXX"
                                        required
                                        pattern="[0-9]{12}"
                                        title="Please enter a valid 12-digit Aadhar number"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Enter your 12-digit Unique Identification Number.
                                    </p>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
                                    >
                                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <BadgeCheck className="w-4 h-4 mr-2" />}
                                        Submit for Verification
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

