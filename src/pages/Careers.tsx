import React from 'react';
import Layout from '@/components/layout/Layout';
import { Users, Wrench, Award, Clock, MapPin, Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Careers = () => {
  const jobOpenings = [
    {
      title: "Glass Fitting Specialist",
      type: "Full-time",
      experience: "2+ years",
      location: "Bhagwatipara, Rajkot",
      description: "Experienced professional for window glass installation, mirror fitting, and glass partition work.",
      requirements: [
        "Minimum 2 years experience in glass fitting",
        "Knowledge of different glass types and installation techniques",
        "Ability to work with precision and attention to detail",
        "Physical fitness for handling glass materials"
      ]
    },
    {
      title: "Aluminum Fitting Worker",
      type: "Full-time", 
      experience: "1+ years",
      location: "Both Branches",
      description: "Skilled worker for aluminum door and window installation and maintenance.",
      requirements: [
        "Experience in aluminum fabrication and fitting",
        "Knowledge of door and window installation",
        "Ability to read technical drawings",
        "Good problem-solving skills"
      ]
    },
    {
      title: "Aluminum Door & Window Maker",
      type: "Full-time",
      experience: "3+ years",
      location: "Popatpara, Rajkot", 
      description: "Expert craftsman for designing and manufacturing custom aluminum doors and windows.",
      requirements: [
        "Extensive experience in aluminum fabrication",
        "Knowledge of modern door and window designs",
        "Precision in measurements and cutting",
        "Quality control mindset"
      ]
    },
    {
      title: "Labor Worker - Glass & Aluminum",
      type: "Full-time",
      experience: "Entry Level",
      location: "Both Branches",
      description: "Entry-level position for assisting in glass and aluminum installation projects.",
      requirements: [
        "Willingness to learn glass and aluminum work",
        "Physical fitness for manual labor",
        "Basic understanding of construction work",
        "Reliable and punctual"
      ]
    }
  ];

  const benefits = [
    {
      icon: Award,
      title: "Skill Development",
      description: "Continuous training in latest glass and aluminum techniques"
    },
    {
      icon: Clock,
      title: "Flexible Hours",
      description: "Monday to Saturday, 9 AM to 7 PM with reasonable working hours"
    },
    {
      icon: Users,
      title: "Team Environment",
      description: "Work with experienced professionals in a supportive environment"
    },
    {
      icon: MapPin,
      title: "Local Opportunities",
      description: "Work at convenient locations in Rajkot"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gray-100 border-2 border-black rounded-full flex items-center justify-center">
                <Users className="h-10 w-10 text-black" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-black">
              Join Our Team
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Build your career with Izzy Glass & Aluminum. We're looking for skilled professionals passionate about quality craftsmanship.
            </p>
          </div>

          {/* Why Work With Us */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Why Work With Us?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2">
                  <CardHeader>
                    <div className="w-16 h-16 bg-gray-100 border-2 border-black rounded-full flex items-center justify-center mx-auto mb-4">
                      <benefit.icon className="h-8 w-8 text-black" />
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Current Openings */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Current Job Openings</h2>
            <div className="space-y-6">
              {jobOpenings.map((job, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 border-2">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">{job.type}</Badge>
                          <Badge variant="outline">{job.experience}</Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {job.location}
                          </Badge>
                        </div>
                      </div>
                      <Button className="bg-black hover:bg-gray-800 text-white">
                        Apply Now
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{job.description}</p>
                    <div>
                      <h4 className="font-semibold mb-2">Requirements:</h4>
                      <ul className="space-y-1">
                        {job.requirements.map((req, reqIndex) => (
                          <li key={reqIndex} className="flex items-start gap-2 text-gray-600">
                            <div className="w-2 h-2 bg-black rounded-full mt-2"></div>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Application Process */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">How to Apply</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 border-2 border-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-black">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Submit Application</h3>
                <p className="text-gray-600">Send your resume and contact details to our email or visit our office directly.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 border-2 border-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-black">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Skill Assessment</h3>
                <p className="text-gray-600">Demonstrate your skills through a practical assessment relevant to the position.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 border-2 border-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-black">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Join Our Team</h3>
                <p className="text-gray-600">Start your career with comprehensive training and ongoing support.</p>
              </div>
            </div>
          </div>

          {/* Contact for Applications */}
          <div className="text-center bg-black text-white rounded-2xl p-8">
            <div className="flex justify-center mb-6">
              <Wrench className="h-12 w-12" />
            </div>
            <h2 className="text-3xl font-bold mb-6">Ready to Start Your Career?</h2>
            <p className="text-xl mb-6">Join our team of skilled professionals and grow your expertise in glass and aluminum work.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {/* Application Methods */}
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Apply Online</CardTitle>
                </CardHeader>
                <CardContent className="text-left space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    <span>111burhanuddin@gmail.com</span>
                  </div>
                  <p className="text-sm opacity-90">Send your resume with the subject line: "Application - [Position Name]"</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Visit Our Office</CardTitle>
                </CardHeader>
                <CardContent className="text-left space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <span>Bhagwatipara, Rajkot</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <span>Popatpara, Rajkot</span>
                  </div>
                  <p className="text-sm opacity-90">Mon - Sat: 9:00 AM - 7:00 PM</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Careers;