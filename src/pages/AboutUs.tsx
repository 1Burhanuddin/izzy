import React from 'react';
import Layout from '@/components/layout/Layout';
import { MapPin, Phone, Mail, Clock, Award, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AboutUs = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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
              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-600">Window Glass</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Premium quality window glass solutions for residential and commercial properties.</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-600">Mirrors</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Custom mirrors for homes, offices, and decorative purposes with perfect finishing.</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-600">Glass Partitions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Modern glass partitions for offices and homes to create elegant spaces.</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-600">Aluminum Works</CardTitle>
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
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Izzy Glass & Aluminum
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-blue-600 mt-1" />
                      <div>
                        <p className="font-semibold">Location</p>
                        <p className="text-gray-600">Bhagwatipara, Rajkot</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Award className="h-5 w-5 text-blue-600 mt-1" />
                      <div>
                        <p className="font-semibold">Specialization</p>
                        <p className="text-gray-600">Glass & Aluminum Solutions</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-blue-600 mt-1" />
                      <div>
                        <p className="font-semibold">Working Hours</p>
                        <p className="text-gray-600">Mon - Sat: 9:00 AM - 7:00 PM</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Taj Glass */}
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Taj Glass
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-purple-600 mt-1" />
                      <div>
                        <p className="font-semibold">Location</p>
                        <p className="text-gray-600">Popatpara, Rajkot</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Award className="h-5 w-5 text-purple-600 mt-1" />
                      <div>
                        <p className="font-semibold">Specialization</p>
                        <p className="text-gray-600">Premium Glass Solutions</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-purple-600 mt-1" />
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
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Quality Excellence</h3>
                <p className="text-gray-600">We use only the finest materials and maintain strict quality standards in all our projects.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Expert Team</h3>
                <p className="text-gray-600">Our skilled craftsmen have years of experience in glass and aluminum installation.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Timely Delivery</h3>
                <p className="text-gray-600">We respect your time and ensure all projects are completed within the agreed timeline.</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-6">Ready to Start Your Project?</h2>
            <p className="text-xl mb-6">Contact us today for a free consultation and quote.</p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                <span>Call us for instant support</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                <span>Email: 111burhanuddin@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutUs;