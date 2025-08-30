import React from 'react';
import Layout from '@/components/layout/Layout';
import { Shield, Eye, Lock, UserCheck, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-black">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your privacy is important to us. This policy explains how Izzy Glass & Aluminum collects, uses, and protects your information.
            </p>
            <p className="text-sm text-gray-500 mt-4">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {/* Information We Collect */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-black" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-lg mb-2">Personal Information</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Name and contact information (phone number, email address)</li>
                    <li>Billing and shipping addresses</li>
                    <li>Project details and specifications</li>
                    <li>Payment information (processed securely through payment providers)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">Usage Information</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Website usage data and preferences</li>
                    <li>Communication history with our team</li>
                    <li>Service requests and inquiries</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Information */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <UserCheck className="h-6 w-6 text-black" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                    <span>To provide glass and aluminum installation services</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                    <span>To communicate about your projects and service requests</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                    <span>To process payments and manage billing</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                    <span>To improve our services and customer experience</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                    <span>To send service updates and promotional offers (with your consent)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Information Sharing */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Eye className="h-6 w-6 text-black" />
                  Information Sharing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                    <span>With trusted service providers who assist in our operations (payment processors, delivery services)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                    <span>When required by law or to protect our rights and safety</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                    <span>With your explicit consent for specific purposes</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Lock className="h-6 w-6 text-black" />
                  Data Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  We implement appropriate security measures to protect your personal information:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                    <span>Secure data transmission and storage</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                    <span>Regular security assessments and updates</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                    <span>Limited access to personal information on a need-to-know basis</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                    <span>Secure payment processing through trusted providers</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <UserCheck className="h-6 w-6 text-black" />
                  Your Rights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">You have the right to:</p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                    <span>Access and review your personal information</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                    <span>Request corrections to inaccurate information</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                    <span>Request deletion of your personal information</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                    <span>Opt out of marketing communications</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  If you have questions about this Privacy Policy or your personal information, please contact us:
                </p>
                <div className="space-y-2">
                  <p><strong>Email:</strong> 111burhanuddin@gmail.com</p>
                  <p><strong>Business Name:</strong> Izzy Glass & Aluminum / Taj Glass</p>
                  <p><strong>Locations:</strong> Bhagwatipara & Popatpara, Rajkot</p>
                </div>
              </CardContent>
            </Card>

            {/* Policy Updates */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Policy Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. 
                  We encourage you to review this policy periodically to stay informed about how we protect your information.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;