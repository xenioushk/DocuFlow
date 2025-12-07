import { auth } from "@/lib/auth"
import Link from "next/link"
import prisma from "@/lib/prisma"

export default async function CategoriesPage() {
  const session = await auth()

  const organizations = await prisma.organization.findMany({
    where: {
      members: {
        some: {
          userId: session?.user?.id,
        },
      },
    },
    include: {
      categories: {
        orderBy: {
          name: "asc",
        },
        include: {
          _count: {
            select: {
              articles: true,
            },
          },
        },
      },
    },
  })

  const allCategories = organizations.flatMap((org) =>
    org.categories.map((cat) => ({ ...cat, organizationName: org.name }))
  )

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-1">Organize your documentation</p>
        </div>
        <Link
          href="/categories/new"
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
        >
          + New Category
        </Link>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {allCategories.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories yet</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first category</p>
            <Link
              href="/categories/new"
              className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Create Category
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {allCategories.map((category) => (
              <div
                key={category.id}
                className="p-6 hover:bg-gray-50 transition flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                      {category.organizationName}
                    </span>
                  </div>
                  {category.description && (
                    <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Slug: {category.slug}</span>
                    <span>•</span>
                    <span>{category._count.articles} articles</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/categories/${category.id}/edit`}
                    className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
