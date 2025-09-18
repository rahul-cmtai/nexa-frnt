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
import { Plus, Search, Edit, Trash2, Settings, Eye } from "lucide-react"

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: string
  category: string
  status: "active" | "inactive" | "maintenance"
  bookings: number
  rating: number
}

const mockServices: Service[] = [
  {
    id: "1",
    name: "Free Home Trial",
    description: "100-night risk-free trial with free pickup if not satisfied",
    price: 0,
    duration: "100 nights",
    category: "Trial",
    status: "active",
    bookings: 245,
    rating: 4.8,
  },
  {
    id: "2",
    name: "White Glove Delivery",
    description: "Premium delivery service with setup and old mattress removal",
    price: 2999,
    duration: "2-3 hours",
    category: "Delivery",
    status: "active",
    bookings: 189,
    rating: 4.9,
  },
  {
    id: "3",
    name: "Sleep Consultation",
    description: "One-on-one consultation with sleep experts to find your perfect mattress",
    price: 1499,
    duration: "45 minutes",
    category: "Consultation",
    status: "active",
    bookings: 156,
    rating: 4.7,
  },
  {
    id: "4",
    name: "Mattress Cleaning",
    description: "Professional deep cleaning service for your mattress",
    price: 3999,
    duration: "2 hours",
    category: "Maintenance",
    status: "inactive",
    bookings: 78,
    rating: 4.6,
  },
]

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>(mockServices)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [viewingService, setViewingService] = useState<Service | null>(null)

  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: 0,
    duration: "",
    category: "",
    status: "active" as "active" | "inactive" | "maintenance",
  })

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || service.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const handleAddService = () => {
    const service: Service = {
      id: Date.now().toString(),
      ...newService,
      bookings: 0,
      rating: 0,
    }
    setServices([...services, service])
    setNewService({
      name: "",
      description: "",
      price: 0,
      duration: "",
      category: "",
      status: "active",
    })
    setIsAddDialogOpen(false)
  }

  const handleDeleteService = (id: string) => {
    setServices(services.filter((service) => service.id !== id))
  }

  const handleViewService = (service: Service) => {
    setViewingService(service)
    setIsViewDialogOpen(true)
  }

  const handleEditService = (service: Service) => {
    setEditingService(service)
    setNewService({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      category: service.category,
      status: service.status,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateService = () => {
    if (editingService) {
      setServices(services.map(service => 
        service.id === editingService.id 
          ? { 
              ...service, 
              ...newService
            }
          : service
      ))
      setEditingService(null)
      setNewService({
        name: "",
        description: "",
        price: 0,
        duration: "",
        category: "",
        status: "active",
      })
      setIsEditDialogOpen(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900">Services Management</h1>
        <p className="text-lg text-slate-600 mt-2">Manage your services and offerings</p>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-slate-900">Services</h2>
            <p className="text-lg text-slate-600">Create and manage your service offerings</p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add New Service
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Service Name</Label>
                <Input
                  id="name"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  placeholder="Enter service name"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={newService.category}
                  onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                  placeholder="Enter category"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newService.price}
                    onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={newService.duration}
                    onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                    placeholder="e.g., 2 hours"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  placeholder="Enter service description"
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={newService.status}
                  onValueChange={(value: any) => setNewService({ ...newService, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddService} className="w-full bg-blue-600 hover:bg-blue-700">
                Add Service
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <Card className="border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-slate-600">Total Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{services.length}</div>
            </CardContent>
          </Card>
          <Card className="border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-slate-600">Active Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {services.filter((s) => s.status === "active").length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-slate-600">Total Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {services.reduce((sum, service) => sum + service.bookings, 0)}
              </div>
            </CardContent>
          </Card>
          <Card className="border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-slate-600">Avg Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {(services.reduce((sum, service) => sum + service.rating, 0) / services.length).toFixed(1)}
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
                  placeholder="Search services..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Services Table */}
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-700 flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Services ({filteredServices.length})
            </CardTitle>
            <CardDescription>Manage your service offerings and bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead className="hidden sm:table-cell">Category</TableHead>
                    <TableHead className="hidden md:table-cell">Price</TableHead>
                    <TableHead className="hidden lg:table-cell">Duration</TableHead>
                    <TableHead className="hidden sm:table-cell">Status</TableHead>
                    <TableHead className="hidden md:table-cell">Bookings</TableHead>
                    <TableHead className="hidden lg:table-cell">Rating</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServices.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{service.name}</div>
                          <div className="text-sm text-slate-500 sm:hidden">{service.category}</div>
                          <div className="text-sm text-slate-500 md:hidden">
                            {service.price === 0 ? "Free" : `₹${service.price.toLocaleString()}`}
                          </div>
                          <div className="text-sm text-slate-500 lg:hidden">{service.duration}</div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge variant="outline">{service.category}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {service.price === 0 ? "Free" : `₹${service.price.toLocaleString()}`}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{service.duration}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge className={getStatusColor(service.status)}>{service.status}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{service.bookings}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center">
                          <span className="text-yellow-500">★</span>
                          <span className="ml-1">{service.rating}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewService(service)}
                            title="View Service"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditService(service)}
                            title="Edit Service"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteService(service.id)}
                            className="text-red-600 hover:text-red-700"
                            title="Delete Service"
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

      {/* View Service Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>View Service</DialogTitle>
          </DialogHeader>
          {viewingService && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-600">Service Name</Label>
                  <p className="text-lg font-semibold text-slate-900">{viewingService.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Category</Label>
                  <Badge variant="outline">{viewingService.category}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Price</Label>
                  <p className="text-slate-900 font-semibold">
                    {viewingService.price === 0 ? "Free" : `₹${viewingService.price.toLocaleString()}`}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Duration</Label>
                  <p className="text-slate-900">{viewingService.duration}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Status</Label>
                  <Badge className={getStatusColor(viewingService.status)}>{viewingService.status}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Bookings</Label>
                  <p className="text-slate-900">{viewingService.bookings}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Rating</Label>
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1 text-slate-900">{viewingService.rating}</span>
                  </div>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-600">Description</Label>
                <p className="text-slate-900 bg-slate-50 p-4 rounded-lg">{viewingService.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Service Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Service Name</Label>
              <Input
                id="edit-name"
                value={newService.name}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                placeholder="Enter service name"
              />
            </div>
            <div>
              <Label htmlFor="edit-category">Category</Label>
              <Input
                id="edit-category"
                value={newService.category}
                onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                placeholder="Enter category"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-price">Price (₹)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={newService.price}
                  onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="edit-duration">Duration</Label>
                <Input
                  id="edit-duration"
                  value={newService.duration}
                  onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                  placeholder="e.g., 2 hours"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                placeholder="Enter service description"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={newService.status}
                onValueChange={(value: any) => setNewService({ ...newService, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleUpdateService} className="flex-1 bg-blue-600 hover:bg-blue-700">
                Update Service
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
