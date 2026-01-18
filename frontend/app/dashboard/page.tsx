'use client';

import { useState, useEffect } from 'react';
import { redirect, useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Plus, Edit, Trash2, Eye, MapPin, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { Property } from '@/types/property';
import Loading from '@/components/loader';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;

    if (!user || (user.role !== 'admin' && user.role !== 'agent')) {
      toast.error("Please login to access your dashboard");
      router.replace("/login");
      return;
    }

    fetchData();
  }, [user, authLoading, router]);


  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      let endpoint = '/listings/my-listings';
      if (user.role === 'admin') {
        endpoint = '/admin/all-listings';
      }

      const response = await api.get(endpoint);
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
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/listings/${id}`);
      setProperties(prev => prev.filter(p => p.id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting property:', error);
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
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <Loading />
      </div>
    );
  }
  if (!user || (user.role !== 'admin' && user.role !== 'agent')) {
    toast.error("Please login to access your dashboard");
    router.replace("/login");
    return;
  }




  const totalProperties = properties.length;
  const newProperties = properties.filter(p => p.tags?.includes('new')).length;
  const soldProperties = properties.filter(p => (p as any).status === 'SOLD').length;
  const activeProperties = properties.filter(p => (p as any).status === 'ACTIVE').length;

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {user.role === 'admin' ? 'Admin Dashboard' : 'Agent Dashboard'}
            </h1>
            <p className="text-gray-600">
              {user.role === 'admin' ? 'Overview of all platform activity' : 'Manage your property listings'}
            </p>
          </div>
          <Link
            href="/dashboard/add-property"
            className="mt-4 sm:mt-0 bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Property</span>
          </Link>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-amber-500">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Listed</h3>
            <p className="text-3xl font-bold text-amber-600">{totalProperties}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Active</h3>
            <p className="text-3xl font-bold text-green-600">{activeProperties}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {properties.filter(p => (p as any).status === 'PENDING').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sold/Rented</h3>
            <p className="text-3xl font-bold text-blue-600">
              {soldProperties}
            </p>
          </div>
        </div>

        {/* Properties Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {user.role === 'admin' ? 'All Properties' : 'My Listings'}
            </h2>
          </div>

          {properties.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Plus className="w-16 h-16 mx-auto mb-4" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Properties Found</h3>
              <p className="text-gray-600 mb-4">
                {user.role === 'admin' ? 'No properties in the system.' : 'You haven\'t listed any properties yet.'}
              </p>
              <Link
                href="/dashboard/add-property"
                className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors inline-flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add Property</span>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {properties.map((property) => (
                    <tr key={property.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            className="h-12 w-12 rounded-lg object-cover"
                            src={property.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1073&q=80'}
                            alt={property.title}
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {property.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {property.type}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="flex items-center text-sm text-gray-900">
                          <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                          {property.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatPrice(property.price)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(property.publishedAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor((property as any).status)}`}>
                          {(property as any).status || 'ACTIVE'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-3">
                          <Link
                            href={`/property/${property.id}`}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50 transition-colors"
                            title="View Property"
                          >
                            <Eye className="w-5 h-5" />
                          </Link>

                          <Link
                            href={`/dashboard/edit-property/${property.id}`}
                            className="text-amber-600 hover:text-amber-900 p-1 rounded-full hover:bg-amber-50 transition-colors"
                            title="Edit Property"
                          >
                            <Edit className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => setDeleteConfirm(property.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition-colors"
                            title="Delete Property"
                          >
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

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this property? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}