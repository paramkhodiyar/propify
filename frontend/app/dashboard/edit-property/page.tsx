'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Property } from '@/types/property';
import { Edit, Eye, MapPin, Calendar, Upload, X, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import Loading from '@/components/loader';
import { toast } from 'react-hot-toast';

export default function EditPropertyPage() {
    const { user, loading: authLoading } = useAuth();
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        location: '',
        description: '',
        bedrooms: '',
        bathrooms: '',
        area: '',
        type: 'SALE',
        propertyType: 'APARTMENT',
        amenities: [] as string[],
        tags: [] as string[]
    });
    const [listingStatus, setListingStatus] = useState<string>('');
    const [rejectionInfo, setRejectionInfo] = useState<string | null>(null);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
                status: item.status,
                updatedAt: item.updatedAt
            }));
            setProperties(mappedProperties);
        } catch (error) {
            console.error("Failed to fetch listings", error);
            toast.error("Failed to load properties");
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (property: any) => {
        setSelectedProperty(property);
        setFormData({
            title: property.title,
            price: property.price.toString(),
            location: property.location,
            description: property.description,
            bedrooms: property.bedrooms.toString(),
            bathrooms: property.bathrooms.toString(),
            area: property.area.toString(),
            type: property.type,
            propertyType: property.propertyType,
            amenities: property.amenities || [],
            tags: property.tags || []
        });

        setListingStatus(property.status);
        setRejectionInfo(null);

        if (property.status === 'REJECTED') {
            const lastUpdate = new Date(property.updatedAt);
            const diff = (new Date().getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);
            if (diff < 24) {
                const remaining = Math.ceil(24 - diff);
                setRejectionInfo(`This listing was rejected. You can re-apply in approximately ${remaining} hours.`);
            } else {
                setRejectionInfo("This listing was rejected. You can now edit and re-submit it for approval.");
            }
        }

        setImagePreviewUrls(property.images || []);
        setExistingImages(property.images || []);
        setSelectedImages([]);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProperty(null);
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        if (imagePreviewUrls.length + files.length > 10) {
            toast.error("Maximum 10 images allowed.");
            return;
        }
        const limitedFiles = files.slice(0, 10 - imagePreviewUrls.length);
        setSelectedImages(prev => [...prev, ...limitedFiles]);
        const newPreviewUrls = limitedFiles.map(file => URL.createObjectURL(file));
        setImagePreviewUrls(prev => [...prev, ...newPreviewUrls]);
    };

    const removeImage = (index: number) => {
        const urlToRemove = imagePreviewUrls[index];
        setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
        if (existingImages.includes(urlToRemove)) {
            setExistingImages(prev => prev.filter(img => img !== urlToRemove));
        } else {

        }
    };

    const handleAmenityToggle = (amenity: string) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity]
        }));
    };

    const handleTagToggle = (tag: string) => {
        setFormData(prev => {
            if (prev.tags.includes(tag)) {
                return { ...prev, tags: prev.tags.filter(t => t !== tag) };
            } else {
                if (prev.tags.length >= 2) {
                    toast.error("You can select up to 2 tags");
                    return prev;
                }
                return { ...prev, tags: [...prev.tags, tag] };
            }
        });
    };

    const uploadImagesToCloudinary = async (files: File[]) => {
        const formData = new FormData();
        files.forEach((file) => formData.append("images", file));
        const res = await api.post("/upload/images", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        if (!res.data.success) throw new Error("Image upload failed");
        return res.data.urls as string[];
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProperty) return;
        setIsSubmitting(true);

        try {
            let newImageUrls: string[] = [];
            if (selectedImages.length > 0) {
                toast.loading("Uploading new images...");
                newImageUrls = await uploadImagesToCloudinary(selectedImages);
                toast.dismiss();
            }



            const finalImages = [...existingImages, ...newImageUrls];

            const propertyData = {
                title: formData.title,
                price: parseInt(formData.price),
                location: formData.location,
                description: formData.description,
                bedrooms: parseInt(formData.bedrooms),
                bathrooms: parseInt(formData.bathrooms),
                area: parseInt(formData.area),
                type: formData.type,
                propertyType: formData.propertyType,
                amenities: formData.amenities,
                tags: formData.tags,
                images: finalImages,
                status: listingStatus === 'REJECTED' ? 'PENDING' : listingStatus
            };

            const res = await api.put(`/listings/${selectedProperty.id}`, propertyData);

            toast.success("Property Updated Successfully!");
            setIsModalOpen(false);
            fetchData();

        } catch (error: any) {
            console.error('Error updating property:', error);
            const msg = error.response?.data?.message || "Failed to update property";
            toast.error(msg);
        } finally {
            setIsSubmitting(false);
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
            case 'REJECTED': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const availableAmenities = [
        'Swimming Pool', 'Garden', 'Parking', 'Security', 'Gym',
        'Elevator', 'Power Backup', 'Terrace Garden', 'City View',
        'Premium Fittings', 'River View', 'Peaceful Location',
        'Natural Light', 'Premium Location', 'Luxury Fittings', 'Concierge'
    ];
    const availableTags = [
        { value: 'new', label: 'New' },
        { value: 'fast-filling', label: 'Fast Filling' },
        { value: 'sold-out', label: 'Sold Out' },
        { value: 'trending', label: 'Trending' }
    ];
    const propertyTypes = ['APARTMENT', 'VILLA', 'HOUSE', 'PENTHOUSE', 'COTTAGE', 'SUITE'];
    const listingTypes = ['SALE', 'RENT'];

    if (authLoading || loading) {
        return <div className="flex items-center justify-center h-screen"><Loading /></div>;
    }

    if (!user || (user.role !== 'admin' && user.role !== 'agent')) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Properties</h1>
                    <p className="text-gray-600">Select a property to edit details</p>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {properties.length === 0 ? (
                        <div className="text-center py-12">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Properties Found</h3>
                            <p className="text-gray-600">You haven't listed any properties yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                            {properties.map((property) => (
                                <div
                                    key={property.id}
                                    onClick={() => handleEditClick(property)}
                                    className="border rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-all group bg-white"
                                >
                                    <div className="relative h-48">
                                        <img
                                            src={property.image || 'https://via.placeholder.com/400'}
                                            alt={property.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute top-2 right-2">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor((property as any).status)}`}>
                                                {(property as any).status || 'ACTIVE'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 mb-1 truncate">{property.title}</h3>
                                        <p className="text-amber-600 font-medium mb-2">{formatPrice(property.price)}</p>
                                        <div className="flex items-center text-gray-500 text-sm mb-3">
                                            <MapPin className="w-4 h-4 mr-1" />
                                            <span className="truncate">{property.location}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-gray-400 text-xs border-t pt-3">
                                            <div className="flex items-center">
                                                <Calendar className="w-3 h-3 mr-1" />
                                                {formatDate(property.publishedAt)}
                                            </div>
                                            <div className="flex items-center text-amber-600 font-medium group-hover:underline">
                                                <Edit className="w-3 h-3 mr-1" /> Edit
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                        onClick={closeModal}
                    ></div>

                    {/* Modal Content */}
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                        <div className="sticky top-0 z-10 bg-white border-b px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">
                                Edit Property: <span className="text-amber-600">{selectedProperty?.title}</span>
                            </h2>
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6">
                            {listingStatus === 'REJECTED' && rejectionInfo && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                                    <div>
                                        <h3 className="text-red-900 font-medium">Application Rejected</h3>
                                        <p className="text-red-800 text-sm mt-1">{rejectionInfo}</p>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Form Content - Same as Add Property Page */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Property Title</label>
                                            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Listing Type</label>
                                            <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent">
                                                {listingTypes.map(type => <option key={type} value={type}>{type}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                                            <select name="propertyType" value={formData.propertyType} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent">
                                                {propertyTypes.map(type => <option key={type} value={type}>{type}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Price (INR)</label>
                                            <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                            <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                        <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent" />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Details & Amenities</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div><label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label><input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} required min="0" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent" /></div>
                                        <div><label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label><input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} required min="0" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent" /></div>
                                        <div><label className="block text-sm font-medium text-gray-700 mb-2">Area (sq ft)</label><input type="number" name="area" value={formData.area} onChange={handleChange} required min="1" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent" /></div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">Amenities</label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {availableAmenities.map(amenity => (
                                                <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                                                    <input type="checkbox" checked={formData.amenities.includes(amenity)} onChange={() => handleAmenityToggle(amenity)} className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500" />
                                                    <span className="text-sm text-gray-700">{amenity}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">Status Tags</label>
                                        <div className="flex flex-wrap gap-3">
                                            {availableTags.map(tag => (
                                                <button type="button" key={tag.value} onClick={() => handleTagToggle(tag.value)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${formData.tags.includes(tag.value) ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                                                    {tag.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Images</h3>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amber-400 transition-colors">
                                        <input type="file" id="images" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                                        <label htmlFor="images" className="cursor-pointer">
                                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-gray-600 text-sm">Click to upload images</p>
                                        </label>
                                    </div>
                                    {imagePreviewUrls.length > 0 && (
                                        <div className="grid grid-cols-3 gap-4">
                                            {imagePreviewUrls.map((url, index) => (
                                                <div key={index} className="relative group">
                                                    <img src={url} alt={`Preview ${index}`} className="w-full h-24 object-cover rounded-lg" />
                                                    <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end space-x-4 pt-4 border-t">
                                    <button type="button" onClick={closeModal} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={isSubmitting} className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50">
                                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}