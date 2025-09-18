"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Trash2, Star, Eye } from "lucide-react"

interface Testimonial {
  id: string
  customerName: string
  email: string
  rating: number
  title: string
  content: string
  product: string
  status: "approved" | "pending" | "rejected"
  featured: boolean
  submittedAt: string
  location: string
}

const mockTestimonials: Testimonial[] = [
  {
    id: "1",
    customerName: "Priya Sharma",
    email: "priya.sharma@email.com",
    rating: 5,
    title: "Best Sleep of My Life!",
    content:
      "I have been using the Nexa Rest mattress for 6 months now and it has completely transformed my sleep quality. The memory foam is perfect and I wake up without any back pain.",
    product: "Memory Foam Mattress",
    status: "approved",
    featured: true,
    submittedAt: "2024-01-15",
    location: "Mumbai, Maharashtra",
  },
  {
    id: "2",
    customerName: "Rajesh Kumar",
    email: "rajesh.k@email.com",
    rating: 4,
    title: "Great Value for Money",
    content:
      "Excellent mattress quality at a reasonable price. The delivery was prompt and the customer service was very helpful throughout the process.",
    product: "Hybrid Mattress",
    status: "approved",
    featured: false,
    submittedAt: "2024-01-12",
    location: "Delhi, NCR",
  },
  {
    id: "3",
    customerName: "Anita Patel",
    email: "anita.patel@email.com",
    rating: 5,
    title: "Highly Recommended",
    content:
      "The cooling technology really works! No more night sweats. The mattress is firm yet comfortable. Will definitely recommend to friends and family.",
    product: "Cooling Gel Mattress",
    status: "pending",
    featured: false,
    submittedAt: "2024-01-20",
    location: "Ahmedabad, Gujarat",
  },
]

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(mockTestimonials)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [viewingTestimonial, setViewingTestimonial] = useState<Testimonial | null>(null)

  const [newTestimonial, setNewTestimonial] = useState({
    customerName: "",
    email: "",
    rating: 5,
    title: "",
    content: "",
    product: "",
    location: "",
    status: "pending" as const,
    featured: false,
  })

  const filteredTestimonials = testimonials.filter((testimonial) => {
    const matchesSearch =
      testimonial.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial.product.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || testimonial.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const handleAddTestimonial = () => {
    const testimonial: Testimonial = {
      id: Date.now().toString(),
      ...newTestimonial,
      submittedAt: new Date().toISOString().split("T")[0],
    }
    setTestimonials([...testimonials, testimonial])
    setNewTestimonial({
      customerName: "",
      email: "",
      rating: 5,
      title: "",
      content: "",
      product: "",
      location: "",
      status: "pending",
      featured: false,
    })
    setIsAddDialogOpen(false)
  }

  const handleDeleteTestimonial = (id: string) => {
    setTestimonials(testimonials.filter((testimonial) => testimonial.id !== id))
  }

  const handleStatusChange = (id: string, status: "approved" | "pending" | "rejected") => {
    setTestimonials(
      testimonials.map((testimonial) => (testimonial.id === id ? { ...testimonial, status } : testimonial)),
    )
  }

  const toggleFeatured = (id: string) => {
    setTestimonials(
      testimonials.map((testimonial) =>
        testimonial.id === id ? { ...testimonial, featured: !testimonial.featured } : testimonial,
      ),
    )
  }

  const handleViewTestimonial = (testimonial: Testimonial) => {
    setViewingTestimonial(testimonial)
    setIsViewDialogOpen(true)
  }

  const handleEditTestimonial = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial)
    setNewTestimonial({
      customerName: testimonial.customerName,
      email: testimonial.email,
      rating: testimonial.rating,
      title: testimonial.title,
      content: testimonial.content,
      product: testimonial.product,
      location: testimonial.location,
      status: testimonial.status,
      featured: testimonial.featured,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateTestimonial = () => {
    if (editingTestimonial) {
      setTestimonials(testimonials.map(testimonial => 
        testimonial.id === editingTestimonial.id 
          ? { 
              ...testimonial, 
              ...newTestimonial
            }
          : testimonial
      ))
      setEditingTestimonial(null)
      setNewTestimonial({
        customerName: "",
        email: "",
        rating: 5,
        title: "",
        content: "",
        product: "",
        location: "",
        status: "pending",
        featured: false,
      })
      setIsEditDialogOpen(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
    ))
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900">Testimonials Management</h1>
        <p className="text-lg text-slate-600 mt-2">Manage customer reviews and testimonials</p>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-slate-900">Customer Testimonials</h2>
            <p className="text-lg text-slate-600">Manage customer reviews and testimonials</p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Testimonial
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Testimonial</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    value={newTestimonial.customerName}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, customerName: e.target.value })}
                    placeholder="Enter customer name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newTestimonial.email}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, email: e.target.value })}
                    placeholder="Enter email"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="product">Product</Label>
                  <Input
                    id="product"
                    value={newTestimonial.product}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, product: e.target.value })}
                    placeholder="Enter product name"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newTestimonial.location}
                    onChange={(e) => setNewTestimonial({ ...newTestimonial, location: e.target.value })}
                    placeholder="Enter location"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newTestimonial.title}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, title: e.target.value })}
                  placeholder="Enter testimonial title"
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={newTestimonial.content}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, content: e.target.value })}
                  placeholder="Enter testimonial content"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rating">Rating</Label>
                  <Select
                    value={newTestimonial.rating.toString()}
                    onValueChange={(value) => setNewTestimonial({ ...newTestimonial, rating: Number(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Star</SelectItem>
                      <SelectItem value="2">2 Stars</SelectItem>
                      <SelectItem value="3">3 Stars</SelectItem>
                      <SelectItem value="4">4 Stars</SelectItem>
                      <SelectItem value="5">5 Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newTestimonial.status}
                    onValueChange={(value: any) => setNewTestimonial({ ...newTestimonial, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleAddTestimonial} className="w-full bg-blue-600 hover:bg-blue-700">
                Add Testimonial
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <Card className="border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-slate-600">Total Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{testimonials.length}</div>
            </CardContent>
          </Card>
          <Card className="border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-slate-600">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {testimonials.filter((t) => t.status === "approved").length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-slate-600">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {testimonials.filter((t) => t.status === "pending").length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-slate-600">Avg Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {(testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="border-blue-200">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search testimonials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Testimonials Table */}
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-700 flex items-center gap-2">
              <Star className="h-5 w-5" />
              Customer Testimonials ({filteredTestimonials.length})
            </CardTitle>
            <CardDescription>Manage customer reviews and testimonials</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden sm:table-cell">Product</TableHead>
                    <TableHead className="hidden md:table-cell">Rating</TableHead>
                    <TableHead className="hidden sm:table-cell">Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Featured</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTestimonials.map((testimonial) => (
                    <TableRow key={testimonial.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{testimonial.customerName}</div>
                          <div className="text-sm text-slate-500 sm:hidden">{testimonial.product}</div>
                          <div className="text-sm text-slate-500 md:hidden">
                            <div className="flex items-center space-x-1">{renderStars(testimonial.rating)}</div>
                          </div>
                          <div className="text-sm text-slate-500 lg:hidden">
                            {testimonial.featured ? "Featured" : "Not Featured"}
                          </div>
                          <div className="text-sm text-slate-500 md:hidden">{testimonial.submittedAt}</div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="outline">{testimonial.product}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center space-x-1">{renderStars(testimonial.rating)}</div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Select
                          value={testimonial.status}
                          onValueChange={(value: any) => handleStatusChange(testimonial.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Button
                          variant={testimonial.featured ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleFeatured(testimonial.id)}
                          className={testimonial.featured ? "bg-blue-600 hover:bg-blue-700" : ""}
                        >
                          {testimonial.featured ? "Featured" : "Feature"}
                        </Button>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{testimonial.submittedAt}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewTestimonial(testimonial)}
                            title="View Testimonial"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditTestimonial(testimonial)}
                            title="Edit Testimonial"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteTestimonial(testimonial.id)}
                            className="text-red-600 hover:text-red-700"
                            title="Delete Testimonial"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Testimonial Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>View Testimonial</DialogTitle>
          </DialogHeader>
          {viewingTestimonial && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-600">Customer Name</Label>
                  <p className="text-lg font-semibold text-slate-900">{viewingTestimonial.customerName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Email</Label>
                  <p className="text-slate-900">{viewingTestimonial.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Product</Label>
                  <Badge variant="outline">{viewingTestimonial.product}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Location</Label>
                  <p className="text-slate-900">{viewingTestimonial.location}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Rating</Label>
                  <div className="flex items-center space-x-1">{renderStars(viewingTestimonial.rating)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Status</Label>
                  <Badge className={getStatusColor(viewingTestimonial.status)}>{viewingTestimonial.status}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Featured</Label>
                  <Badge variant={viewingTestimonial.featured ? "default" : "outline"}>
                    {viewingTestimonial.featured ? "Yes" : "No"}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Submitted</Label>
                  <p className="text-slate-900">{viewingTestimonial.submittedAt}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-600">Title</Label>
                <p className="text-lg font-semibold text-slate-900 bg-slate-50 p-3 rounded-lg">{viewingTestimonial.title}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-600">Content</Label>
                <div className="text-slate-900 bg-slate-50 p-4 rounded-lg whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {viewingTestimonial.content}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Testimonial Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Testimonial</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-customerName">Customer Name</Label>
                <Input
                  id="edit-customerName"
                  value={newTestimonial.customerName}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, customerName: e.target.value })}
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={newTestimonial.email}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, email: e.target.value })}
                  placeholder="Enter email"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-product">Product</Label>
                <Input
                  id="edit-product"
                  value={newTestimonial.product}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, product: e.target.value })}
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  value={newTestimonial.location}
                  onChange={(e) => setNewTestimonial({ ...newTestimonial, location: e.target.value })}
                  placeholder="Enter location"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={newTestimonial.title}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, title: e.target.value })}
                placeholder="Enter testimonial title"
              />
            </div>
            <div>
              <Label htmlFor="edit-content">Content</Label>
              <Textarea
                id="edit-content"
                value={newTestimonial.content}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, content: e.target.value })}
                placeholder="Enter testimonial content"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-rating">Rating</Label>
                <Select
                  value={newTestimonial.rating.toString()}
                  onValueChange={(value) => setNewTestimonial({ ...newTestimonial, rating: Number(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Star</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={newTestimonial.status}
                  onValueChange={(value: any) => setNewTestimonial({ ...newTestimonial, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-featured"
                checked={newTestimonial.featured}
                onChange={(e) => setNewTestimonial({ ...newTestimonial, featured: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="edit-featured">Featured Testimonial</Label>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleUpdateTestimonial} className="flex-1 bg-blue-600 hover:bg-blue-700">
                Update Testimonial
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
