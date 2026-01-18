'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Property } from '@/types/property';
import { Edit, Trash2, Eye, MapPin, Calendar, Plus } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import Loading from '@/components/loader';
import { toast } from 'react-hot-toast';

export default function MyListingsPage() {
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const { user, loading: authLoading } = useAuth();
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!authLoading) {
            if (!user || (user.role !== 'admin' && user.role !== 'agent')) {
                router.push('/login');
                return;
            }
            fetchData();
        }
    }, [user, authLoading, router]);

    const fetchData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const response = await api.get('/listings/my-listings');
            const data = response.data;

            const mappedProperties: Property[] = data.map((item: any) => ({
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

            setProperties(mappedProperties);
        } catch (error) {
            console.error("Failed to fetch listings", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/listings/${id}`);
            setProperties(prev => prev.filter(p => p.id !== id));
            setDeleteConfirm(null);
            toast.success("Property deleted successfully");
        } catch (error) {
            console.error('Error deleting property:', error);
            toast.error("Failed to delete property");
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'bg-green-100 text-green-800';
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'SOLD': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loading />
            </div>
        );
    }

    if (!user || user.role !== 'agent') {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Listings</h1>
                        <p className="text-gray-600">Manage all your property listings</p>
                    </div>
                    <Link
                        href="/dashboard/add-property"
                        className="mt-4 sm:mt-0 bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Add New Property</span>
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {properties.length === 0 ? (
                        <div className="text-center py-12">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Properties Yet</h3>
                            <p className="text-gray-600 mb-4">You haven't listed any properties yet.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Location</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {properties.map((property) => (
                                        <tr key={property.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <img className="h-12 w-12 rounded-lg object-cover" src={property.image} alt={property.title} />
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{property.title}</div>
                                                        <div className="text-sm text-gray-500">{property.type}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                                                <div className="flex items-center text-sm text-gray-900">
                                                    <MapPin className="w-4 h-4 mr-1 text-gray-400" /> {property.location}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{formatPrice(property.price)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Calendar className="w-4 h-4 mr-1" /> {formatDate(property.publishedAt)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor((property as any).status)}`}>
                                                    {(property as any).status || 'ACTIVE'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end space-x-3">
                                                    <Link href={`/property/${property.id}`} className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50">
                                                        <Eye className="w-5 h-5" />
                                                    </Link>
                                                    <Link href={`/dashboard/edit-property/${property.id}`} className="text-amber-600 hover:text-amber-900 p-1 rounded-full hover:bg-amber-50">
                                                        <Edit className="w-5 h-5" />
                                                    </Link>
                                                    <button onClick={() => setDeleteConfirm(property.id)} className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50">
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {deleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    {/* Modal Content - same as Dashboard */}
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to delete this property?</p>
                        <div className="flex space-x-4">
                            <button onClick={() => setDeleteConfirm(null)} className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300">Cancel</button>
                            <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700">Delete</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
