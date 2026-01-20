'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Award, Users, Home, TrendingUp } from 'lucide-react';

export default function AboutPage() {

  function LetterAvatar({ name }: { name: string }) {
    const letter = (name || "U").charAt(0).toUpperCase();
    return (
      <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-amber-100 flex items-center justify-center text-amber-600 text-4xl font-bold">
        {letter}
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Propify Real Estate</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your trusted partner in discovering, buying, and investing in properties across India.
            From metro cities to emerging towns, Propify brings transparency, trust, and technology together.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Propify Real Estate was founded with a simple mission: to make property discovery, buying,
                and selling easier, smarter, and more transparent across India. What started as an idea
                has grown into a modern real estate platform serving customers nationwide.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We understand that buying or selling a property is one of life&apos;s most important decisions.
                That&apos;s why we focus on trust, verified listings, data-driven insights, and a seamless digital
                experience to guide you at every step.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our platform combines deep market understanding with modern technology to help families,
                individuals, and investors find the right property — faster, safer, and with complete confidence.
              </p>
            </div>
            <div>
              <img
                src="https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg"
                alt="Propify Real Estate"
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Achievements</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Over the years, we&apos;ve helped thousands of customers discover, buy, and invest in properties across India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">500+</h3>
              <p className="text-gray-600">Properties Listed</p>
            </div>
            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">1000+</h3>
              <p className="text-gray-600">Happy Clients</p>
            </div>
            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">10+</h3>
              <p className="text-gray-600">Years of Experience</p>
            </div>
            <div className="text-center">
              <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">98%</h3>
              <p className="text-gray-600">Customer Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we build at Propify.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Integrity</h3>
                <p className="text-gray-600">
                  We believe in honest, transparent, and verified property listings. Trust is our foundation.
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Excellence</h3>
                <p className="text-gray-600">
                  We continuously improve our platform, services, and support to deliver world-class experience.
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Community</h3>
                <p className="text-gray-600">
                  We are building a trusted real estate ecosystem for buyers, sellers, and agents across India.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Meet the people building India&apos;s next-generation real estate platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-center">
                <LetterAvatar name="Param Khodiyar" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Param Khodiyar</h3>
                <p className="text-amber-600 mb-2">Founder & CEO</p>
                <p className="text-gray-600 text-sm">
                  Leading Propify&apos;s vision to build India&apos;s most trusted real estate platform.
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="text-center">
                <LetterAvatar name="Kashvika Khodiyar" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Kashvika Khodiyar</h3>
                <p className="text-amber-600 mb-2">Head of Sales</p>
                <p className="text-gray-600 text-sm">
                  Driving partnerships, growth strategy, and customer success across regions.
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="text-center">
                <LetterAvatar name="Rohit Baid" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Rohit Baid</h3>
                <p className="text-amber-600 mb-2">Lead Consultant</p>
                <p className="text-gray-600 text-sm">
                  Expert in residential and investment properties with deep market insight.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
