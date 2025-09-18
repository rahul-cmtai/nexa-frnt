"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Trash2, Package, LayoutGrid, Rows, Filter, X } from "lucide-react"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000"

// Fixed categories array
const FIXED_CATEGORIES = ['Mattresses', 'Pillows', 'Protectors', 'Accessories']

export default function AdminProducts() {
  const { user } = useAuth()
  const [products, setProducts] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")

  const extractProductsArray = (data: any): any[] => {
    // Try common shapes: array | {products: []} | {data: []} | {data: {products: []}}
    if (Array.isArray(data)) return data
    if (Array.isArray(data?.products)) return data.products
    if (Array.isArray(data?.data)) return data.data
    if (Array.isArray(data?.data?.products)) return data.data.products
    return []
  }

  const csvToArray = (val: FormDataEntryValue | null): string[] => {
    const raw = (val as string) || ""
    return raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  }

  const numberOrUndefined = (val: FormDataEntryValue | null): number | undefined => {
    const num = Number(val as string)
    return Number.isFinite(num) ? num : undefined
  }

  const resolveImageSrc = (img: any): string => {
    if (!img) return ""
    if (typeof img === "string") {
      if (/^https?:\/\//i.test(img)) return img
      // Ensure leading slash then prefix with API base
      const path = img.startsWith("/") ? img : `/${img}`
      return `${API_BASE}${path}`
    }
    if (typeof img === "object") {
      // Common keys from different uploaders
      return (
        resolveImageSrc((img as any).secure_url) ||
        resolveImageSrc((img as any).url) ||
        resolveImageSrc((img as any).path) ||
        ""
      )
    }
    return ""
  }

  const buildMultipartFromForm = (formData: FormData): FormData => {
    const name = (formData.get("name") as string) || ""
    const slugInput = (formData.get("slug") as string) || ""
    const slug = slugInput || name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")

    const features = csvToArray(formData.get("features"))
    const firmness = csvToArray(formData.get("firmness"))
    const tags = csvToArray(formData.get("tags"))
    const color = csvToArray(formData.get("color"))
    const stones = csvToArray(formData.get("stones"))
    const bagSizes = csvToArray(formData.get("bagSizes"))

    const sizes = csvToArray(formData.get("sizes"))
      .map((chunk) => chunk.trim())
      .map((s) => {
        const [sName, priceStr, dimensions] = s.split("|").map((p) => p?.trim())
        const price = Number(priceStr)
        return {
          name: sName,
          price: Number.isFinite(price) ? price : undefined,
          dimensions: dimensions || undefined,
        }
      })
      .filter((x) => x.name)

    const specifications = {
      thickness: ((formData.get("spec_thickness") as string) || "").trim() || undefined,
      layers: ((formData.get("spec_layers") as string) || "").trim() || undefined,
      material: ((formData.get("spec_material") as string) || "").trim() || undefined,
      cover: ((formData.get("spec_cover") as string) || "").trim() || undefined,
      warranty: ((formData.get("spec_warranty") as string) || "").trim() || undefined,
      trial: ((formData.get("spec_trial") as string) || "").trim() || undefined,
    }

    const fd = new FormData()
    // Scalars
    fd.append("name", name)
    fd.append("slug", slug)
    fd.append("description", (formData.get("description") as string) || "")
    fd.append("rating", String(numberOrUndefined(formData.get("rating")) ?? 0))
    fd.append("reviews", String(numberOrUndefined(formData.get("reviews")) ?? 0))
    const badge = ((formData.get("badge") as string) || "").trim()
    if (badge) fd.append("badge", badge)
    fd.append("stock", String(Number.parseInt(((formData.get("stock") as string) || "0").toString()) || 0))
    fd.append("originalPrice", String(Number.parseFloat((formData.get("originalPrice") as string) || "0")))
    fd.append("price", String(Number.parseFloat((formData.get("price") as string) || "0")))
    fd.append("type", (formData.get("type") as string) || "")
    // Category (optional)
    const category = ((formData.get("category") as string) || "").trim()
    if (category) fd.append("category", category)
    const gender = ((formData.get("gender") as string) || "").trim()
    if (gender) fd.append("gender", gender)
    const material = ((formData.get("material") as string) || "").trim()
    if (material) fd.append("material", material)
    const dimensions = ((formData.get("dimensions") as string) || "").trim()
    if (dimensions) fd.append("dimensions", dimensions)
    const jewelleryCategory = ((formData.get("jewelleryCategory") as string) || "").trim()
    if (jewelleryCategory) fd.append("jewelleryCategory", jewelleryCategory)
    const materialType = ((formData.get("materialType") as string) || "").trim()
    if (materialType) fd.append("materialType", materialType)

    // Arrays/objects as JSON strings
    fd.append("features", JSON.stringify(features))
    fd.append("sizes", JSON.stringify(sizes))
    fd.append("firmness", JSON.stringify(firmness))
    fd.append("specifications", JSON.stringify(specifications))
    fd.append("tags", JSON.stringify(tags))
    fd.append("color", JSON.stringify(color))
    fd.append("stones", JSON.stringify(stones))
    fd.append("size", JSON.stringify(bagSizes))

    // Packaging
    const pkg = {
      length: numberOrUndefined(formData.get("pkg_length")),
      breadth: numberOrUndefined(formData.get("pkg_breadth")),
      height: numberOrUndefined(formData.get("pkg_height")),
    }
    const pkgWeight = numberOrUndefined(formData.get("adminPackagingWeight"))
    if (pkgWeight !== undefined) fd.append("adminPackagingWeight", String(pkgWeight))
    fd.append("adminPackagingDimension", JSON.stringify(pkg))

    // Images files (limit to 3)
    const img1 = formData.get("image1") as File | null
    const img2 = formData.get("image2") as File | null
    const img3 = formData.get("image3") as File | null
    ;[img1, img2, img3].forEach((file) => {
      if (file && (file as any).name) {
        fd.append("images", file)
      }
    })

    return fd
  }

  const fetchProducts = async () => {
    if (!user) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/api/v1/admin/products`, { credentials: "include" })
      if (!res.ok) throw new Error(`Failed to load products: ${res.status}`)
      const data = await res.json()
      const list = extractProductsArray(data)
      setProducts(Array.isArray(list) ? list : [])
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Failed to load products")
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [user])

  // Updated filtering logic to include category filter
  const filteredProducts = Array.isArray(products)
    ? products.filter(
        (product) => {
          // Search term filter
          const matchesSearch = (product.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.type || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.category || "").toLowerCase().includes(searchTerm.toLowerCase())
          
          // Category filter
          const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
          
          return matchesSearch && matchesCategory
        }
      )
    : []

  // Clear all filters function
  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("all")
  }

  const handleAddProduct = async (formData: FormData) => {
    const fd = buildMultipartFromForm(formData)

    try {
      const res = await fetch(`${API_BASE}/api/v1/admin/products`, {
        method: "POST",
        credentials: "include",
        body: fd,
      })
      if (!res.ok) throw new Error(`Failed to add product: ${res.status}`)
      await fetchProducts()
      setIsAddDialogOpen(false)
      setEditingProduct(null)
    } catch (e) {
      console.error(e)
      setError("Failed to add product")
    }
  }

  const handleUpdateProduct = async (formData: FormData) => {
    try {
      const fd = buildMultipartFromForm(formData)
      const id = editingProduct?.id || editingProduct?._id
      const res = await fetch(`${API_BASE}/api/v1/admin/products/${id}`, {
        method: "PUT",
        credentials: "include",
        body: fd,
      })
      if (!res.ok) throw new Error(`Failed to update product: ${res.status}`)
      await fetchProducts()
      setIsAddDialogOpen(false)
      setEditingProduct(null)
    } catch (e) {
      console.error(e)
      setError("Failed to update product")
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return
    }
    
    try {
      const id = (productId as any)?._id || productId
      const res = await fetch(`${API_BASE}/api/v1/admin/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (!res.ok) throw new Error(`Failed to delete product: ${res.status}`)
      await fetchProducts()
    } catch (e) {
      console.error(e)
      setError("Failed to delete product")
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Products Management</h1>
          <p className="text-lg text-slate-600 mt-2">Manage your mattress inventory and product catalog</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => { setIsAddDialogOpen(open); if (!open) setEditingProduct(null) }}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => { setEditingProduct(null) }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-3xl md:max-w-4xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
              <DialogDescription>{editingProduct ? "Update product details" : "Create a new product for your catalog"}</DialogDescription>
            </DialogHeader>
            <form action={editingProduct ? handleUpdateProduct : handleAddProduct} className="space-y-4">
              {/* Core */}
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" name="name" placeholder="Premium Memory Foam Mattress" required defaultValue={editingProduct?.name} />
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" name="slug" placeholder="premium-memory-foam-mattress" defaultValue={editingProduct?.slug} />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" placeholder="Product description..." defaultValue={editingProduct?.description} />
              </div>
              <div>
                <Label>Images (upload up to 3)</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1">
                  <div>
                    <Label htmlFor="image1" className="text-sm">Image 1</Label>
                    <Input id="image1" name="image1" type="file" accept="image/*" />
                  </div>
                  <div>
                    <Label htmlFor="image2" className="text-sm">Image 2</Label>
                    <Input id="image2" name="image2" type="file" accept="image/*" />
                  </div>
                  <div>
                    <Label htmlFor="image3" className="text-sm">Image 3</Label>
                    <Input id="image3" name="image3" type="file" accept="image/*" />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-1">Leave empty to keep existing images when editing.</p>
              </div>

              {/* UX/Display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rating">Rating (0-5)</Label>
                  <Input id="rating" name="rating" type="number" step="0.1" min="0" max="5" placeholder="0" defaultValue={editingProduct?.rating} />
                </div>
                <div>
                  <Label htmlFor="reviews">Reviews</Label>
                  <Input id="reviews" name="reviews" type="number" placeholder="0" defaultValue={editingProduct?.reviews} />
                </div>
              </div>
              <div>
                <Label htmlFor="badge">Badge</Label>
                <Input id="badge" name="badge" placeholder="Best Seller / Premium" defaultValue={editingProduct?.badge} />
              </div>
              <div>
                <Label htmlFor="features">Features (comma-separated)</Label>
                <Input id="features" name="features" placeholder="Cooling Gel, Memory Foam" defaultValue={(editingProduct?.features || []).join(", ")} />
              </div>
              <div>
                <Label htmlFor="sizes">Sizes (comma-separated entries: Name|Price|Dimensions)</Label>
                <Input id="sizes" name="sizes" placeholder="Queen|25000|78x60, King|30000|78x72" />
              </div>
              <div>
                <Label htmlFor="firmness">Firmness (comma-separated)</Label>
                <Input id="firmness" name="firmness" placeholder="Soft, Medium, Firm" defaultValue={(editingProduct?.firmness || []).join(", ")} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="spec_thickness">Spec: Thickness</Label>
                  <Input id="spec_thickness" name="spec_thickness" placeholder="8 inches" defaultValue={editingProduct?.specifications?.thickness} />
                </div>
                <div>
                  <Label htmlFor="spec_layers">Spec: Layers</Label>
                  <Input id="spec_layers" name="spec_layers" placeholder="5" defaultValue={editingProduct?.specifications?.layers} />
                </div>
                <div>
                  <Label htmlFor="spec_material">Spec: Material</Label>
                  <Input id="spec_material" name="spec_material" placeholder="Memory Foam" defaultValue={editingProduct?.specifications?.material} />
                </div>
                <div>
                  <Label htmlFor="spec_cover">Spec: Cover</Label>
                  <Input id="spec_cover" name="spec_cover" placeholder="Organic Cotton" defaultValue={editingProduct?.specifications?.cover} />
                </div>
                <div>
                  <Label htmlFor="spec_warranty">Spec: Warranty</Label>
                  <Input id="spec_warranty" name="spec_warranty" placeholder="10 Years" defaultValue={editingProduct?.specifications?.warranty} />
                </div>
                <div>
                  <Label htmlFor="spec_trial">Spec: Trial</Label>
                  <Input id="spec_trial" name="spec_trial" placeholder="100 Nights" defaultValue={editingProduct?.specifications?.trial} />
                </div>
              </div>

              {/* Pricing & Inventory */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="originalPrice">Original Price (₹)</Label>
                  <Input id="originalPrice" name="originalPrice" type="number" placeholder="30000" required defaultValue={editingProduct?.originalPrice} />
                </div>
                <div>
                  <Label htmlFor="price">Selling Price (₹)</Label>
                  <Input id="price" name="price" type="number" placeholder="25000" required defaultValue={editingProduct?.price} />
                </div>
              </div>
              <div>
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input id="stock" name="stock" type="number" placeholder="50" required defaultValue={editingProduct?.stock} />
              </div>

              {/* Categorization & Filtering */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select name="type" required defaultValue={editingProduct?.type}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="memory-foam">Memory Foam</SelectItem>
                      <SelectItem value="spring">Spring</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="latex">Latex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" defaultValue={editingProduct?.category}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mattresses">Mattresses</SelectItem>
                      <SelectItem value="Pillows">Pillows</SelectItem>
                      <SelectItem value="Protectors">Protectors</SelectItem>
                      <SelectItem value="Accessories">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Input id="gender" name="gender" placeholder="Unisex" defaultValue={editingProduct?.gender} />
                </div>
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input id="tags" name="tags" placeholder="festive, premium, new" defaultValue={(editingProduct?.tags || []).join(", ")} />
              </div>
              <div>
                <Label htmlFor="color">Colors (comma-separated)</Label>
                <Input id="color" name="color" placeholder="Blue, White" defaultValue={(editingProduct?.color || []).join(", ")} />
              </div>
              <div>
                <Label htmlFor="material">Material</Label>
                <Input id="material" name="material" placeholder="Cotton" defaultValue={editingProduct?.material} />
              </div>

              {/* Admin Packaging */}
              <div>
                <Label htmlFor="adminPackagingWeight">Packaging Weight (kg)</Label>
                <Input id="adminPackagingWeight" name="adminPackagingWeight" type="number" step="0.01" placeholder="12.5" defaultValue={editingProduct?.adminPackagingWeight} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="pkg_length">Pkg Length</Label>
                  <Input id="pkg_length" name="pkg_length" type="number" placeholder="78" defaultValue={editingProduct?.adminPackagingDimension?.length} />
                </div>
                <div>
                  <Label htmlFor="pkg_breadth">Pkg Breadth</Label>
                  <Input id="pkg_breadth" name="pkg_breadth" type="number" placeholder="60" defaultValue={editingProduct?.adminPackagingDimension?.breadth} />
                </div>
                <div>
                  <Label htmlFor="pkg_height">Pkg Height</Label>
                  <Input id="pkg_height" name="pkg_height" type="number" placeholder="8" defaultValue={editingProduct?.adminPackagingDimension?.height} />
                </div>
              </div>

              {/* Misc / Category-Specific */}
              <div>
                <Label htmlFor="dimensions">Dimensions (free text)</Label>
                <Input id="dimensions" name="dimensions" placeholder="Length: 18cm, Pendant: 2cm x 1.5cm" defaultValue={editingProduct?.dimensions} />
              </div>
              <div>
                <Label htmlFor="stones">Stones (comma-separated)</Label>
                <Input id="stones" name="stones" placeholder="Diamond, Ruby" defaultValue={(editingProduct?.stones || []).join(", ")} />
              </div>
              <div>
                <Label htmlFor="jewelleryCategory">Jewellery Category</Label>
                <Input id="jewelleryCategory" name="jewelleryCategory" placeholder="Rings" defaultValue={editingProduct?.jewelleryCategory} />
              </div>
              <div>
                <Label htmlFor="materialType">Material Type</Label>
                <Input id="materialType" name="materialType" placeholder="gold | silver | artificial" defaultValue={editingProduct?.materialType} />
              </div>
              <div>
                <Label htmlFor="bagSizes">Bag Sizes (comma-separated)</Label>
                <Input id="bagSizes" name="bagSizes" placeholder="sm, medium, lg" defaultValue={(editingProduct?.size || []).join(", ")} />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                {editingProduct ? "Update Product" : "Add Product"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Enhanced Search and Filters */}
      <Card className="mb-6 border-blue-200">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Category Filter Dropdown - Fixed Categories */}
            <div className="w-full sm:w-48">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Filter by category" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Mattresses">Mattresses</SelectItem>
                  <SelectItem value="Pillows">Pillows</SelectItem>
                  <SelectItem value="Protectors">Protectors</SelectItem>
                  <SelectItem value="Accessories">Accessories</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters Button */}
            {(searchTerm || selectedCategory !== "all") && (
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>
          
          {/* Active Filters Display */}
          {(searchTerm || selectedCategory !== "all") && (
            <div className="mt-4 flex flex-wrap gap-2">
              {searchTerm && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Search: "{searchTerm}"
                  <X 
                    className="h-3 w-3 cursor-pointer ml-1 hover:bg-slate-200 rounded" 
                    onClick={() => setSearchTerm("")}
                  />
                </Badge>
              )}
              {selectedCategory !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Category: {selectedCategory}
                  <X 
                    className="h-3 w-3 cursor-pointer ml-1 hover:bg-slate-200 rounded" 
                    onClick={() => setSelectedCategory("all")}
                  />
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Products Table/Grid */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-700 flex items-center gap-2 text-xl">
            <Package className="h-6 w-6" />
            Products ({filteredProducts.length})
          </CardTitle>
          <div className="flex items-center justify-between">
            <CardDescription className="text-base">
              Manage your inventory
              {selectedCategory !== "all" && ` - Filtered by: ${selectedCategory}`}
            </CardDescription>
            <div className="flex items-center gap-2">
              <Button 
                variant={viewMode === "table" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setViewMode("table")}
                className={viewMode === "table" ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                <Rows className="h-4 w-4" />
                <span className="ml-2 hidden sm:inline">Table</span>
              </Button>
              <Button 
                variant={viewMode === "grid" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                <LayoutGrid className="h-4 w-4" />
                <span className="ml-2 hidden sm:inline">Grid</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading && <div className="py-4 text-slate-600">Loading products...</div>}
          {error && <div className="py-2 text-red-600 bg-red-50 px-3 rounded border">{error}</div>}
          {!loading && filteredProducts.length === 0 && (
            <div className="py-8 text-center text-slate-500">
              <Package className="h-12 w-12 mx-auto text-slate-300 mb-3" />
              {searchTerm || selectedCategory !== "all" 
                ? "No products found matching your filters" 
                : "No products found. Add your first product to get started."}
            </div>
          )}
          {viewMode === "table" ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-base font-semibold">Images</TableHead>
                    <TableHead className="text-base font-semibold">Product Name</TableHead>
                    <TableHead className="text-base font-semibold">Type</TableHead>
                    <TableHead className="text-base font-semibold">Category</TableHead>
                    <TableHead className="text-base font-semibold">Original Price</TableHead>
                    <TableHead className="text-base font-semibold">Selling Price</TableHead>
                    <TableHead className="text-base font-semibold">Stock</TableHead>
                    <TableHead className="text-base font-semibold">Status</TableHead>
                    <TableHead className="text-base font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id || product._id} className="hover:bg-slate-50">
                      <TableCell>
                        <div className="grid grid-cols-3 gap-1">
                          {(product.images || []).slice(0, 3).map((img: any, idx: number) => {
                            const src = resolveImageSrc(img)
                            return (
                              <div key={idx} className="relative h-12 w-12 overflow-hidden rounded border bg-slate-50">
                                {src ? (
                                  <Image src={src} alt={product.name} fill sizes="48px" className="object-cover" />
                                ) : (
                                  <div className="h-full w-full bg-slate-100 flex items-center justify-center">
                                    <Package className="h-4 w-4 text-slate-400" />
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-base max-w-xs truncate" title={product.name}>
                        {product.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize text-sm">
                          {product.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-sm">
                          {product.category || "-"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-base">₹{(product.originalPrice || 0).toLocaleString()}</TableCell>
                      <TableCell className="font-semibold text-blue-600 text-base">₹{(product.price || 0).toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={`text-base ${(product.stock || 0) < 10 ? "text-orange-600 font-medium" : "text-green-600"}`}>
                          {product.stock ?? 0}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={(product.stock || 0) > 0 ? "default" : "secondary"}
                          className={(product.stock || 0) > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                        >
                          {(product.stock || 0) > 0 ? "In Stock" : "Out of Stock"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => { setEditingProduct(product); setIsAddDialogOpen(true) }}
                            className="hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id || product._id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id || product._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {(product.images || []).slice(0, 3).map((img: any, idx: number) => {
                      const src = resolveImageSrc(img)
                      return (
                        <div key={idx} className="relative h-20 w-full overflow-hidden rounded border bg-slate-50">
                          {src ? (
                            <Image src={src} alt={product.name} fill sizes="160px" className="object-cover" />
                          ) : (
                            <div className="h-full w-full bg-slate-100 flex items-center justify-center">
                              <Package className="h-6 w-6 text-slate-400" />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                  <div className="font-semibold mb-2 text-lg truncate" title={product.name}>{product.name}</div>
                  <div className="text-sm mb-2 flex gap-2 items-center flex-wrap">
                    <Badge variant="outline" className="capitalize">{product.type}</Badge>
                    <Badge variant="outline">{product.category || "-"}</Badge>
                  </div>
                  <div className="text-sm text-slate-600 mb-1">Original: ₹{(product.originalPrice || 0).toLocaleString()}</div>
                  <div className="text-sm font-medium text-blue-600 mb-3">Price: ₹{(product.price || 0).toLocaleString()}</div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-sm ${(product.stock || 0) < 10 ? "text-orange-600 font-medium" : "text-green-600"}`}>
                      Stock: {product.stock ?? 0}
                    </span>
                    <Badge variant={(product.stock || 0) > 0 ? "default" : "secondary"}
                      className={(product.stock || 0) > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {(product.stock || 0) > 0 ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1" 
                      onClick={() => { setEditingProduct(product); setIsAddDialogOpen(true) }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteProduct(product.id || product._id)} 
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
