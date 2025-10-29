"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Trash2, Eye, BookOpen } from "lucide-react"

interface BlogPost {
  id?: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  status: "published" | "draft" | "archived"
  category: string // derived from first tag for display only
  publishedAt: string
  createdAt?: string
  views: number
  coverImage?: string
  gallery?: string[]
  tags?: string[]
  readTime?: string
  authorAvatarUrl?: string
  authorBio?: string
  seo?: {
    title?: string
    description?: string
    keywords?: string[]
    ogImage?: string
  }
}

// Data now loads from backend API; no static mocks

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null)
  const [viewingBlog, setViewingBlog] = useState<BlogPost | null>(null)
  const API_BASE = useMemo(() => process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000", [])
  const [isLoading, setIsLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'table'|'grid'>('table')

  const getResourceType = (url: string): "image" | "video" | "raw" | "auto" => {
    const lower = (url || "").toLowerCase()
    if (/(\.mp4|\.webm|\.ogg)$/.test(lower)) return "video"
    if (/(\.pdf|\.zip|\.rar|\.7z|\.docx?)$/.test(lower)) return "raw"
    if (/(\.jpg|\.jpeg|\.png|\.gif|\.webp|\.svg)$/.test(lower)) return "image"
    return "auto"
  }

  const [newBlog, setNewBlog] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    author: "",
    category: "",
    status: "draft" as "published" | "draft" | "archived",
    coverImage: "",
    galleryStr: "",
    tagsStr: "",
    readTime: "5 min read",
    authorAvatarUrl: "",
    authorBio: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywordsStr: "",
    seoOgImage: "",
    publishedAt: "",
    // upload-only fields
    coverImageFile: null as File | null,
    galleryFiles: [] as File[],
  })

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || blog.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const getAuthHeaders = () => {
    const envToken = process.env.NEXT_PUBLIC_ADMIN_TOKEN
    const token = typeof window !== 'undefined'
      ? (
          envToken ||
          localStorage.getItem("auth_token") ||
          localStorage.getItem("accessToken") ||
          localStorage.getItem("nexa_rest_token") ||
          localStorage.getItem("jwt") ||
          localStorage.getItem("token")
        )
      : (envToken || null)
    console.log("Auth token:", token ? "Found" : "Not found")
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  const getAuthHeadersMultipart = (): Record<string, string> => {
    const envToken = process.env.NEXT_PUBLIC_ADMIN_TOKEN
    const token = typeof window !== 'undefined'
      ? (
          envToken ||
          localStorage.getItem("auth_token") ||
          localStorage.getItem("accessToken") ||
          localStorage.getItem("nexa_rest_token") ||
          localStorage.getItem("jwt") ||
          localStorage.getItem("token")
        )
      : (envToken || null)
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  async function fetchBlogs() {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.set("search", searchTerm)
      // backend supports filters in query string
      const res = await fetch(`${API_BASE}/api/v1/blogs?${params.toString()}`, {
        method: "GET",
        credentials: "include",
        headers: getAuthHeaders(),
        cache: 'no-cache',
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.message || json?.error || "Failed to load blogs")

      const rawArray: any[] =
        (Array.isArray(json?.data?.data) && json.data.data) ||
        (Array.isArray(json?.data?.items) && json.data.items) ||
        (Array.isArray(json?.items) && json.items) ||
        (Array.isArray(json?.data) && json.data) ||
        (Array.isArray(json) && (json as any)) ||
        []

      const items = rawArray.map((b: any): BlogPost => ({
        id: b.id || b._id,
        title: b.title,
        slug: b.slug,
        excerpt: b.excerpt ?? "",
        content: b.content ?? "",
        author: b.author?.name || b.author || "",
        category: Array.isArray(b.tags) && b.tags.length ? b.tags[0] : "",
        status: (b.status || (b.isPublished ? 'published' : 'draft')) as any,
        publishedAt: b.publishedAt ? String(b.publishedAt).slice(0, 10) : (b.date ? String(b.date).slice(0, 10) : ""),
        createdAt: b.createdAt ? String(b.createdAt).slice(0,10) : undefined,
        views: typeof b.views === "number" ? b.views : 0,
        coverImage: typeof b.coverImage === 'string' ? b.coverImage : (b.coverImage?.url || undefined),
        gallery: Array.isArray(b.gallery)
          ? b.gallery.map((m: any) => (typeof m === 'string' ? m : m?.url)).filter(Boolean)
          : undefined,
        tags: Array.isArray(b.tags) ? b.tags : undefined,
        readTime: b.readTime || undefined,
        authorAvatarUrl: b.author?.avatarUrl || undefined,
        authorBio: b.author?.bio || undefined,
        seo: b.seo ? {
          title: b.seo.title || undefined,
          description: b.seo.description || undefined,
          keywords: Array.isArray(b.seo.keywords) ? b.seo.keywords : undefined,
          ogImage: b.seo.ogImage || undefined,
        } : undefined,
      })) as BlogPost[]

      setBlogs(items)
    } catch (err) {
      console.error("Failed to fetch blogs", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAddBlog = async () => {
    try {
      const galleryUrls = newBlog.galleryStr.split(",").map(s => s.trim()).filter(Boolean)
      const tags = newBlog.tagsStr.split(",").map(s => s.trim()).filter(Boolean)
      const seoKeywords = newBlog.seoKeywordsStr.split(",").map(s => s.trim()).filter(Boolean)

      const form = new FormData()
      if (newBlog.slug) form.append('slug', newBlog.slug)
      form.append('title', newBlog.title)
      form.append('excerpt', newBlog.excerpt)
      form.append('content', newBlog.content)
      form.append('author', JSON.stringify({ name: newBlog.author, avatarUrl: newBlog.authorAvatarUrl || undefined, bio: newBlog.authorBio || undefined }))
      if (tags.length) form.append('tags', tags.join(','))
      if (newBlog.readTime) form.append('readTime', newBlog.readTime)
      if (newBlog.status) form.append('status', newBlog.status)
      const seoObj: any = {
        title: newBlog.seoTitle || undefined,
        description: newBlog.seoDescription || undefined,
        keywords: seoKeywords.length ? seoKeywords : undefined,
        ogImage: newBlog.seoOgImage || undefined,
      }
      if (seoObj.title || seoObj.description || seoObj.keywords || seoObj.ogImage) {
        form.append('seo', JSON.stringify(seoObj))
      }
      if (newBlog.publishedAt) form.append('publishedAt', new Date(newBlog.publishedAt).toISOString())

      // files
      if (newBlog.coverImageFile instanceof File) {
        form.append('coverImage', newBlog.coverImageFile)
      }
      // Also allow URL fallbacks for gallery if provided
      if (newBlog.galleryFiles && newBlog.galleryFiles.length) {
        newBlog.galleryFiles.forEach((f) => form.append('gallery', f))
      }
      if (!newBlog.galleryFiles?.length && galleryUrls.length) {
        // backend may accept URL strings as gallery[] if implemented
        galleryUrls.forEach((u) => form.append('gallery', u))
      }

      const res = await fetch(`${API_BASE}/api/v1/blogs`, {
        method: 'POST',
        headers: getAuthHeadersMultipart(),
        credentials: 'include',
        body: form,
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.message || json?.error || "Failed to create blog")
      await fetchBlogs()
      setNewBlog({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        author: "",
        category: "",
        status: "draft",
        coverImage: "",
        galleryStr: "",
        tagsStr: "",
        readTime: "5 min read",
        authorAvatarUrl: "",
        authorBio: "",
        seoTitle: "",
        seoDescription: "",
        seoKeywordsStr: "",
        seoOgImage: "",
        publishedAt: "",
        coverImageFile: null,
        galleryFiles: [],
      })
      setIsAddDialogOpen(false)
    } catch (err) {
      console.error("Failed to add blog", err)
    }
  }

  const handleDeleteBlog = async (identifier: string) => {
    try {
      // identifier may be id or slug; prefer slug in UI
      const target = blogs.find((b) => b.id === identifier || b.slug === identifier)
      const slug = target?.slug || identifier
      const res = await fetch(`${API_BASE}/api/v1/blogs/${encodeURIComponent(slug)}`, {
        method: "DELETE",
        credentials: "include",
        headers: getAuthHeaders(),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.message || json?.error || "Failed to delete blog")
      await fetchBlogs()
    } catch (err) {
      console.error("Failed to delete blog", err)
    }
  }

  const handleViewBlog = (blog: BlogPost) => {
    setViewingBlog(blog)
    setIsViewDialogOpen(true)
  }

  const handleEditBlog = (blog: BlogPost) => {
    setEditingBlog(blog)
    setNewBlog({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      author: blog.author,
      category: blog.category || "",
      status: blog.status,
      coverImage: "",
      galleryStr: "",
      tagsStr: blog.category ? blog.category : "",
      readTime: "5 min read",
      authorAvatarUrl: "",
      authorBio: "",
      seoTitle: "",
      seoDescription: "",
      seoKeywordsStr: "",
      seoOgImage: "",
      publishedAt: "",
      coverImageFile: null,
      galleryFiles: [],
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateBlog = async () => {
    if (!editingBlog) return
    try {
      const slug = editingBlog.slug
      const galleryUrls = newBlog.galleryStr.split(",").map(s => s.trim()).filter(Boolean)
      const tags = newBlog.tagsStr.split(",").map(s => s.trim()).filter(Boolean)
      const seoKeywords = newBlog.seoKeywordsStr.split(",").map(s => s.trim()).filter(Boolean)

      const form = new FormData()
      if (newBlog.slug && newBlog.slug !== slug) form.append('slug', newBlog.slug)
      form.append('title', newBlog.title)
      form.append('excerpt', newBlog.excerpt)
      form.append('content', newBlog.content)
      form.append('author', JSON.stringify({ name: newBlog.author, avatarUrl: newBlog.authorAvatarUrl || undefined, bio: newBlog.authorBio || undefined }))
      if (tags.length) form.append('tags', tags.join(','))
      if (newBlog.readTime) form.append('readTime', newBlog.readTime)
      if (newBlog.status) form.append('status', newBlog.status)
      const seoObj: any = {
        title: newBlog.seoTitle || undefined,
        description: newBlog.seoDescription || undefined,
        keywords: seoKeywords.length ? seoKeywords : undefined,
        ogImage: newBlog.seoOgImage || undefined,
      }
      if (seoObj.title || seoObj.description || seoObj.keywords || seoObj.ogImage) {
        form.append('seo', JSON.stringify(seoObj))
      }
      if (newBlog.publishedAt) form.append('publishedAt', new Date(newBlog.publishedAt).toISOString())

      if (newBlog.coverImageFile instanceof File) {
        form.append('coverImage', newBlog.coverImageFile)
      }
      if (newBlog.galleryFiles && newBlog.galleryFiles.length) {
        newBlog.galleryFiles.forEach((f) => form.append('gallery', f))
      }
      if (!newBlog.galleryFiles?.length && galleryUrls.length) {
        galleryUrls.forEach((u) => form.append('gallery', u))
      }

      const res = await fetch(`${API_BASE}/api/v1/blogs/${encodeURIComponent(slug)}`, {
        method: 'PUT',
        headers: getAuthHeadersMultipart(),
        credentials: 'include',
        body: form,
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.message || json?.error || "Failed to update blog")
      await fetchBlogs()
      setEditingBlog(null)
      setNewBlog({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        author: "",
        category: "",
        status: "draft",
        coverImage: "",
        galleryStr: "",
        tagsStr: "",
        readTime: "5 min read",
        authorAvatarUrl: "",
        authorBio: "",
        seoTitle: "",
        seoDescription: "",
        seoKeywordsStr: "",
        seoOgImage: "",
        publishedAt: "",
        coverImageFile: null,
        galleryFiles: [],
      })
      setIsEditDialogOpen(false)
    } catch (err) {
      console.error("Failed to update blog", err)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800"
      case "draft":
        return "bg-yellow-100 text-yellow-800"
      case "archived":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const updateBlogStatus = async (slug: string, nextStatus: "draft" | "published" | "archived") => {
    const prev = [...blogs]
    setBlogs(blogs.map(b => b.slug === slug ? { ...b, status: nextStatus } : b))
    try {
      const form = new FormData()
      form.append('status', nextStatus)
      const res = await fetch(`${API_BASE}/api/v1/blogs/${encodeURIComponent(slug)}`, {
        method: 'PUT',
        headers: getAuthHeadersMultipart(),
        credentials: 'include',
        body: form,
      })
      if (!res.ok) {
        throw new Error('Failed to update status')
      }
    } catch (e) {
      console.error('Update status failed', e)
      setBlogs(prev)
      alert('Failed to update status')
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900">Blog Management</h1>
        <p className="text-lg text-slate-600 mt-2">Manage your blog posts and content</p>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-slate-900">Blog Posts</h2>
            <p className="text-lg text-slate-600">Create and manage your blog content</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => fetchBlogs()} title="Refresh list">Refresh</Button>
            <Select value={viewMode} onValueChange={(v: any) => setViewMode(v)}>
              <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="table">Table View</SelectItem>
                <SelectItem value="grid">Grid View</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add New Blog
              </Button>
            </DialogTrigger>
          <DialogContent className="w-[95vw] sm:max-w-3xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Blog Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newBlog.title}
                  onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                  placeholder="Enter blog title"
                />
              </div>
              <div>
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={newBlog.author}
                  onChange={(e) => setNewBlog({ ...newBlog, author: e.target.value })}
                  placeholder="Enter author name"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="readTime">Read Time</Label>
                  <Input id="readTime" value={newBlog.readTime} onChange={(e) => setNewBlog({ ...newBlog, readTime: e.target.value })} placeholder="e.g., 6 min read" />
                </div>
                <div>
                  <Label htmlFor="publishedAt">Published At</Label>
                  <Input id="publishedAt" type="date" value={newBlog.publishedAt} onChange={(e) => setNewBlog({ ...newBlog, publishedAt: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="authorAvatar">Author Avatar URL</Label>
                  <Input id="authorAvatar" value={newBlog.authorAvatarUrl} onChange={(e) => setNewBlog({ ...newBlog, authorAvatarUrl: e.target.value })} placeholder="https://..." />
                </div>
                <div>
                  <Label htmlFor="coverImage">Cover Image/Video</Label>
                  <Input id="coverImage" type="file" accept="image/*,video/*" onChange={(e) => setNewBlog({ ...newBlog, coverImageFile: e.target.files?.[0] || null })} />
                </div>
              </div>
              <div>
                <Label htmlFor="authorBio">Author Bio</Label>
                <Textarea id="authorBio" rows={3} value={newBlog.authorBio} onChange={(e) => setNewBlog({ ...newBlog, authorBio: e.target.value })} placeholder="Short author bio" />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={newBlog.category}
                  onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
                  placeholder="Enter category"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gallery">Gallery Files (images/videos)</Label>
                  <Input id="gallery" type="file" multiple accept="image/*,video/*" onChange={(e) => setNewBlog({ ...newBlog, galleryFiles: Array.from(e.target.files || []) })} />
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input id="tags" value={newBlog.tagsStr} onChange={(e) => setNewBlog({ ...newBlog, tagsStr: e.target.value })} placeholder="tag1, tag2, ..." />
                </div>
              </div>
              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={newBlog.excerpt}
                  onChange={(e) => setNewBlog({ ...newBlog, excerpt: e.target.value })}
                  placeholder="Enter blog excerpt"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={newBlog.content}
                  onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                  placeholder="Enter blog content"
                  rows={6}
                />
              </div>
              <div>
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input id="seoTitle" value={newBlog.seoTitle} onChange={(e) => setNewBlog({ ...newBlog, seoTitle: e.target.value })} placeholder="SEO title" />
              </div>
              <div>
                <Label htmlFor="seoDescription">SEO Description</Label>
                <Textarea id="seoDescription" rows={3} value={newBlog.seoDescription} onChange={(e) => setNewBlog({ ...newBlog, seoDescription: e.target.value })} placeholder="SEO description" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="seoKeywords">SEO Keywords (comma separated)</Label>
                  <Input id="seoKeywords" value={newBlog.seoKeywordsStr} onChange={(e) => setNewBlog({ ...newBlog, seoKeywordsStr: e.target.value })} placeholder="keyword1, keyword2, ..." />
                </div>
                <div>
                  <Label htmlFor="seoOgImage">SEO OG Image URL</Label>
                  <Input id="seoOgImage" value={newBlog.seoOgImage} onChange={(e) => setNewBlog({ ...newBlog, seoOgImage: e.target.value })} placeholder="https://..." />
                </div>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={newBlog.status} onValueChange={(value: any) => setNewBlog({ ...newBlog, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddBlog} className="w-full bg-blue-600 hover:bg-blue-700">
                Add Blog Post
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <Card className="border-blue-200">
            <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-slate-600">Total Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{blogs.length}</div>
            </CardContent>
          </Card>
          <Card className="border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-slate-600">Published</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {blogs.filter((b) => b.status === "published").length}
              </div>
            </CardContent>
          </Card>
          <Card className="border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-slate-600">Drafts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{blogs.filter((b) => b.status === "draft").length}</div>
            </CardContent>
          </Card>
          <Card className="border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-slate-600">Total Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {blogs.reduce((sum, blog) => sum + blog.views, 0).toLocaleString()}
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
                  placeholder="Search blogs..."
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
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Blogs Table */}
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-700 flex items-center gap-2 text-xl">
              <BookOpen className="h-6 w-6" />
              Blog Posts ({filteredBlogs.length})
            </CardTitle>
            <CardDescription className="text-base">Manage your blog content and publishing</CardDescription>
          </CardHeader>
          <CardContent>
            {viewMode === 'table' ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-base font-semibold">Cover</TableHead>
                      <TableHead className="text-base font-semibold">Title</TableHead>
                      <TableHead className="hidden sm:table-cell text-base font-semibold">Author</TableHead>
                      <TableHead className="hidden md:table-cell text-base font-semibold">Category</TableHead>
                      <TableHead className="hidden sm:table-cell text-base font-semibold">Status</TableHead>
                      <TableHead className="hidden md:table-cell text-base font-semibold">Created</TableHead>
                      <TableHead className="hidden md:table-cell text-base font-semibold">Published</TableHead>
                      <TableHead className="text-base font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBlogs.map((blog) => (
                      <TableRow key={blog.id}>
                        <TableCell>
                          {blog.coverImage ? (
                            <img src={blog.coverImage} alt={blog.title} className="h-12 w-16 object-cover rounded border" />
                          ) : (
                            <div className="h-12 w-16 bg-slate-100 rounded border" />
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-base">{blog.title}</div>
                          <div className="text-xs text-slate-500 sm:hidden">{blog.author}</div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-base">{blog.author}</TableCell>
                        <TableCell className="hidden md:table-cell"><Badge variant="outline" className="text-sm">{blog.category}</Badge></TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Select value={blog.status} onValueChange={(v: any) => updateBlogStatus(blog.slug, v)}>
                            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="published">Published</SelectItem>
                              <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-base">{blog.createdAt || '-'}</TableCell>
                        <TableCell className="hidden md:table-cell text-base">{blog.publishedAt}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleViewBlog(blog)} title="View Blog"><Eye className="w-4 h-4" /></Button>
                            <Button variant="outline" size="sm" onClick={() => handleEditBlog(blog)} title="Edit Blog"><Edit className="w-4 h-4" /></Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteBlog(blog.slug)} className="text-red-600 hover:text-red-700" title="Delete Blog"><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBlogs.map((blog) => (
                  <div key={blog.id} className="border rounded-md overflow-hidden">
                    {blog.coverImage ? (
                      <img src={blog.coverImage} alt={blog.title} className="h-40 w-full object-cover" />
                    ) : (
                      <div className="h-40 w-full bg-slate-100" />
                    )}
                    <div className="p-4 space-y-2">
                      <div className="font-medium">{blog.title}</div>
                      <div className="text-sm text-slate-600">{blog.author}</div>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{blog.createdAt || '-'}</span>
                        <Badge className={getStatusColor(blog.status)}>{blog.status}</Badge>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewBlog(blog)} title="View Blog"><Eye className="w-4 h-4" /></Button>
                        <Button variant="outline" size="sm" onClick={() => handleEditBlog(blog)} title="Edit Blog"><Edit className="w-4 h-4" /></Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteBlog(blog.slug)} className="text-red-600 hover:text-red-700" title="Delete Blog"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* View Blog Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>View Blog Post</DialogTitle>
          </DialogHeader>
          {viewingBlog && (
            <div className="space-y-6">
              {viewingBlog.coverImage && (
                <div>
                  <Label className="text-sm font-medium text-slate-600">Cover Image</Label>
                  <div className="mt-2">
                    <img src={viewingBlog.coverImage} alt="Cover" className="rounded-md border max-h-64 object-cover" />
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-600">Slug</Label>
                  <p className="text-slate-900 break-all">{viewingBlog.slug}</p>
                </div>
                {viewingBlog.id && (
                  <div>
                    <Label className="text-sm font-medium text-slate-600">ID</Label>
                    <p className="text-slate-900 break-all">{viewingBlog.id}</p>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-medium text-slate-600">Title</Label>
                  <p className="text-lg font-semibold text-slate-900">{viewingBlog.title}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Author</Label>
                  <p className="text-slate-900">{viewingBlog.author}</p>
                </div>
                {viewingBlog.authorAvatarUrl && (
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Author Avatar</Label>
                    <img src={viewingBlog.authorAvatarUrl} alt="Author" className="mt-2 h-14 w-14 rounded-full border object-cover" />
                  </div>
                )}
                {viewingBlog.authorBio && (
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Author Bio</Label>
                    <p className="text-slate-900">{viewingBlog.authorBio}</p>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-medium text-slate-600">Category</Label>
                  <Badge variant="outline">{viewingBlog.category}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Status</Label>
                  <Badge className={getStatusColor(viewingBlog.status)}>{viewingBlog.status}</Badge>
                </div>
                {viewingBlog.readTime && (
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Read Time</Label>
                    <p className="text-slate-900">{viewingBlog.readTime}</p>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-medium text-slate-600">Views</Label>
                  <p className="text-slate-900">{viewingBlog.views.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Published</Label>
                  <p className="text-slate-900">{viewingBlog.publishedAt}</p>
                </div>
              </div>
              {(viewingBlog.tags?.length || 0) > 0 && (
                <div>
                  <Label className="text-sm font-medium text-slate-600">Tags</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {viewingBlog.tags!.map((t) => (
                      <Badge key={t} variant="secondary">{t}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {(viewingBlog.gallery?.length || 0) > 0 && (
                <div>
                  <Label className="text-sm font-medium text-slate-600">Gallery</Label>
                  <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {viewingBlog.gallery!.map((src, idx) => (
                      <img key={idx} src={src} alt={`Gallery ${idx+1}`} className="rounded-md border max-h-40 object-cover" />
                    ))}
                  </div>
                </div>
              )}
              <div>
                <Label className="text-sm font-medium text-slate-600">Excerpt</Label>
                <p className="text-slate-900 bg-slate-50 p-3 rounded-lg">{viewingBlog.excerpt}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-600">Content</Label>
                <div
                  className="text-slate-900 bg-slate-50 p-4 rounded-lg max-h-60 overflow-y-auto prose prose-sm"
                  dangerouslySetInnerHTML={{ __html: viewingBlog.content }}
                />
              </div>
              {viewingBlog.seo && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-600">SEO</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    {viewingBlog.seo.title && (
                      <div><span className="text-slate-500">Title:</span> <span className="text-slate-900">{viewingBlog.seo.title}</span></div>
                    )}
                    {viewingBlog.seo.description && (
                      <div className="sm:col-span-2"><span className="text-slate-500">Description:</span> <span className="text-slate-900">{viewingBlog.seo.description}</span></div>
                    )}
                    {(viewingBlog.seo.keywords?.length || 0) > 0 && (
                      <div className="sm:col-span-2 flex flex-wrap gap-2">
                        {viewingBlog.seo.keywords!.map((k) => (
                          <Badge key={k} variant="outline">{k}</Badge>
                        ))}
                      </div>
                    )}
                    {viewingBlog.seo.ogImage && (
                      <div className="sm:col-span-2">
                        <div className="text-slate-500">OG Image</div>
                        <img src={viewingBlog.seo.ogImage} alt="OG" className="mt-2 rounded-md border max-h-48 object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Blog Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-[95vw] sm:max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={newBlog.title}
                onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                placeholder="Enter blog title"
              />
            </div>
            <div>
              <Label htmlFor="edit-slug">Slug</Label>
              <Input id="edit-slug" value={newBlog.slug} onChange={(e) => setNewBlog({ ...newBlog, slug: e.target.value })} placeholder="auto-generate from title if empty" />
            </div>
            <div>
              <Label htmlFor="edit-author">Author</Label>
              <Input
                id="edit-author"
                value={newBlog.author}
                onChange={(e) => setNewBlog({ ...newBlog, author: e.target.value })}
                placeholder="Enter author name"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-readTime">Read Time</Label>
                <Input id="edit-readTime" value={newBlog.readTime} onChange={(e) => setNewBlog({ ...newBlog, readTime: e.target.value })} placeholder="e.g., 6 min read" />
              </div>
              <div>
                <Label htmlFor="edit-publishedAt">Published At</Label>
                <Input id="edit-publishedAt" type="date" value={newBlog.publishedAt} onChange={(e) => setNewBlog({ ...newBlog, publishedAt: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-authorAvatar">Author Avatar URL</Label>
                <Input id="edit-authorAvatar" value={newBlog.authorAvatarUrl} onChange={(e) => setNewBlog({ ...newBlog, authorAvatarUrl: e.target.value })} placeholder="https://..." />
              </div>
              <div>
                <Label htmlFor="edit-coverImage">Cover Image/Video</Label>
                <Input id="edit-coverImage" type="file" accept="image/*,video/*" onChange={(e) => setNewBlog({ ...newBlog, coverImageFile: e.target.files?.[0] || null })} />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-authorBio">Author Bio</Label>
              <Textarea id="edit-authorBio" rows={3} value={newBlog.authorBio} onChange={(e) => setNewBlog({ ...newBlog, authorBio: e.target.value })} placeholder="Short author bio" />
            </div>
            <div>
              <Label htmlFor="edit-category">Category</Label>
              <Input
                id="edit-category"
                value={newBlog.category}
                onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
                placeholder="Enter category"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-gallery">Gallery Files (images/videos)</Label>
                <Input id="edit-gallery" type="file" multiple accept="image/*,video/*" onChange={(e) => setNewBlog({ ...newBlog, galleryFiles: Array.from(e.target.files || []) })} />
              </div>
              <div>
                <Label htmlFor="edit-tags">Tags (comma separated)</Label>
                <Input id="edit-tags" value={newBlog.tagsStr} onChange={(e) => setNewBlog({ ...newBlog, tagsStr: e.target.value })} placeholder="tag1, tag2, ..." />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-excerpt">Excerpt</Label>
              <Textarea
                id="edit-excerpt"
                value={newBlog.excerpt}
                onChange={(e) => setNewBlog({ ...newBlog, excerpt: e.target.value })}
                placeholder="Enter blog excerpt"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-content">Content</Label>
              <Textarea
                id="edit-content"
                value={newBlog.content}
                onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
                placeholder="Enter blog content"
                rows={6}
              />
            </div>
            <div>
              <Label htmlFor="edit-seoTitle">SEO Title</Label>
              <Input id="edit-seoTitle" value={newBlog.seoTitle} onChange={(e) => setNewBlog({ ...newBlog, seoTitle: e.target.value })} placeholder="SEO title" />
            </div>
            <div>
              <Label htmlFor="edit-seoDescription">SEO Description</Label>
              <Textarea id="edit-seoDescription" rows={3} value={newBlog.seoDescription} onChange={(e) => setNewBlog({ ...newBlog, seoDescription: e.target.value })} placeholder="SEO description" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-seoKeywords">SEO Keywords (comma separated)</Label>
                <Input id="edit-seoKeywords" value={newBlog.seoKeywordsStr} onChange={(e) => setNewBlog({ ...newBlog, seoKeywordsStr: e.target.value })} placeholder="keyword1, keyword2, ..." />
              </div>
              <div>
                <Label htmlFor="edit-seoOgImage">SEO OG Image URL</Label>
                <Input id="edit-seoOgImage" value={newBlog.seoOgImage} onChange={(e) => setNewBlog({ ...newBlog, seoOgImage: e.target.value })} placeholder="https://..." />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={newBlog.status}
                onValueChange={(value: any) => setNewBlog({ ...newBlog, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleUpdateBlog} className="flex-1 bg-blue-600 hover:bg-blue-700">
                Update Blog Post
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
