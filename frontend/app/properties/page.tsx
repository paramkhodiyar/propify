'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Property } from '@/types/property';
import Loading from '@/components/loader';
import SavedListingButton from '@/components/SavedListingButton';
import { Search, Filter, MapPin, Bed, Bath, Square, X, Send, Eye } from 'lucide-react';
import { useProperties } from '@/contexts/PropertyContext';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import { useAuth } from "@/contexts/AuthContext";
import Link from 'next/link';

export default function PropertiesPage() {
  const { user } = useAuth();
  const { properties, loading } = useProperties();
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [searchFilters, setSearchFilters] = useState({
    location: '',
    type: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: ''
  });
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isEnquirySubmitted, setIsEnquirySubmitted] = useState(false);

  useEffect(() => {
    setFilteredProperties(properties);
  }, [properties]);

  useEffect(() => {
    let filtered = properties;
    if (searchFilters.location) {
      filtered = filtered.filter(property =>
        property.location.toLowerCase().includes(searchFilters.location.toLowerCase())
      );
    }
    if (searchFilters.type) {
      filtered = filtered.filter(property => property.propertyType === searchFilters.type);
    }
    if (searchFilters.minPrice) {
      filtered = filtered.filter(property =>
        property.price >= parseInt(searchFilters.minPrice)
      );
    }
    if (searchFilters.maxPrice) {
      filtered = filtered.filter(property =>
        property.price <= parseInt(searchFilters.maxPrice)
      );
    }
    if (searchFilters.bedrooms) {
      filtered = filtered.filter(property =>
        property.bedrooms >= parseInt(searchFilters.bedrooms)
      );
    }
    if (searchFilters.bathrooms) {
      filtered = filtered.filter(property =>
        property.bathrooms >= parseInt(searchFilters.bathrooms)
      );
    }
    setFilteredProperties(filtered);
  }, [searchFilters, properties]);

  const handleFilterChange = (key: string, value: string) => {
    setSearchFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setSearchFilters({
      location: '',
      type: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: ''
    });
  };

  const openQuickView = (property: Property) => {
    setSelectedProperty(property);
    setCurrentImageIndex(0);
    setShowQuickView(true);
    setIsEnquirySubmitted(false);
    setEnquiryForm({ name: '', email: '', phone: '', message: '' });
  };

  const closeQuickView = () => {
    setShowQuickView(false);
    setSelectedProperty(null);
  };

  const nextImage = () => {
    if (selectedProperty) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedProperty.images.length);
    }
  };

  const prevImage = () => {
    if (selectedProperty) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedProperty.images.length) % selectedProperty.images.length);
    }
  };

  const handleEnquiryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEnquiryForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to send enquiry");
      return;
    }

    if (!selectedProperty) return;

    try {
      await api.post("/inquiries", {
        listingId: selectedProperty.id,
        message: `
Name: ${enquiryForm.name}
Email: ${enquiryForm.email}
Phone: ${enquiryForm.phone}

${enquiryForm.message}
      `.trim()
      });

      setIsEnquirySubmitted(true);
      toast.success("Enquiry sent successfully!");

      setTimeout(() => {
        setIsEnquirySubmitted(false);
        setEnquiryForm({ name: "", email: "", phone: "", message: "" });
        closeQuickView();
      }, 2000);

    } catch (err: any) {
      console.error("Failed to send enquiry", err);
      toast.error(err.response?.data?.message || "Failed to send enquiry");
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

  const getTagStyle = (tag: string) => {
    switch (tag) {
      case 'new':
        return 'bg-green-100 text-green-800';
      case 'fast-filling':
        return 'bg-orange-100 text-orange-800';
      case 'sold-out':
        return 'bg-red-100 text-red-800';
      case 'trending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTagText = (tag: string) => {
    switch (tag) {
      case 'fast-filling':
        return 'Fast Filling';
      case 'sold-out':
        return 'Sold Out';
      default:
        return tag.charAt(0).toUpperCase() + tag.slice(1);
    }
  };

  const uniqueLocations = Array.from(new Set(properties.map(p => p.location?.split(',')[0]?.trim()))).filter(Boolean);
  const uniqueTypes = Array.from(new Set(properties.map(p => p.propertyType))).filter(Boolean);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <Loading />
        <p className="text-gray-600">Loading Properties...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse All Properties</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover your perfect home with our advanced search and filtering options
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
              <Filter className="w-6 h-6 mr-2 text-amber-600" />
              Search Properties
            </h2>
            <button
              onClick={clearFilters}
              className="text-amber-600 hover:text-amber-700 font-medium"
            >
              Clear All Filters
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Location Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <select
                value={searchFilters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
              >
                <option value="">All Locations</option>
                {uniqueLocations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            {/* Property Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
              <select
                value={searchFilters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
              >
                <option value="">All Types</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Min Price Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Price (INR)</label>
              <input
                type="number"
                value={searchFilters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                placeholder="e.g., 2000000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
              />
            </div>

            {/* Max Price Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Price (INR)</label>
              <input
                type="number"
                value={searchFilters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                placeholder="e.g., 10000000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
              />
            </div>

            {/* Bedrooms Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Bedrooms</label>
              <select
                value={searchFilters.bedrooms}
                onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>

            {/* Bathrooms Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Bathrooms</label>
              <select
                value={searchFilters.bathrooms}
                onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredProperties.length}</span> properties
          </p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property) => (
            <div key={property.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
              {/* Image */}
              <div className="relative">
                <div className="absolute top-12 right-2.5 z-10">
                  <SavedListingButton
                    listingId={parseInt(property.id)}
                    iconSize={11}
                    className="bg-white/90 p-3 hover:bg-white shadow-lg rounded-full"
                  />

                </div>
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
                {/* Tags */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  {property.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getTagStyle(tag)}`}
                    >
                      {getTagText(tag)}
                    </span>
                  ))}
                </div>
                {/* Quick View Button */}
                <button
                  onClick={() => openQuickView(property)}
                  className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                >
                  <Eye className="w-4 h-4 text-gray-700" />
                </button>
              </div>

              {/* Content */}
              < div className="p-6">
                <Link href={`/property/${property.id}`} className="text-xl font-semibold text-gray-900 mb-2">
                  {property.title}
                </Link>

                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{property.location}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Bed className="w-4 h-4 mr-1" />
                    <span>{property.bedrooms}</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="w-4 h-4 mr-1" />
                    <span>{property.bathrooms}</span>
                  </div>
                  <div className="flex items-center">
                    <Square className="w-4 h-4 mr-1" />
                    <span>{property.area} sq ft</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-amber-600">
                    {formatPrice(property.price)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {property.type}
                  </div>
                </div>

                <button
                  onClick={() => openQuickView(property)}
                  className="w-full mt-4 bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors font-medium"
                >
                  Quick View
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Properties Found</h3>
            <p className="text-gray-500">Try adjusting your search filters to find more properties.</p>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {
        showQuickView && selectedProperty && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900">{selectedProperty.title}</h2>
                <button
                  onClick={closeQuickView}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                {/* Left Column - Images and Details */}
                <div className="space-y-6">
                  {/* Image Gallery */}
                  <div className="relative">
                    <img
                      src={selectedProperty.images[currentImageIndex]}
                      alt={selectedProperty.title}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    {selectedProperty.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
                        >
                          ←
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
                        >
                          →
                        </button>
                      </>
                    )}
                    <div className="absolute top-4 right-4 z-10">
                      <SavedListingButton
                        listingId={parseInt(selectedProperty.id)}
                        iconSize={24}
                        className="bg-white/90 p-3 hover:bg-white shadow-lg rounded-full"
                      />

                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span>{selectedProperty.location}</span>
                    </div>

                    <div className="text-3xl font-bold text-amber-600">
                      {formatPrice(selectedProperty.price)}
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <Bed className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                        <span className="text-sm font-medium">{selectedProperty.bedrooms} Beds</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <Bath className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                        <span className="text-sm font-medium">{selectedProperty.bathrooms} Baths</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <Square className="w-5 h-5 mx-auto mb-1 text-gray-600" />
                        <span className="text-sm font-medium">{selectedProperty.area} sq ft</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">{selectedProperty.description}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Amenities</h4>
                      <div className="grid grid-cols-2 gap-1">
                        {selectedProperty.amenities.slice(0, 6).map((amenity, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-700">
                            <div className="w-2 h-2 bg-amber-600 rounded-full mr-2"></div>
                            {amenity}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Enquiry Form */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Enquiry</h3>

                  {isEnquirySubmitted ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Enquiry Sent!</h4>
                      <p className="text-gray-600">We'll get back to you within 24 hours.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleEnquirySubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={enquiryForm.name}
                          onChange={handleEnquiryChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                          placeholder="Enter your name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={enquiryForm.email}
                          onChange={handleEnquiryChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                          placeholder="Enter your email"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={enquiryForm.phone}
                          onChange={handleEnquiryChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                          placeholder="Enter your phone number"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <textarea
                          name="message"
                          value={enquiryForm.message}
                          onChange={handleEnquiryChange}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-600 focus:border-transparent resize-none"
                          placeholder="Tell us about your requirements..."
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-amber-600 text-white py-3 px-4 rounded-lg hover:bg-amber-700 transition-colors font-medium flex items-center justify-center space-x-2"
                      >
                        <Send className="w-4 h-4" />
                        <span>Send Enquiry</span>
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      }
      <Footer />

    </div >
  );
}