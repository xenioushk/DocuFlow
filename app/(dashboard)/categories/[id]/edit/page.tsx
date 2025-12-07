"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"

const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().min(1, "Slug is required").max(100),
  description: z.string().max(500).optional(),
})

type CategoryFormData = z.infer<typeof categorySchema>

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  organization: {
    id: string
    name: string
  }
}

export default function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState("")
  const [category, setCategory] = useState<Category | null>(null)
  const [categoryId, setCategoryId] = useState<string>("")

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  })

  const name = watch("name")

  // Unwrap params and fetch category
  useEffect(() => {
    params.then((p) => {
      setCategoryId(p.id)

      fetch(`/api/categories/${p.id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch category")
          return res.json()
        })
        .then((data) => {
          setCategory(data.category)
          setValue("name", data.category.name)
          setValue("slug", data.category.slug)
          setValue("description", data.category.description || "")
          setIsFetching(false)
        })
        .catch((err) => {
          setError(err.message)
          setIsFetching(false)
        })
    })
  }, [params, setValue])

  // Auto-generate slug from name
  useEffect(() => {
    if (name && category) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
      setValue("slug", slug)
    }
  }, [name, setValue, category])

  const onSubmit = async (data: CategoryFormData) => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update category")
      }

      router.push("/categories")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      return
    }

    setIsDeleting(true)
    setError("")

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete category")
      }

      router.push("/categories")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setIsDeleting(false)
    }
  }

  if (isFetching) {
    return (
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8" />
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-20 bg-gray-200 rounded" />
          </div>
        </div>
      </main>
    )
  }

  if (!category) {
    return (
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Category not found</h1>
          <Link href="/categories" className="text-blue-600 hover:text-blue-800">
            ← Back to categories
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Category</h1>
          <p className="text-gray-600 mt-1">Update category details</p>
        </div>
        <Link href="/categories" className="text-sm text-gray-600 hover:text-gray-900">
          ← Back to categories
        </Link>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Workspace Info */}
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Workspace:</span> {category.organization.name}
          </p>
        </div>

        {/* Category Details */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input {...register("name")} type="text" id="name" placeholder="Category name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
              Slug (URL)
            </label>
            <input {...register("slug")} type="text" id="slug" placeholder="category-slug" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
            {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea {...register("description")} id="description" rows={3} placeholder="Brief description of this category..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-4">
          <button type="button" onClick={handleDelete} disabled={isDeleting} className="px-6 py-2.5 border border-red-300 text-red-700 rounded-lg font-medium hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed">
            {isDeleting ? "Deleting..." : "Delete Category"}
          </button>
          <div className="flex gap-4">
            <Link href="/categories" className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition">
              Cancel
            </Link>
            <button type="submit" disabled={isLoading} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? "Updating..." : "Update Category"}
            </button>
          </div>
        </div>
      </form>
    </main>
  )
}
