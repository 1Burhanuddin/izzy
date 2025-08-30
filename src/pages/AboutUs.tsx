import React from 'react';
import Layout from '@/components/layout/Layout';
import { MapPin, Phone, Mail, Clock, Award, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AboutUs = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-black">
              About Izzy Glass & Aluminum
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Leading providers of premium glass and aluminum solutions in Rajkot, serving customers with excellence and innovation for over a decade.
            </p>
          </div>

          {/* Our Services */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Our Expertise</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2">
                <CardHeader>
                  <CardTitle className="text-lg text-black">Window Glass</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Premium quality window glass solutions for residential and commercial properties.</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2">
                <CardHeader>
                  <CardTitle className="text-lg text-black">Mirrors</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Custom mirrors for homes, offices, and decorative purposes with perfect finishing.</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2">
                <CardHeader>
                  <CardTitle className="text-lg text-black">Glass Partitions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Modern glass partitions for offices and homes to create elegant spaces.</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2">
                <CardHeader>
                  <CardTitle className="text-lg text-black">Aluminum Works</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">High-quality aluminum doors and windows with superior durability and design.</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Our Branches */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Our Locations</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Izzy Glass & Aluminum */}
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2">
                <CardHeader className="bg-black text-white">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Izzy Glass & Aluminum
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-black mt-1" />
                      <div>
                        <p className="font-semibold">Location</p>
                        <p className="text-gray-600">Bhagwatipara, Rajkot</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Award className="h-5 w-5 text-black mt-1" />
                      <div>
                        <p className="font-semibold">Specialization</p>
                        <p className="text-gray-600">Glass & Aluminum Solutions</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-black mt-1" />
                      <div>
                        <p className="font-semibold">Working Hours</p>
                        <p className="text-gray-600">Mon - Sat: 9:00 AM - 7:00 PM</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Taj Glass */}
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2">
                <CardHeader className="bg-gray-800 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Taj Glass
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-black mt-1" />
                      <div>
                        <p className="font-semibold">Location</p>
                        <p className="text-gray-600">Popatpara, Rajkot</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Award className="h-5 w-5 text-black mt-1" />
                      <div>
                        <p className="font-semibold">Specialization</p>
                        <p className="text-gray-600">Premium Glass Solutions</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-black mt-1" />
                      <div>
                        <p className="font-semibold">Working Hours</p>
                        <p className="text-gray-600">Mon - Sat: 9:00 AM - 7:00 PM</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 border-2 border-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Quality Excellence</h3>
                <p className="text-gray-600">We use only the finest materials and maintain strict quality standards in all our projects.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 border-2 border-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Expert Team</h3>
                <p className="text-gray-600">Our skilled craftsmen have years of experience in glass and aluminum installation.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 border-2 border-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Timely Delivery</h3>
                <p className="text-gray-600">We respect your time and ensure all projects are completed within the agreed timeline.</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-black text-white rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-center mb-8">Contact Us Today</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {/* Email Contact */}
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Email Us</h3>
                <a href="mailto:111burhanuddin@gmail.com" className="text-white hover:text-gray-200 transition-colors">
                  111burhanuddin@gmail.com
                </a>
                <p className="text-gray-300 text-sm mt-1">24/7 Email Support</p>
              </div>
              
              {/* Phone Contact */}
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Call Us</h3>
                <p className="text-gray-300">Available for instant support</p>
                <p className="text-gray-300 text-sm mt-1">Mon - Sat: 9:00 AM - 7:00 PM</p>
              </div>
              
              {/* Location */}
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
                <p className="text-gray-300">Bhagwatipara, Rajkot</p>
                <p className="text-gray-300">Popatpara, Rajkot</p>
              </div>
            </div>
            
            <div className="text-center border-t border-gray-700 pt-6">
              <p className="text-xl font-medium mb-2">Ready to Start Your Project?</p>
              <p className="text-gray-300">Get a free consultation and quote today. We're here to help with all your glass and aluminum needs.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutUs;