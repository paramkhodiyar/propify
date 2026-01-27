'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Loading from '@/components/loader'
import { PropertyCard } from '@/components/PropertyCard';
import { Property } from '@/types/property';
import { useProperties } from '@/contexts/PropertyContext';
import SavedListingButton from '@/components/SavedListingButton';
import { Search, Filter, MapPin, Bed, Bath, Square, X, Send, Eye, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import axios from "axios";
import { FaCheckCircle, FaSpinner, FaServer, FaExclamationCircle } from "react-icons/fa";
import { motion } from "framer-motion";

export default function HomePage() {
  const { properties, loading } = useProperties();
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [showQuickView, setShowQuickView] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isEnquirySubmitted, setIsEnquirySubmitted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 6;

  const [serverReady, setServerReady] = useState(false);
  const [steps, setSteps] = useState([
    { id: 1, label: "Cranking up the servers...", status: "pending" },
    { id: 2, label: "Polishing the experience...", status: "pending" },
    { id: 3, label: "Loading the properties...", status: "pending" },
  ]);
  const [error, setError] = useState<string | null>(null);

  const isProd = process.env.NEXT_PUBLIC_IS_PROD === "true";
  const URL = "http://localhost:4000"; // Using local backend port directly as verified

  useEffect(() => {
    startChecks();
  }, []);

  const updateStep = (id: number, status: string) => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  };

  const startChecks = async () => {
    try {
      setError(null);
      updateStep(1, "loading");

      const start = Date.now();
      try {
        await axios.get(`${URL}/`); // Root endpoint returns "Propify Real Estate Backend is Running"
      } catch (e: any) {
        if (!e.response) throw e;
      }
      const duration = Date.now() - start;

      updateStep(1, "success");
      updateStep(2, "loading");
      await new Promise((r) => setTimeout(r, duration > 1000 ? 1000 : 500));
      updateStep(2, "success");
      updateStep(3, "loading");
      await new Promise((r) => setTimeout(r, 600));
      updateStep(3, "success");

      setTimeout(() => setServerReady(true), 500);
    } catch (err) {
      console.error(err);
      updateStep(1, "error");
      setError("The servers are on strike. Server is unresponsive.");
    }
  };

  const handleRetry = () => {
    setSteps([
      { id: 1, label: "Cranking up the servers...", status: "pending" },
      { id: 2, label: "Polishing the experience...", status: "pending" },
      { id: 3, label: "Loading the properties...", status: "pending" },
    ]);
    startChecks();
  };

  useEffect(() => {
    if (selectedTag === 'all') {
      setFilteredProperties(properties);
    } else {
      setFilteredProperties(properties.filter(property =>
        property.tags.includes(selectedTag)
      ));
    }
    setCurrentPage(1);
  }, [selectedTag, properties]);

  const tags = ['all', 'new', 'fast-filling', 'sold-out', 'trending'];


  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);
  const startIndex = (currentPage - 1) * propertiesPerPage;
  const endIndex = startIndex + propertiesPerPage;
  const currentProperties = filteredProperties.slice(startIndex, endIndex);

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

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEnquirySubmitted(true);
    setTimeout(() => {
      setIsEnquirySubmitted(false);
      setEnquiryForm({ name: '', email: '', phone: '', message: '' });
    }, 3000);
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

  if (!serverReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-amber-100 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <FaServer className="text-2xl text-amber-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">System Check</h1>
            <p className="text-gray-500 text-sm mt-1">
              Establishing secure connection...
            </p>
          </div>

          <div className="space-y-4">
            {steps.map((step) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center p-3 rounded-lg border transition-colors ${step.status === "pending"
                  ? "border-transparent text-gray-400"
                  : step.status === "loading"
                    ? "border-amber-200 bg-amber-50 text-amber-800"
                    : step.status === "success"
                      ? "border-green-100 bg-green-50 text-green-800"
                      : "border-red-100 bg-red-50 text-red-800"
                  }`}
              >
                <div className="flex-shrink-0 w-8">
                  {step.status === "loading" && (
                    <FaSpinner className="animate-spin" />
                  )}
                  {step.status === "success" && <FaCheckCircle />}
                  {step.status === "error" && <FaExclamationCircle />}
                  {step.status === "pending" && (
                    <div className="w-4 h-4 rounded-full border-2 border-gray-200" />
                  )}
                </div>
                <span className="text-sm font-medium">{step.label}</span>
              </motion.div>
            ))}
          </div>

          {error && (
            <div className="mt-6 text-center">
              <p className="text-[#991a1a] text-sm mb-4">{error}</p>
              <button
                onClick={handleRetry}
                className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition shadow-md"
              >
                Retry Connection
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <>
        <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
          <Loading />
        </div>
      </>

    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Find Your Dream Home here...
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover premium properties in the heart of India. From modern apartments to luxury villas,
            find the perfect home that matches your lifestyle.
          </p>
        </div>
      </section>

      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${selectedTag === tag
                  ? 'bg-amber-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {tag.charAt(0).toUpperCase() + tag.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Properties</h2>
            <Link
              href="/properties"
              className="flex items-center text-amber-600 hover:text-amber-700 font-medium"
            >
              View All Properties
              <ChevronRight className="w-5 h-5 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentProperties.map((property) => (
              <div key={property.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                <div className="relative">
                  <div className="absolute top-12 right-3 z-10">
                    <SavedListingButton
                      listingId={parseInt(property.id)}
                      iconSize={15}
                      className="bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                    />
                  </div>
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
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
                  <button
                    onClick={() => openQuickView(property)}
                    className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                  >
                    <Eye className="w-4 h-4 text-gray-700" />
                  </button>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {property.title}
                  </h3>

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
              <p className="text-gray-500 text-lg">No properties found with the selected filter.</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-12 space-x-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <div className="flex space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg ${currentPage === page
                      ? 'bg-amber-600 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}

          {filteredProperties.length > propertiesPerPage && (
            <div className="text-center mt-8">
              <Link
                href="/properties"
                className="bg-amber-600 text-white px-8 py-3 rounded-lg hover:bg-amber-700 transition-colors font-medium inline-flex items-center space-x-2"
              >
                <span>View All {filteredProperties.length} Properties</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {showQuickView && selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
              <div className="space-y-6">
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
      )}

      <Footer />
    </div>
  );
}