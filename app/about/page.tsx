"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Award, Users, Truck, Shield, Heart, Star, Calendar, TrendingUp, Globe, Zap } from "lucide-react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"

// Enhanced Timeline Component with Better Visual Design
function TimelineItem({ milestone, index }: { milestone: any, index: number }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const isLeft = index % 2 === 0
  
  return (
    <div className="relative flex items-center w-full" ref={ref}>
      {/* Timeline content container */}
      <div className="flex items-center w-full relative">
        
        {/* Left side content */}
        <motion.div
          className={`w-1/2 ${isLeft ? 'pr-12 text-right' : 'opacity-0'}`}
          initial={{ opacity: 0, x: isLeft ? -50 : 0 }}
          animate={isInView ? { opacity: isLeft ? 1 : 0, x: 0 } : { opacity: 0, x: isLeft ? -50 : 0 }}
          transition={{ duration: 0.8, delay: milestone.delay }}
        >
          {isLeft && (
            <Card className="relative bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-end gap-3 mb-4">
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">{milestone.year}</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide">{milestone.stats}</div>
                  </div>
                  <div className={`w-12 h-12 ${milestone.color} rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <milestone.icon className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="font-semibold text-xl mb-3 text-slate-900">{milestone.title}</h3>
                <p className="text-slate-600 leading-relaxed">{milestone.description}</p>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Center timeline with dot */}
        <motion.div
          className="relative z-20 flex-shrink-0 w-6 flex justify-center"
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.5, delay: milestone.delay + 0.2 }}
        >
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 top-1/2 w-0.5 h-32 bg-gradient-to-b from-primary/30 to-primary/10 transform -translate-x-1/2 -translate-y-16 -z-10"></div>
            
            {/* Main dot */}
            <motion.div
              className={`w-6 h-6 ${milestone.color} rounded-full border-4 border-white shadow-lg relative z-10`}
              whileHover={{ scale: 1.2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Pulse effect */}
              <div className={`absolute inset-0 ${milestone.color} rounded-full animate-ping opacity-20`}></div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right side content */}
        <motion.div
          className={`w-1/2 ${!isLeft ? 'pl-12 text-left' : 'opacity-0'}`}
          initial={{ opacity: 0, x: !isLeft ? 50 : 0 }}
          animate={isInView ? { opacity: !isLeft ? 1 : 0, x: 0 } : { opacity: 0, x: !isLeft ? 50 : 0 }}
          transition={{ duration: 0.8, delay: milestone.delay }}
        >
          {!isLeft && (
            <Card className="relative bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 ${milestone.color} rounded-full flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <milestone.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-primary">{milestone.year}</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide">{milestone.stats}</div>
                  </div>
                </div>
                <h3 className="font-semibold text-xl mb-3 text-slate-900">{milestone.title}</h3>
                <p className="text-slate-600 leading-relaxed">{milestone.description}</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default function AboutPage() {
  const stats = [
    { label: "Happy Customers", value: "50,000+", icon: Users },
    { label: "Years of Excellence", value: "15+", icon: Award },
    { label: "Cities Served", value: "100+", icon: Truck },
    { label: "Customer Satisfaction", value: "98%", icon: Star },
  ]

  const values = [
    {
      icon: Heart,
      title: "Customer First",
      description: "Every decision we make is centered around providing the best sleep experience for our customers.",
    },
    {
      icon: Award,
      title: "Quality Excellence",
      description: "We use only the finest materials and latest sleep technology in all our products.",
    },
    {
      icon: Shield,
      title: "Trust & Reliability",
      description: "With 15+ years in the industry, we've built lasting relationships based on trust and quality.",
    },
    {
      icon: Truck,
      title: "Service Excellence",
      description: "From free delivery to 100-night trials, we ensure exceptional service at every step.",
    },
  ]

  const journeyMilestones = [
    {
      year: "2008",
      title: "The Beginning",
      description: "Started as Babji Mattress House with a vision to provide quality sleep solutions to Indian families. Our first workshop in Mumbai focused on handcrafted mattresses.",
      icon: Calendar,
      color: "bg-blue-500",
      delay: 0.1,
      stats: "1 Workshop"
    },
    {
      year: "2015",
      title: "Innovation & Growth",
      description: "Introduced memory foam technology and expanded to 25 cities across India. Launched our first online platform to reach customers nationwide.",
      icon: TrendingUp,
      color: "bg-emerald-500",
      delay: 0.3,
      stats: "25 Cities"
    },
    {
      year: "2020",
      title: "Digital Transformation",
      description: "Rebranded to Nexa Rest and launched our comprehensive online experience. Introduced the 100-night sleep trial and contactless delivery services.",
      icon: Globe,
      color: "bg-purple-500",
      delay: 0.5,
      stats: "100+ Cities"
    },
    {
      year: "2024",
      title: "Next Level of Sleep",
      description: "Today, we serve over 50,000 happy customers across 100+ cities with our premium mattress collection and exceptional customer service.",
      icon: Zap,
      color: "bg-orange-500",
      delay: 0.7,
      stats: "50K+ Customers"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-blue-50 to-slate-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Badge className="mb-4 bg-secondary text-secondary-foreground">Our Story</Badge>
                <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-6">
                  Crafting Better Sleep for Over 15 Years
                </h1>
                <p className="text-xl text-muted-foreground mb-8 text-pretty">
                  At Nexa Rest, we believe that quality sleep is the foundation of a healthy, productive life. Since
                  2008, we've been dedicated to creating premium mattresses that deliver the perfect balance of comfort,
                  support, and durability.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <stat.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <Image
                  src="/luxury-bedroom-with-premium-mattress--modern-minim.jpg"
                  alt="About Nexa Rest"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">Our Mission</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
                To revolutionize the way India sleeps by providing innovative, high-quality mattresses that combine
                traditional craftsmanship with modern sleep science.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="text-center p-6 border-0 shadow-lg">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <value.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-3">{value.title}</h3>
                    <p className="text-muted-foreground text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Journey Section - Alternating Timeline */}
        <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 bg-primary text-primary-foreground px-4 py-1">
                Our Story
              </Badge>
              <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4 text-slate-900">
                Our Journey
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                From a small family business to India's trusted mattress brand
              </p>
            </motion.div>

            <div className="max-w-6xl mx-auto relative">
              {/* Main timeline line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/60 to-primary/30 transform -translate-x-1/2 z-10"></div>
              
              {/* Timeline items */}
              <div className="space-y-24">
                {journeyMilestones.map((milestone, index) => (
                  <TimelineItem key={index} milestone={milestone} index={index} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Team Section */}
        <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e2e8f0' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 bg-gradient-to-r from-primary to-blue-600 text-white px-4 py-1 text-sm font-medium">
                Our Team
              </Badge>
              <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
                Meet Our Dream Team
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                The passionate visionaries and sleep experts who are dedicated to revolutionizing your rest
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Founder & CEO */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <CardContent className="p-8 text-center relative z-10">
                    {/* Avatar with gradient border */}
                    <div className="relative mb-6">
                      <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-1 shadow-lg">
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden">
                          <Image
                            src="/indian-professional-man.png"
                            alt="Rajesh Babji"
                            width={120}
                            height={120}
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                      </div>
                      {/* Floating badge */}
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                        CEO
                      </div>
                    </div>

                    <h3 className="font-bold text-2xl mb-2 text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                      Rajesh Babji
                    </h3>
                    <p className="text-blue-600 font-semibold text-lg mb-4">Founder & CEO</p>
                    
                    <p className="text-slate-600 leading-relaxed mb-6 text-sm">
                      15+ years in sleep tech and customer satisfaction. Visionary leader passionate about transforming India's sleep culture.
                    </p>

                    {/* Social links */}
                    <div className="flex justify-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors cursor-pointer">
                        <span className="text-blue-600 text-xs font-bold">LI</span>
                      </div>
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors cursor-pointer">
                        <span className="text-blue-600 text-xs font-bold">TW</span>
                      </div>
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors cursor-pointer">
                        <span className="text-blue-600 text-xs font-bold">IG</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Head of Design */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <CardContent className="p-8 text-center relative z-10">
                    {/* Avatar with gradient border */}
                    <div className="relative mb-6">
                      <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-1 shadow-lg">
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden">
                          <Image
                            src="/indian-woman-professional.png"
                            alt="Priya Sharma"
                            width={120}
                            height={120}
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                      </div>
                      {/* Floating badge */}
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                        DESIGN
                      </div>
                    </div>

                    <h3 className="font-bold text-2xl mb-2 text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                      Priya Sharma
                    </h3>
                    <p className="text-blue-600 font-semibold text-lg mb-4">Head of Design</p>
                    
                    <p className="text-slate-600 leading-relaxed mb-6 text-sm">
                      Expert in ergonomic design and sleep comfort optimization. Creates innovative solutions that blend aesthetics with functionality.
                    </p>

                    {/* Social links */}
                    <div className="flex justify-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors cursor-pointer">
                        <span className="text-blue-600 text-xs font-bold">LI</span>
                      </div>
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors cursor-pointer">
                        <span className="text-blue-600 text-xs font-bold">TW</span>
                      </div>
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors cursor-pointer">
                        <span className="text-blue-600 text-xs font-bold">IG</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quality Assurance */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="group md:col-span-2 lg:col-span-1"
              >
                <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <CardContent className="p-8 text-center relative z-10">
                    {/* Avatar with gradient border */}
                    <div className="relative mb-6">
                      <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-1 shadow-lg">
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center overflow-hidden">
                          <Image
                            src="/indian-man-smiling.png"
                            alt="Amit Kumar"
                            width={120}
                            height={120}
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                      </div>
                      {/* Floating badge */}
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                        QA
                      </div>
                    </div>

                    <h3 className="font-bold text-2xl mb-2 text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                      Amit Kumar
                    </h3>
                    <p className="text-blue-600 font-semibold text-lg mb-4">Quality Assurance</p>
                    
                    <p className="text-slate-600 leading-relaxed mb-6 text-sm">
                      Ensures every mattress meets our highest quality standards. Meticulous attention to detail guarantees your perfect sleep experience.
                    </p>

                    {/* Social links */}
                    <div className="flex justify-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors cursor-pointer">
                        <span className="text-blue-600 text-xs font-bold">LI</span>
                      </div>
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors cursor-pointer">
                        <span className="text-blue-600 text-xs font-bold">TW</span>
                      </div>
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors cursor-pointer">
                        <span className="text-blue-600 text-xs font-bold">IG</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Team Stats */}
            <motion.div 
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900 mb-2">15+</div>
                <div className="text-sm text-slate-600 font-medium">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900 mb-2">50+</div>
                <div className="text-sm text-slate-600 font-medium">Team Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900 mb-2">100+</div>
                <div className="text-sm text-slate-600 font-medium">Awards Won</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-slate-900 mb-2">24/7</div>
                <div className="text-sm text-slate-600 font-medium">Support</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">Ready for Your Next Level of Sleep?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto text-pretty">
              Join thousands of satisfied customers who have transformed their sleep with Nexa Rest mattresses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-primary px-8 py-3 rounded-lg font-medium hover:bg-slate-100 transition-colors">
                Shop Mattresses
              </button>
              <button className="border border-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors">
                Contact Us
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
