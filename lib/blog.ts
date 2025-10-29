// Shared Blog types for frontend usage

export type BlogStatus = "draft" | "published" | "archived"

export interface BlogAuthor {
  id?: string
  name: string
  avatarUrl?: string
  bio?: string
}

export interface BlogCategory {
  id?: string
  name: string
  slug: string
  description?: string
}

export interface BlogSEO {
  title?: string
  description?: string
  keywords?: string[]
  ogImage?: string
}

export interface Blog {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage?: string
  gallery?: string[]
  author: BlogAuthor
  category: BlogCategory
  tags: string[]
  readTime: string
  status: BlogStatus
  seo?: BlogSEO
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

export interface BlogListResponse {
  data: Array<Pick<Blog, "id" | "slug" | "title" | "excerpt" | "coverImage" | "author" | "category" | "tags" | "readTime" | "publishedAt" | "createdAt" | "updatedAt">>
  pagination?: { page: number; pageSize: number; total: number; totalPages: number }
}



