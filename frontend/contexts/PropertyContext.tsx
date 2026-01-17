'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Property } from '@/types/property';
import { mockProperties } from '@/data/mockProperties';
import api from '@/lib/api';

interface PropertyContextType {
  properties: Property[];
  loading: boolean;
  addProperty: (property: Omit<Property, 'id' | 'publishedAt'>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  updateProperty: (id: string, property: Partial<Property>) => Promise<void>;
  getProperty: (id: string) => Property | undefined;
  refreshProperties: () => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const useProperties = () => {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error('useProperties must be used within a PropertyProvider');
  }
  return context;
};

// Helper function to estimate storage size
const getStorageSize = (data: string): number => {
  return new Blob([data]).size;
};

// Helper function to check available storage
const checkStorageQuota = (newData: string): boolean => {
  try {
    const testKey = 'storage_test';
    localStorage.setItem(testKey, newData);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};
export const PropertyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProperties = async () => {
    try {
      const response = await api.get('/listings');
      const data = response.data;

      // Map backend data to frontend Property type
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
        type: item.type as any, // Cast to any to avoid temporary type mismatches during migration
        propertyType: item.propertyType as any,
        amenities: item.amenities || [],
        images: item.images || [],
        publishedAt: item.createdAt || new Date().toISOString()
      }));

      setProperties(mappedProperties);
    } catch (error) {
      console.error('Error loading properties:', error);
      // Fallback to mock data if API fails? Or just empty.
      // setProperties([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load properties from API
    loadProperties();
  }, []);

  const addProperty = async (propertyData: Omit<Property, 'id' | 'publishedAt'>) => {
    try {
      const response = await api.post('/listings', propertyData);
      const newItem = response.data;
      const newProperty: Property = {
        ...newItem,
        id: newItem.id.toString(),
        publishedAt: newItem.createdAt
      };
      setProperties([...properties, newProperty]);
    } catch (error) {
      console.error("Failed to add property", error);
      throw error;
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      await api.delete(`/listings/${id}`); // Ensure backend supports string or int ID
      const updatedProperties = properties.filter(property => property.id !== id);
      setProperties(updatedProperties);
    } catch (error) {
      console.error("Failed to delete property", error);
      throw error;
    }
  };

  const updateProperty = async (id: string, propertyData: Partial<Property>) => {
    try {
      const response = await api.put(`/listings/${id}`, propertyData);
      const updatedItem = response.data;
      const updatedProperties = properties.map(property =>
        property.id === id ? { ...property, ...updatedItem, id: updatedItem.id.toString() } : property
      );
      setProperties(updatedProperties);
    } catch (error) {
      console.error("Failed to update property", error);
      throw error;
    }
  };

  const getProperty = (id: string) => {
    return properties.find(property => property.id === id);
  };

  const refreshProperties = () => {
    const storedProperties = localStorage.getItem('maya_properties');
    if (storedProperties) {
      try {
        const parsed = JSON.parse(storedProperties);
        setProperties(parsed);
      } catch (error) {
        console.error('Error refreshing properties:', error);
      }
    }
  };

  const value = {
    properties,
    loading,
    addProperty,
    deleteProperty,
    updateProperty,
    getProperty,
    refreshProperties
  };

  return (
    <PropertyContext.Provider value={value}>
      {children}
    </PropertyContext.Provider>
  );
};