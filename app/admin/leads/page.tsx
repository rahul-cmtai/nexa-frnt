// Specifies that this is a Client Component. In Next.js, this is required
// for components that use hooks like useState and useEffect.
"use client"

// Import necessary hooks and components from React and other libraries.
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
// Icons for a richer UI
import { UserCheck, Search, Phone, Mail, Calendar, Eye, Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
const API_BASE = process.env.NEXT_PUBLIC_API_BASE   


// Defines the data structure for a single lead using a TypeScript interface.
// This ensures type safety throughout the component.
interface Lead {
  id: string
  name: string
  email: string
  phone: string
  source: string
  status: "new" | "contacted" | "qualified" | "converted" | "lost" // A specific set of allowed values
  interest: string
  message: string
  createdAt: string
  lastContact: string | null
  referenceImage?: string
  version?: number
}

// The main functional component for the page.
export default function LeadsPage() {
  // === STATE MANAGEMENT ===
  // Holds the array of lead objects fetched from the API.
  const [leads, setLeads] = useState<Lead[]>([])
  // Tracks whether the component is currently fetching data to show a loading indicator.
  const [isLoading, setIsLoading] = useState(true)
  // Stores any error message that occurs during the API call.
  const [error, setError] = useState<string | null>(null)
  
  // UI-related state for filtering and searching.
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // === API INTERACTION ===
  // A helper function to create the necessary headers for API requests.
  // It securely gets the JWT access token from localStorage.
  const getApiHeaders = () => {
    // Try multiple common keys to maximize compatibility with existing auth flow
    const token = typeof window !== 'undefined'
      ? (localStorage.getItem("auth_token") || localStorage.getItem("accessToken") || localStorage.getItem("token"))
      : null

    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  // An asynchronous function to fetch the leads data from the backend.
  const fetchLeads = async (showLoading = true) => {
    try {
      if (showLoading) {
        setIsLoading(true)
      }
      setError(null)

      const headers = getApiHeaders()
      // The specific API endpoint to get all leads for an admin.
      const url = `${API_BASE}/api/v1/contact/admin`

      const response = await fetch(url, {
        method: 'GET',
        headers,
        cache: 'no-cache' // Ensures the latest data is always fetched.
      })

      // If the HTTP response is not successful (e.g., 404, 500), throw an error.
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        // Try to parse a more specific error message from the server's response body.
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorData.error || errorMessage
        } catch (parseError) {
          // Ignore if parsing fails.
        }
        throw new Error(errorMessage)
      }

      // Ensure the server returned JSON, not HTML or something else.
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server did not return JSON data')
      }

      const json = await response.json()

      // Accept multiple possible response shapes
      const rawArray: any[] = Array.isArray(json)
        ? json
        : Array.isArray(json.data)
          ? json.data
          : Array.isArray(json.contacts)
            ? json.contacts
            : Array.isArray(json.items)
              ? json.items
              : []

      // **Data Normalization**: Map backend fields to Lead interface
      const normalizedData = rawArray.map((item: any): Lead => {
        // Normalize status from values like "New" to lowercase enum
        const backendStatus = String(item.status || item.leadStatus || item.stage || "new").toLowerCase()
        const allowedStatuses: Lead["status"][] = ["new", "contacted", "qualified", "converted", "lost"]
        const finalStatus = allowedStatuses.includes(backendStatus as any)
          ? (backendStatus as Lead["status"])
          : "new"

        return {
          id: item._id || item.id || item.contactId || String(Math.random()),
          name: item.fullName || item.name || (item.firstName && item.lastName ? `${item.firstName} ${item.lastName}` : (item.firstName || item.lastName || 'Unknown')),
          email: item.email || item.emailAddress || 'No email',
          phone: item.phone || item.phoneNumber || 'N/A',
          source: item.source || item.sourceType || 'unknown',
          status: finalStatus,
          interest: item.interest || item.productInterest || item.subject || 'General Inquiry',
          message: item.message || item.description || item.notes || 'No message',
          createdAt: item.createdAt || item.submittedAt || item.created_at || new Date().toISOString(),
          lastContact: item.updatedAt || item.lastContact || item.lastUpdated || item.updated_at || null,
          referenceImage: item.referenceImage || item.image || undefined,
          version: typeof item.__v === 'number' ? item.__v : undefined,
        }
      })

      setLeads(normalizedData)

    } catch (err: any) {
      // **Robust Error Handling**: Provides user-friendly messages for common problems.
      let errorMessage = err.message || 'Failed to fetch leads'
      if (err.message.includes('fetch')) {
        errorMessage = 'Network error: Unable to connect to server. Please check if the API server is running.'
      } else if (err.message.includes('401')) {
        errorMessage = 'Authentication failed: Please log in again.'
      }
      setError(errorMessage)
    } finally {
      // This always runs, ensuring the loading state is turned off.
      setIsLoading(false)
    }
  }

  // === LIFECYCLE HOOK ===
  // The `useEffect` hook with an empty dependency array `[]` runs only ONCE
  // when the component is first mounted. This is the standard way to fetch initial data.
  useEffect(() => {
    fetchLeads()
  }, [])

  // === DATA DERIVATION & COMPUTATION ===
  // This filters the `leads` array based on the `searchTerm` and `statusFilter` state.
  // It runs on every render, so the UI is always in sync with the state.
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.interest.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // A simple utility function to return CSS classes for color-coding status badges.
  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "contacted":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "qualified":
        return "bg-violet-100 text-violet-800 border-violet-200"
      case "converted":
        return "bg-green-100 text-green-800 border-green-200"
      case "lost":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // An asynchronous function to update a lead's status.
  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    // ... validation logic ...

    const originalLeads = [...leads]
    
    // **Optimistic Update**: The UI is updated *immediately* without waiting for the API.
    // This makes the application feel much faster to the user.
    setLeads(
      leads.map((lead) =>
        lead.id === leadId 
          ? { ...lead, status: newStatus as Lead["status"], lastContact: new Date().toISOString() } 
          : lead,
      ),
    )

    try {
      const headers = getApiHeaders()
      // Makes a PUT request to the specific endpoint for the lead being updated.
      const response = await fetch(`${API_BASE}/api/v1/contact/admin/${leadId}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ status: newStatus }),
      })

      // If the API call fails, throw an error.
      if (!response.ok) {
        throw new Error(`Failed to update status`)
      }
    } catch (error: any) {
      console.error('Failed to update lead status:', error)
      // **Rollback**: If the API call fails, revert the UI to its original state.
      setLeads(originalLeads) 
      alert(`Error: ${error.message}`)
    }
  }

  // Calculates the conversion rate from the current list of leads.
  const conversionRate = leads.length > 0 
    ? Math.round((leads.filter(l => l.status === "converted").length / leads.length) * 100)
    : 0

  // === JSX RENDERING ===
  // This section defines the HTML structure of the component.
  return (
    <div className="p-8">
      {/* Header with title and refresh button */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <UserCheck className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-semibold">Leads</h1>
          <Badge variant="secondary">{leads.length}</Badge>
        </div>
        <Button variant="outline" size="sm" onClick={() => fetchLeads(false)}>
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </div>

      {/* Conditional Rendering: Only show this block if there is an error. */}
      {error && (
        <Card className="border-red-200 bg-red-50 mb-6">
          <CardContent className="p-4 flex items-center gap-3 text-red-700">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards: A grid displaying key metrics calculated from the `leads` state. */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Leads</CardTitle></CardHeader>
          <CardContent className="text-2xl font-semibold">{leads.length}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">New</CardTitle></CardHeader>
          <CardContent className="text-2xl font-semibold">{leads.filter(l => l.status === 'new').length}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Qualified</CardTitle></CardHeader>
          <CardContent className="text-2xl font-semibold">{leads.filter(l => l.status === 'qualified').length}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Conversion Rate</CardTitle></CardHeader>
          <CardContent className="text-2xl font-semibold">{conversionRate}%</CardContent>
        </Card>
      </div>

      {/* Filters: Search input and status dropdown. Their `onChange` handlers update the state. */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, interest..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card>
        <CardHeader className="px-6 py-4 border-b"><CardTitle className="text-base">All Leads</CardTitle></CardHeader>
        <CardContent className="p-0">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/40">
                <tr>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider p-3">Name</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider p-3">Email</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider p-3">Phone</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider p-3">Message</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider p-3">Status</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider p-3">Interest</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider p-3">Created</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider p-3">Last Contact</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={8} className="p-6 text-muted-foreground flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Loading...</td></tr>
                ) : error ? (
                  <tr><td colSpan={8} className="p-6 text-red-600 flex items-center gap-2"><AlertCircle className="h-4 w-4" /> {error}</td></tr>
                ) : filteredLeads.length === 0 ? (
                  <tr><td colSpan={8} className="p-6 text-muted-foreground">No leads match your search criteria.</td></tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="border-b hover:bg-muted/20">
                      <td className="p-3 font-medium">{lead.name}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /><span>{lead.email}</span></div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /><span>{lead.phone}</span></div>
                      </td>
                      <td className="p-3 max-w-[360px]">
                        <div className="text-sm text-muted-foreground line-clamp-2">{lead.message}</div>
                      </td>
                      <td className="p-3">
                        <select
                          value={lead.status}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                          className={`border text-xs rounded-md px-2 py-1 ${getStatusColor(lead.status)}`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="converted">Converted</option>
                          <option value="lost">Lost</option>
                        </select>
                      </td>
                      <td className="p-3">{lead.interest}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /><span>{new Date(lead.createdAt).toLocaleString()}</span></div>
                      </td>
                      <td className="p-3">{lead.lastContact ? new Date(lead.lastContact).toLocaleString() : '-'}</td>
                      <td className="p-3">
                        <Button variant="outline" size="sm" onClick={() => { setSelectedLead(lead); setIsDialogOpen(true) }}>
                          <Eye className="h-4 w-4 mr-2" /> View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile list */}
          <div className="md:hidden space-y-3 p-3">
            {isLoading ? (
              <div className="p-4 text-muted-foreground flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Loading...</div>
            ) : error ? (
              <div className="p-4 text-red-600 flex items-center gap-2"><AlertCircle className="h-4 w-4" /> {error}</div>
            ) : filteredLeads.length === 0 ? (
              <div className="p-4 text-muted-foreground">No leads match your search criteria.</div>
            ) : (
              filteredLeads.map((lead) => (
                <div key={lead.id} className="border rounded-md p-4 bg-background">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium">{lead.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                        <Mail className="h-3 w-3" /> {lead.email}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                        <Phone className="h-3 w-3" /> {lead.phone}
                      </div>
                    </div>
                    <select
                      value={lead.status}
                      onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                      className={`border text-xs rounded-md px-2 py-1 ${getStatusColor(lead.status)}`}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="converted">Converted</option>
                      <option value="lost">Lost</option>
                    </select>
                  </div>
                  <div className="text-sm text-muted-foreground mt-3">{lead.message}</div>
                  <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2"><Calendar className="h-3 w-3" /> {new Date(lead.createdAt).toLocaleString()}</div>
                    <Button variant="outline" size="sm" onClick={() => { setSelectedLead(lead); setIsDialogOpen(true) }}>
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-3">
              <div>
                <div className="text-xs text-muted-foreground">Name</div>
                <div className="font-medium">{selectedLead.name}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Email</div>
                <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /><span>{selectedLead.email}</span></div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Phone</div>
                <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /><span>{selectedLead.phone}</span></div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Status</div>
                <div><Badge className={getStatusColor(selectedLead.status)} variant="outline">{selectedLead.status}</Badge></div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Interest</div>
                <div>{selectedLead.interest}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Message</div>
                <div className="whitespace-pre-wrap text-sm">{selectedLead.message}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-muted-foreground">Created</div>
                  <div>{new Date(selectedLead.createdAt).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Last Contact</div>
                  <div>{selectedLead.lastContact ? new Date(selectedLead.lastContact).toLocaleString() : '-'}</div>
                </div>
              </div>
              {selectedLead.referenceImage && (
                <div>
                  <div className="text-xs text-muted-foreground">Reference Image</div>
                  <img src={selectedLead.referenceImage} alt="Reference" className="mt-2 rounded-md border max-h-64 object-contain" />
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}