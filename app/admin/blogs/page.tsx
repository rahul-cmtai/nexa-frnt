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
  category: string
  publishedAt: string
  views: number
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
  const API_BASE = useMemo(() => process.env.NEXT_PUBLIC_API_BASE || "", [])
  const [isLoading, setIsLoading] = useState(false)

  const [newBlog, setNewBlog] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    author: "",
    category: "",
    status: "draft" as "published" | "draft" | "archived",
  })

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || blog.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  async function fetchBlogs() {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.set("search", searchTerm)
      // backend may support category/status filters; we filter status client-side for safety
      const res = await fetch(`${API_BASE}/blog?${params.toString()}`, {
        method: "GET",
        credentials: "include",
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.message || json?.error || "Failed to load blogs")

      const items = (json?.data ?? json ?? []).map((b: any): BlogPost => ({
        id: b.id || b._id,
        title: b.title,
        slug: b.slug,
        excerpt: b.excerpt ?? "",
        content: b.content ?? "",
        author: b.author ?? "",
        category: b.category ?? "",
        // map isPublished -> status
        status: b.isPublished ? "published" : "draft",
        // map date -> publishedAt
        publishedAt: b.date ? String(b.date).slice(0, 10) : "",
        views: typeof b.views === "number" ? b.views : 0,
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
      const body = {
        title: newBlog.title,
        excerpt: newBlog.excerpt,
        content: newBlog.content,
        author: newBlog.author,
        category: newBlog.category,
        // map status -> isPublished
        isPublished: newBlog.status === "published",
      }
      const res = await fetch(`${API_BASE}/blog`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
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
      const res = await fetch(`${API_BASE}/blog/${encodeURIComponent(slug)}`, {
        method: "DELETE",
        credentials: "include",
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
      category: blog.category,
      status: blog.status,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateBlog = async () => {
    if (!editingBlog) return
    try {
      const slug = editingBlog.slug
      const body = {
        title: newBlog.title,
        excerpt: newBlog.excerpt,
        content: newBlog.content,
        author: newBlog.author,
        category: newBlog.category,
        isPublished: newBlog.status === "published",
      }
      const res = await fetch(`${API_BASE}/blog/${encodeURIComponent(slug)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
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

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add New Blog
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl">
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
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={newBlog.category}
                  onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })}
                  placeholder="Enter category"
                />
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
                <Label htmlFor="status">Status</Label>
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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-base font-semibold">Title</TableHead>
                    <TableHead className="hidden sm:table-cell text-base font-semibold">Author</TableHead>
                    <TableHead className="hidden md:table-cell text-base font-semibold">Category</TableHead>
                    <TableHead className="hidden sm:table-cell text-base font-semibold">Status</TableHead>
                    <TableHead className="hidden lg:table-cell text-base font-semibold">Views</TableHead>
                    <TableHead className="hidden md:table-cell text-base font-semibold">Published</TableHead>
                    <TableHead className="text-base font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBlogs.map((blog) => (
                    <TableRow key={blog.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-base">{blog.title}</div>
                          <div className="text-base text-slate-500 sm:hidden">{blog.author}</div>
                          <div className="text-base text-slate-500 md:hidden">{blog.category}</div>
                          <div className="text-base text-slate-500 lg:hidden">{blog.views.toLocaleString()} views</div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-base">{blog.author}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline" className="text-sm">{blog.category}</Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge className={`${getStatusColor(blog.status)} text-sm`}>{blog.status}</Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-base">{blog.views.toLocaleString()}</TableCell>
                      <TableCell className="hidden md:table-cell text-base">{blog.publishedAt}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewBlog(blog)}
                            title="View Blog"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditBlog(blog)}
                            title="Edit Blog"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteBlog(blog.slug)}
                            className="text-red-600 hover:text-red-700"
                            title="Delete Blog"
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

      {/* View Blog Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>View Blog Post</DialogTitle>
          </DialogHeader>
          {viewingBlog && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-600">Title</Label>
                  <p className="text-lg font-semibold text-slate-900">{viewingBlog.title}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Author</Label>
                  <p className="text-slate-900">{viewingBlog.author}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Category</Label>
                  <Badge variant="outline">{viewingBlog.category}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Status</Label>
                  <Badge className={getStatusColor(viewingBlog.status)}>{viewingBlog.status}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Views</Label>
                  <p className="text-slate-900">{viewingBlog.views.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-600">Published</Label>
                  <p className="text-slate-900">{viewingBlog.publishedAt}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-600">Excerpt</Label>
                <p className="text-slate-900 bg-slate-50 p-3 rounded-lg">{viewingBlog.excerpt}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-600">Content</Label>
                <div className="text-slate-900 bg-slate-50 p-4 rounded-lg whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {viewingBlog.content}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Blog Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
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
              <Label htmlFor="edit-author">Author</Label>
              <Input
                id="edit-author"
                value={newBlog.author}
                onChange={(e) => setNewBlog({ ...newBlog, author: e.target.value })}
                placeholder="Enter author name"
              />
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
