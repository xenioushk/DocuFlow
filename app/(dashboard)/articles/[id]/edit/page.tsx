"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { TiptapEditor } from "@/app/components/tiptap-editor"
import Link from "next/link"

const articleSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1, "Slug is required").max(200),
  categoryId: z.string().optional(),
  isPublished: z.boolean(),
  excerpt: z.string().max(160).optional(),
})

type ArticleFormData = z.infer<typeof articleSchema>

interface Organization {
  id: string
  name: string
  slug: string
}

interface Category {
  id: string
  name: string
  slug: string
}

export default function EditArticlePage() {
  const router = useRouter()
  const params = useParams()
  const articleId = params.id as string

  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [selectedOrgId, setSelectedOrgId] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      isPublished: false,
    },
  })

  const title = watch("title")

  // Auto-generate slug from title
  useEffect(() => {
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
      setValue("slug", slug)
    }
  }, [title, setValue])

  // Fetch article data
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/articles/${articleId}`)
        if (!response.ok) throw new Error("Failed to fetch article")

        const article = await response.json()

        setValue("title", article.title)
        setValue("slug", article.slug)
        setValue("categoryId", article.categoryId || "")
        setValue("isPublished", article.isPublished)
        setValue("excerpt", article.excerpt || "")
        setContent(article.content)
        setSelectedOrgId(article.organizationId)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load article")
      } finally {
        setIsFetching(false)
      }
    }

    fetchArticle()
  }, [articleId, setValue])

  // Fetch organizations
  useEffect(() => {
    fetch("/api/organizations")
      .then((res) => res.json())
      .then((data) => setOrganizations(data.organizations || []))
      .catch(() => setError("Failed to load organizations"))
  }, [])

  // Fetch categories when organization changes
  useEffect(() => {
    if (selectedOrgId) {
      fetch(`/api/categories?organizationId=${selectedOrgId}`)
        .then((res) => res.json())
        .then((data) => setCategories(data.categories || []))
        .catch(() => setError("Failed to load categories"))
    }
  }, [selectedOrgId])

  const onSubmit = async (data: ArticleFormData) => {
    if (!content.trim()) {
      setError("Content is required")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Remove empty categoryId
      const { categoryId, ...restData } = data
      const payload = {
        ...restData,
        ...(categoryId && categoryId !== "" ? { categoryId } : { categoryId: null }),
        content,
      }

      const response = await fetch(`/api/articles/${articleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update article")
      }

      router.push(`/articles`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this article?")) return

    try {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete article")

      router.push("/articles")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete article")
    }
  }

  if (isFetching) {
    return (
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading article...</div>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Article</h1>
          <p className="text-gray-600 mt-1">Update your documentation</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Delete Article
          </button>
          <Link href="/articles" className="text-sm text-gray-600 hover:text-gray-900">
            ← Back to articles
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Workspace (Read-only) */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Workspace
          </label>
          <input
            type="text"
            value={organizations.find((o) => o.id === selectedOrgId)?.name || ""}
            disabled
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
          />
        </div>

        {/* Title & Slug */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              {...register("title")}
              type="text"
              id="title"
              placeholder="Article title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
              Slug (URL)
            </label>
            <input
              {...register("slug")}
              type="text"
              id="slug"
              placeholder="article-slug"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>}
          </div>

          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
              Category (Optional)
            </label>
            <select
              {...register("categoryId")}
              id="categoryId"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">No category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt (Optional)
            </label>
            <textarea
              {...register("excerpt")}
              id="excerpt"
              rows={2}
              placeholder="Brief excerpt or description..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            {errors.excerpt && (
              <p className="mt-1 text-sm text-red-600">{errors.excerpt.message}</p>
            )}
          </div>
        </div>

        {/* Content Editor */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
          <TiptapEditor content={content} onChange={setContent} placeholder="Start writing your article..." />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                {...register("isPublished")}
                type="checkbox"
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">Published</span>
            </label>
          </div>

          <div className="flex gap-3">
            <Link
              href="/articles"
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Updating..." : "Update Article"}
            </button>
          </div>
        </div>
      </form>
    </main>
  )
}
