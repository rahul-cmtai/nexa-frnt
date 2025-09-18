"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MapPin, Phone, Mail, Clock, MessageCircle, Headphones, ChevronDown, ChevronUp, Loader2 } from "lucide-react"
import Image from "next/image"

export default function ContactPage() {
  // State for form fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  // State for submission status
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const faqData = [
    {
      question: "How long does delivery take?",
      answer: "We deliver within 7 business days across India with free delivery and setup. For metro cities, delivery is typically within 3-5 business days."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 100-night sleep trial. If you're not satisfied with your mattress, we'll pick it up for free and provide a full refund. No questions asked."
    },
    {
      question: "Do you offer warranty?",
      answer: "Yes, all our mattresses come with a 10-year comprehensive warranty covering manufacturing defects, sagging, and structural issues."
    },
    {
      question: "Can I try the mattress before buying?",
      answer: "Absolutely! You can visit our showroom to test our mattresses, or take advantage of our 100-night home trial to experience the comfort in your own space."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, UPI, net banking, EMI options, and cash on delivery for your convenience."
    },
    {
      question: "Do you provide mattress cleaning services?",
      answer: "Yes, we offer professional mattress cleaning and maintenance services to help extend the life of your mattress and maintain hygiene."
    },
    {
      question: "What sizes are available?",
      answer: "We offer all standard sizes: Single (36x75), Double (48x75), Queen (60x78), and King (72x78) in both regular and extra-long variants."
    },
    {
      question: "How do I choose the right firmness?",
      answer: "Our sleep experts can help you choose based on your sleeping position, weight, and personal preference. We also offer a sleep assessment tool on our website."
    }
  ]

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  // --- UPDATED SUBMIT HANDLER WITH API LOGIC ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const data = new FormData()
    // Frontend 'name' is mapped to backend 'fullName'
    data.append("fullName", formData.name)
    data.append("email", formData.email)
    data.append("phone", formData.phone)
    data.append("subject", formData.subject)
    data.append("message", formData.message)

    try {
      const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000/api/v1").replace(/\/+$/, "")
      
      const res = await fetch(`${API_BASE}/contact`, {
        method: "POST",
        // The browser sets the Content-Type header automatically for FormData
        body: data,
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Something went wrong. Please try again.")
      }
      
      setSuccess("Thank you for your message! We'll get back to you soon.")
      // Reset form on success
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" })

    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
      // Clear messages after 5 seconds
      setTimeout(() => {
        setSuccess(null)
        setError(null)
      }, 5000)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Banner (No changes) */}
      <div className="relative h-[70vh] overflow-hidden">
        <Image
          src="/luxury-bedroom-with-premium-mattress--modern-minim.jpg"
          alt="Contact Us - Premium Mattress Store"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <div className="inline-block mb-4">
              <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto mb-6"></div>
            </div>
            <h1 className="font-playfair text-6xl md:text-8xl font-bold mb-6 drop-shadow-2xl tracking-tight">
              Contact Us
            </h1>
            <p className="text-xl md:text-3xl max-w-5xl mx-auto text-pretty drop-shadow-lg font-light leading-relaxed">
              Experience luxury sleep consultation with our premium mattress experts
            </p>
            <div className="mt-8">
              <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-600 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        {/* Statistics Section (No changes) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl border border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-3">10K+</div>
            <div className="text-sm font-medium text-gray-700 uppercase tracking-wider">Happy Customers</div>
          </div>
          <div className="text-center p-8 bg-gradient-to-br from-sky-50 to-sky-100/50 rounded-2xl border border-sky-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-sky-800 bg-clip-text text-transparent mb-3">24/7</div>
            <div className="text-sm font-medium text-gray-700 uppercase tracking-wider">Customer Support</div>
          </div>
          <div className="text-center p-8 bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-2xl border border-indigo-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent mb-3">100+</div>
            <div className="text-sm font-medium text-gray-700 uppercase tracking-wider">Cities Served</div>
          </div>
          <div className="text-center p-8 bg-gradient-to-br from-cyan-50 to-cyan-100/50 rounded-2xl border border-cyan-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-cyan-800 bg-clip-text text-transparent mb-3">10</div>
            <div className="text-sm font-medium text-gray-700 uppercase tracking-wider">Years Warranty</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information (No changes) */}
          <div className="lg:col-span-1 space-y-8">
            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-blue-50 to-blue-100/30 shadow-lg hover:scale-105">
              <CardHeader className="pb-4 bg-gradient-to-r from-blue-500/10 to-blue-600/10">
                <CardTitle className="flex items-center gap-3 text-blue-800 text-xl">
                  <div className="p-2 bg-blue-500/20 rounded-lg"><Phone className="w-6 h-6" /></div>
                  Call Us
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-3">+91 98765 43210</p>
                <p className="text-gray-600 mb-6 font-medium">Monday to Saturday: 10:00 AM - 7:30 PM</p>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <Phone className="w-5 h-5 mr-2" /> Call Now
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-sky-50 to-sky-100/30 shadow-lg hover:scale-105">
              <CardHeader className="pb-4 bg-gradient-to-r from-sky-500/10 to-sky-600/10">
                <CardTitle className="flex items-center gap-3 text-sky-800 text-xl">
                  <div className="p-2 bg-sky-500/20 rounded-lg"><Mail className="w-6 h-6" /></div>
                  Email Support
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-xl font-bold text-sky-800 mb-3">support@nexarest.com</p>
                <p className="text-gray-600 mb-6 font-medium">We typically respond within 24 hours</p>
                <Button variant="outline" className="w-full border-2 border-sky-500 text-sky-700 hover:bg-sky-50 font-semibold py-3 rounded-xl transition-all duration-300">
                  <Mail className="w-5 h-5 mr-2" /> Send Email
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-indigo-50 to-indigo-100/30 shadow-lg hover:scale-105">
              <CardHeader className="pb-4 bg-gradient-to-r from-indigo-500/10 to-indigo-600/10">
                <CardTitle className="flex items-center gap-3 text-indigo-800 text-xl">
                  <div className="p-2 bg-indigo-500/20 rounded-lg"><MessageCircle className="w-6 h-6" /></div>
                  Live Chat
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-6 font-medium">Chat with our sleep experts for instant help</p>
                <Button variant="outline" className="w-full border-2 border-indigo-500 text-indigo-700 hover:bg-indigo-50 font-semibold py-3 rounded-xl transition-all duration-300">
                  <MessageCircle className="w-5 h-5 mr-2" /> Start Chat
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-cyan-50 to-cyan-100/30 shadow-lg hover:scale-105">
              <CardHeader className="pb-4 bg-gradient-to-r from-cyan-500/10 to-cyan-600/10">
                <CardTitle className="flex items-center gap-3 text-cyan-800 text-xl">
                  <div className="p-2 bg-cyan-500/20 rounded-lg"><MapPin className="w-6 h-6" /></div>
                  Visit Our Store
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="font-bold text-cyan-800 mb-3 text-lg">Nexa Rest Showroom</p>
                <p className="text-gray-600 mb-4 font-medium">123 Sleep Street, Comfort Colony<br />Mumbai, Maharashtra 400001</p>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-6 font-medium"><Clock className="w-4 h-4" />Mon-Sat: 10 AM - 8 PM, Sun: 11 AM - 6 PM</div>
                <Button variant="outline" className="w-full border-2 border-cyan-500 text-cyan-700 hover:bg-cyan-50 font-semibold py-3 rounded-xl transition-all duration-300">
                  <MapPin className="w-5 h-5 mr-2" /> Get Directions
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50/50">
              <CardHeader className="bg-gradient-to-r from-blue-500/10 via-blue-600/5 to-blue-500/10 p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg"><Headphones className="w-8 h-8 text-white" /></div>
                  <div>
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Send Us a Message</CardTitle>
                    <p className="text-gray-600 mt-2 font-medium">Fill out the form below and we'll get back to you within 24 hours</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Full Name *</Label>
                      <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" required className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-300" />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Email Address *</Label>
                      <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-300" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Phone Number</Label>
                      <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter your phone number" className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-300" />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="subject" className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Subject *</Label>
                      <Select value={formData.subject} onValueChange={(value) => setFormData((prev) => ({ ...prev, subject: value }))}>
                        <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-300">
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-2 border-gray-200 shadow-xl">
                          <SelectItem value="product-inquiry" className="py-3">Product Inquiry</SelectItem>
                          <SelectItem value="order-support" className="py-3">Order Support</SelectItem>
                          <SelectItem value="delivery-query" className="py-3">Delivery Query</SelectItem>
                          <SelectItem value="warranty-claim" className="py-3">Warranty Claim</SelectItem>
                          <SelectItem value="return-exchange" className="py-3">Return/Exchange</SelectItem>
                          <SelectItem value="feedback" className="py-3">Feedback</SelectItem>
                          <SelectItem value="other" className="py-3">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="message" className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Message *</Label>
                    <Textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="Tell us how we can help you..." rows={6} required className="border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl transition-all duration-300 resize-none" />
                  </div>

                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg" size="lg" disabled={isLoading}>
                    {isLoading ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending...</>
                    ) : (
                      "Send Message"
                    )}
                  </Button>
                  
                  {/* Submission feedback messages */}
                  <div className="h-5 text-center mt-4">
                    {success && <p className="font-semibold text-green-600">{success}</p>}
                    {error && <p className="font-semibold text-red-600">{error}</p>}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Fixed Map Section (No changes) */}
            <Card className="mt-8 shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50/50">
                {/* ... */}
            </Card>

          </div>
        </div>
      </main>

      {/* Full Width FAQ Section (No changes) */}
      <section className="w-full bg-gradient-to-br from-blue-50 to-sky-100/50 py-16">
        {/* ... */}
      </section>

      <Footer />
    </div>
  )
}