'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Property } from '@/types/property';
import { PropertyCard } from '@/components/PropertyCard';
import Loading from '@/components/loader';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/app/dashboard/layout';

export default function SavedPropertiesPage() {
    const [savedProperties, setSavedProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        } else if (user) {
            fetchSavedProperties();
        }
    }, [user, authLoading, router]);

    const fetchSavedProperties = async () => {
        setLoading(true);
        try {
            const response = await api.get('/users/profilePosts');
            const rawListings = response.data.savedListings || [];

            const mapped: Property[] = rawListings.map((item: any) => ({
                id: item.id.toString(),
                title: item.title,
                price: item.price,
                location: item.location,
                tags: item.tags || [],
                image: item.images && item.images.length > 0 ? item.images[0] : '',
                description: item.description,
                bedrooms: item.bedrooms,
                bathrooms: item.bathrooms,
                area: item.area,
                type: item.type,
                propertyType: item.propertyType,
                amenities: item.amenities || [],
                images: item.images || [],
                publishedAt: item.createdAt,
                status: item.status
            }));

            setSavedProperties(mapped);
        } catch (error) {
            console.error("Failed to fetch saved properties", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || authLoading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                    <Loading />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">Saved Properties</h1>

                {savedProperties.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-lg">No saved properties yet.</p>
                        <p className="text-gray-400 mt-2">Use the heart icon to save properties you like!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedProperties.map((property) => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
