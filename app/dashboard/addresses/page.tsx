"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MapPin, Plus, Edit, Trash2, Check, Star } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Address {
  id: string
  name: string
  phone: string
  street: string
  city: string
  state: string
  pincode: string
  country: string
  isDefault: boolean
  type: "home" | "work" | "other"
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockAddresses: Address[] = [
      {
        id: "1",
        name: "John Doe",
        phone: "+91 98765 43210",
        street: "123 Main Street, Apartment 4B",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        country: "India",
        isDefault: true,
        type: "home"
      },
      {
        id: "2",
        name: "John Doe",
        phone: "+91 98765 43210",
        street: "456 Business Park, Office 201",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400002",
        country: "India",
        isDefault: false,
        type: "work"
      }
    ]

    setTimeout(() => {
      setAddresses(mockAddresses)
      setIsLoading(false)
    }, 1000)
  }, [])

  const [formData, setFormData] = useState<Omit<Address, "id">>({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    isDefault: false,
    type: "home"
  })

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
      isDefault: false,
      type: "home"
    })
    setEditingAddress(null)
  }

  const handleInputChange = (field: keyof Omit<Address, "id">, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In real app, this would make an API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (editingAddress) {
        // Update existing address
        setAddresses(prev => prev.map(addr => 
          addr.id === editingAddress.id 
            ? { ...formData, id: editingAddress.id }
            : formData.isDefault ? { ...addr, isDefault: false } : addr
        ))
        toast({
          title: "Address Updated",
          description: "Your address has been successfully updated.",
        })
      } else {
        // Add new address
        const newAddress = {
          ...formData,
          id: Date.now().toString()
        }
        
        setAddresses(prev => [
          ...prev.map(addr => formData.isDefault ? { ...addr, isDefault: false } : addr),
          newAddress
        ])
        toast({
          title: "Address Added",
          description: "Your new address has been successfully added.",
        })
      }

      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save address. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (address: Address) => {
    setEditingAddress(address)
    setFormData({
      name: address.name,
      phone: address.phone,
      street: address.street,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      country: address.country,
      isDefault: address.isDefault,
      type: address.type
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (addressId: string) => {
    if (addresses.find(addr => addr.id === addressId)?.isDefault) {
      toast({
        title: "Cannot Delete",
        description: "You cannot delete your default address. Please set another address as default first.",
        variant: "destructive",
      })
      return
    }

    try {
      setAddresses(prev => prev.filter(addr => addr.id !== addressId))
      toast({
        title: "Address Deleted",
        description: "Your address has been successfully deleted.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete address. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSetDefault = async (addressId: string) => {
    try {
      setAddresses(prev => prev.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId
      })))
      toast({
        title: "Default Address Updated",
        description: "Your default address has been updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update default address. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getAddressTypeIcon = (type: string) => {
    switch (type) {
      case "home":
        return "🏠"
      case "work":
        return "🏢"
      default:
        return "📍"
    }
  }

  const getAddressTypeColor = (type: string) => {
    switch (type) {
      case "home":
        return "bg-green-100 text-green-800"
      case "work":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading && addresses.length === 0) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <MapPin className="h-8 w-8 animate-pulse text-blue-600 mx-auto mb-4" />
            <p className="text-slate-600">Loading your addresses...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">My Addresses</h1>
            <p className="text-lg text-slate-600 mt-2">Manage your shipping addresses</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={resetForm}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Address
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingAddress ? "Edit Address" : "Add New Address"}
                </DialogTitle>
                <DialogDescription>
                  {editingAddress 
                    ? "Update your address information below." 
                    : "Add a new shipping address to your account."
                  }
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      value={formData.street}
                      onChange={(e) => handleInputChange("street", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      value={formData.pincode}
                      onChange={(e) => handleInputChange("pincode", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Select
                      value={formData.country}
                      onValueChange={(value) => handleInputChange("country", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="India">India</SelectItem>
                        <SelectItem value="United States">United States</SelectItem>
                        <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="Australia">Australia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="type">Address Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => handleInputChange("type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="home">Home</SelectItem>
                        <SelectItem value="work">Work</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isDefault"
                      checked={formData.isDefault}
                      onChange={(e) => handleInputChange("isDefault", e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="isDefault">Set as default address</Label>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : editingAddress ? "Update Address" : "Add Address"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Addresses List */}
      {addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addresses.map((address) => (
            <Card key={address.id} className="border-blue-200 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getAddressTypeIcon(address.type)}</span>
                    <div>
                      <CardTitle className="text-blue-700">{address.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAddressTypeColor(address.type)}`}>
                          {address.type.charAt(0).toUpperCase() + address.type.slice(1)}
                        </span>
                        {address.isDefault && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(address)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(address.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-slate-600">{address.street}</p>
                  <p className="text-sm text-slate-600">
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                  <p className="text-sm text-slate-600">{address.country}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">{address.phone}</p>
                </div>
                {!address.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetDefault(address.id)}
                    className="w-full bg-transparent"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Set as Default
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-blue-200">
          <CardContent className="text-center py-12">
            <MapPin className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No addresses saved</h3>
            <p className="text-slate-600 mb-6">
              Add your first address to get started with faster checkout.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Address
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
