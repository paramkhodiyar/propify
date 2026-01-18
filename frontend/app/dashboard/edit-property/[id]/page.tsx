'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Upload, X, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import Loading from '@/components/loader';

export default function EditPropertyPage() {
    const params = useParams();
    const id = params?.id;
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
    const [isLoading, setIsLoading] = useState(true);
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading) {
            if (!user || (user.role !== 'admin' && user.role !== 'agent')) {
                router.push('/login');
                return;
            }
            fetchListing();
        }
    }, [user, authLoading, router, id]);

    const fetchListing = async () => {
        try {
            const response = await api.get(`/listings/${id}`);
            const data = response.data;

            setFormData({
                title: data.title,
                price: data.price.toString(),
                location: data.location,
                description: data.description,
                bedrooms: data.bedrooms.toString(),
                bathrooms: data.bathrooms.toString(),
                area: data.area.toString(),
                type: data.type,
                propertyType: data.propertyType,
                amenities: data.amenities || [],
                tags: data.tags || []
            });

            setListingStatus(data.status);
            if (data.status === 'REJECTED') {
                const lastUpdate = new Date(data.updatedAt);
                const diff = (new Date().getTime() - lastUpdate.getTime()) / (1000 * 60 * 60);
                if (diff < 24) {
                    const remaining = Math.ceil(24 - diff);
                    setRejectionInfo(`This listing was rejected. You can re-apply in approximately ${remaining} hours.`);
                } else {
                    setRejectionInfo("This listing was rejected. You can now edit and re-submit it for approval.");
                }
            }

            setImagePreviewUrls(data.images || []);
            setExistingImages(data.images || []);
            setIsLoading(false);
        } catch (error) {
            console.error("Failed to fetch listing", error);
            toast.error("Failed to load property details");
            router.push('/dashboard/my-listings');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        const currentCount = imagePreviewUrls.length;
        if (currentCount + files.length > 10) {
            toast.error("Maximum 10 images allowed.");
            return;
        }

        const limitedFiles = files.slice(0, 10 - currentCount);
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


    const removeImageSimple = (index: number) => {
        const allUrls = [...imagePreviewUrls];
        const removedUrl = allUrls[index];
        setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
        if (existingImages.includes(removedUrl)) {
            setExistingImages(prev => prev.filter(u => u !== removedUrl));
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
            const isSelected = prev.tags.includes(tag);
            if (isSelected) {
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

            await api.put(`/listings/${id}`, propertyData);

            toast.success(listingStatus === 'REJECTED' ? "Property Re-submitted for Approval!" : "Property Updated Successfully!");
            setTimeout(() => router.push('/dashboard/my-listings'), 2000);

        } catch (error: any) {
            console.error('Error updating property:', error);
            const msg = error.response?.data?.message || "Failed to update property";
            toast.error(msg);
            setIsSubmitting(false);
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

    if (isLoading || authLoading) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-gray-50'>
                <Loading />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Edit Property</h1>
                    {listingStatus === 'REJECTED' && (
                        <span className="ml-4 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                            Rejected
                        </span>
                    )}
                </div>

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
                    {/* Basic Information */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Property Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Listing Type</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                                >
                                    {listingTypes.map(type => <option key={type} value={type}>{type}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                                <select
                                    name="propertyType"
                                    value={formData.propertyType}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                                >
                                    {propertyTypes.map(type => <option key={type} value={type}>{type}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Price (INR)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Property Details */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Property Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                                <input
                                    type="number"
                                    name="bedrooms"
                                    value={formData.bedrooms}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                                <input
                                    type="number"
                                    name="bathrooms"
                                    value={formData.bathrooms}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Area (sq ft)</label>
                                <input
                                    type="number"
                                    name="area"
                                    value={formData.area}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Images */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Property Images</h2>
                        <div className="space-y-4">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amber-400 transition-colors">
                                <input
                                    type="file"
                                    id="images"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                                <label htmlFor="images" className="cursor-pointer">
                                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600 mb-2">Click to upload new images</p>
                                    <p className="text-sm text-gray-500">Upload up to 10 images total.</p>
                                </label>
                            </div>
                            {imagePreviewUrls.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {imagePreviewUrls.map((url, index) => (
                                        <div key={index} className="relative group">
                                            <img src={url} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                                            <button
                                                type="button"
                                                onClick={() => removeImageSimple(index)}
                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Amenities */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Amenities</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {availableAmenities.map(amenity => (
                                <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.amenities.includes(amenity)}
                                        onChange={() => handleAmenityToggle(amenity)}
                                        className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                                    />
                                    <span className="text-sm text-gray-700">{amenity}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Status Tags</h2>
                        <div className="flex flex-wrap gap-3">
                            {availableTags.map(tag => (
                                <button
                                    key={tag.value}
                                    type="button"
                                    onClick={() => handleTagToggle(tag.value)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${formData.tags.includes(tag.value) ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {tag.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-4">
                        <Link href="/dashboard/my-listings" className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
