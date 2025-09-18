"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Edit, Trash2, Mail, Phone, MessageSquare, Loader2, AlertCircle, RefreshCw } from "lucide-react"

interface Contact {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  type: "inquiry" | "support" | "complaint" | "feedback"
  status: "new" | "in-progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  assignedTo: string
  submittedAt: string
  lastUpdated: string
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  const getApiConfig = () => {
    const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000/api/v1"
    const token = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null
    
    return {
      baseUrl: API_BASE.replace(/\/+$/, ""),
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      }
    }
  }

  const fetchContacts = async (showLoading = true) => {
    try {
      if (showLoading) {
        setIsLoading(true)
      }
      setError(null)

      const { baseUrl, headers } = getApiConfig()
      const url = `${baseUrl}/contact/admin`

      console.log('Fetching contacts from URL:', url)

      const response = await fetch(url, {
        method: 'GET',
        headers,
        cache: 'no-cache'
      })

      console.log('Response status:', response.status)

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorData.error || errorMessage
        } catch (parseError) {
          console.error('Error parsing error response:', parseError)
        }

        throw new Error(errorMessage)
      }

      const json = await response.json()
      console.log('API Response:', json)

      if (!json.success) {
        throw new Error(json.message || 'API returned unsuccessful response')
      }

      if (!Array.isArray(json.data)) {
        throw new Error('API returned invalid data format')
      }

      const normalizedData = json.data.map((item: any) => ({
        id: item._id || item.id,
        name: item.fullName || item.name || 'Unknown',
        email: item.email || 'No email',
        phone: item.phone || 'N/A',
        subject: item.subject || 'No Subject',
        message: item.message || 'No message',
        type: item.type || 'inquiry',
        status: item.status || 'new',
        priority: item.priority || 'medium',
        assignedTo: item.assignedTo || 'Unassigned',
        submittedAt: item.createdAt || item.submittedAt || new Date().toISOString(),
        lastUpdated: item.updatedAt || item.lastUpdated || new Date().toISOString(),
      }))

      setContacts(normalizedData)
      console.log('Successfully loaded contacts:', normalizedData.length)

    } catch (err: any) {
      console.error('Fetch error:', err)
      let errorMessage = err.message || 'Failed to fetch contact inquiries'
      
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        errorMessage = 'Network error: Unable to connect to server. Please check if the API server is running.'
      } else if (err.message.includes('401')) {
        errorMessage = 'Authentication failed: Please log in again.'
      } else if (err.message.includes('403')) {
        errorMessage = 'Access denied: You do not have permission to access this resource.'
      } else if (err.message.includes('404')) {
        errorMessage = 'API endpoint not found: Please check the server configuration.'
      } else if (err.message.includes('500')) {
        errorMessage = 'Server error: Please try again later or contact support.'
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchContacts()
  }, [])

  const handleStatusChange = async (id: string, status: Contact["status"]) => {
    const originalContacts = [...contacts]
    
    const updatedContacts = contacts.map((contact) =>
      contact.id === id 
        ? { ...contact, status, lastUpdated: new Date().toISOString() } 
        : contact
    )
    setContacts(updatedContacts)

    try {
      const { baseUrl, headers } = getApiConfig()
      const response = await fetch(`${baseUrl}/contact/admin/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Failed to update status: ${response.statusText}`)
      }

      console.log('Status updated successfully for contact:', id)
    } catch (error: any) {
      console.error('Failed to update status:', error)
      setContacts(originalContacts)
      alert(`Error: ${error.message}`)
    }
  }

  const handleDeleteContact = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this inquiry? This action cannot be undone.")) {
      return
    }

    const originalContacts = [...contacts]
    setContacts(contacts.filter((contact) => contact.id !== id))

    try {
      const { baseUrl, headers } = getApiConfig()
      const response = await fetch(`${baseUrl}/contact/admin/${id}`, {
        method: "DELETE",
        headers,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Failed to delete inquiry: ${response.statusText}`)
      }

      console.log('Contact deleted successfully:', id)
    } catch (error: any) {
      console.error('Failed to delete inquiry:', error)
      setContacts(originalContacts)
      alert(`Error: ${error.message}`)
    }
  }

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch = [contact.name, contact.email, contact.subject]
      .some(field => field.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = selectedStatus === "all" || contact.status === selectedStatus
    const matchesType = selectedType === "all" || contact.type === selectedType
    return matchesSearch && matchesStatus && matchesType
  })

  const viewContact = (contact: Contact) => {
    setSelectedContact(contact)
    setIsViewDialogOpen(true)
  }

  const getStatusColor = (status: string) => {
    const colors = {
      "new": "bg-blue-100 text-blue-800",
      "in-progress": "bg-yellow-100 text-yellow-800",
      "resolved": "bg-green-100 text-green-800",
      "closed": "bg-gray-100 text-gray-800"
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getTypeColor = (type: string) => {
    const colors = {
      "inquiry": "bg-blue-100 text-blue-800",
      "support": "bg-purple-100 text-purple-800",
      "complaint": "bg-red-100 text-red-800",
      "feedback": "bg-green-100 text-green-800"
    }
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      "low": "bg-gray-100 text-gray-800",
      "medium": "bg-yellow-100 text-yellow-800",
      "high": "bg-orange-100 text-orange-800",
      "urgent": "bg-red-100 text-red-800"
    }
    return colors[priority as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Contact Management</h1>
          <p className="text-lg text-gray-600 mt-1">Manage customer inquiries and support requests</p>
        </div>
        <Button 
          onClick={() => fetchContacts()} 
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div className="flex-1">
                <p className="text-red-800 font-medium">Error loading contacts</p>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
              <Button onClick={() => fetchContacts()} variant="outline" size="sm">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-600">Total Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{contacts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-600">New</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {contacts.filter((c) => c.status === "new").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-600">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {contacts.filter((c) => c.status === "in-progress").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-600">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {contacts.filter((c) => c.status === "resolved").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-600">High Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {contacts.filter((c) => c.priority === "high" || c.priority === "urgent").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name, email, or subject..."
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
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="inquiry">Inquiry</SelectItem>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="complaint">Complaint</SelectItem>
                <SelectItem value="feedback">Feedback</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {isLoading ? "Loading Contacts..." : "Customer Contacts"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
                    <p className="mt-2 text-gray-500">Loading contacts...</p>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <AlertCircle className="w-8 h-8 mx-auto text-red-400 mb-2" />
                    <p className="text-red-600">{error}</p>
                  </TableCell>
                </TableRow>
              ) : filteredContacts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-gray-500">
                    {contacts.length === 0 ? 'No contacts available.' : 'No contacts match your search criteria.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredContacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{contact.name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <Mail className="w-3 h-3" />
                          {contact.email}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <Phone className="w-3 h-3" />
                          {contact.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <div className="font-medium truncate">{contact.subject}</div>
                        <div className="text-sm text-gray-500 truncate">
                          {contact.message.substring(0, 50)}...
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(contact.type)}>{contact.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(contact.priority)}>{contact.priority}</Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={contact.status}
                        onValueChange={(value: Contact["status"]) => handleStatusChange(contact.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{contact.assignedTo}</TableCell>
                    <TableCell>
                      {new Date(contact.submittedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => viewContact(contact)}>
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" disabled>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteContact(contact.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Contact Details</DialogTitle>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Name</Label>
                  <p className="text-sm">{selectedContact.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Email</Label>
                  <p className="text-sm">{selectedContact.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Phone</Label>
                  <p className="text-sm">{selectedContact.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Type</Label>
                  <Badge className={getTypeColor(selectedContact.type)}>{selectedContact.type}</Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Subject</Label>
                <p className="text-sm">{selectedContact.subject}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Message</Label>
                <p className="text-sm bg-gray-50 p-3 rounded-md">{selectedContact.message}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Status</Label>
                  <Badge className={getStatusColor(selectedContact.status)}>{selectedContact.status}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Priority</Label>
                  <Badge className={getPriorityColor(selectedContact.priority)}>{selectedContact.priority}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Assigned To</Label>
                  <p className="text-sm">{selectedContact.assignedTo}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
