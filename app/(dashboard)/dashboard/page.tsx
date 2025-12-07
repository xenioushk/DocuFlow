import { auth } from "@/lib/auth"
import Link from "next/link"
import prisma from "@/lib/prisma"

export default async function DashboardPage() {
  const session = await auth()

  // Get user's organizations
  const organizations = await prisma.organization.findMany({
    where: {
      members: {
        some: {
          userId: session?.user?.id,
        },
      },
    },
    include: {
      _count: {
        select: {
          articles: true,
          categories: true,
        },
      },
    },
  })

  type Organization = (typeof organizations)[0]

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">Manage your documentation and knowledge base</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Organizations</h3>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{organizations.length}</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Total Articles</h3>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{organizations.reduce((acc: number, org: Organization) => acc + org._count.articles, 0)}</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-500">Categories</h3>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{organizations.reduce((acc: number, org: Organization) => acc + org._count.categories, 0)}</p>
        </div>
      </div>

      {/* Organizations List */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Your Workspaces</h3>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition">Create Workspace</button>
          </div>
        </div>

        <div className="p-6">
          {organizations.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No workspaces yet</h4>
              <p className="text-gray-500 mb-4">Create your first workspace to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {organizations.map((org: Organization) => (
                <Link key={org.id} href={`/dashboard/${org.slug}`} className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{org.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {org._count.articles} articles · {org._count.categories} categories
                      </p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <Link href="/articles/new" className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">📝 Create Article</h3>
          <p className="text-gray-600 mb-4 text-sm">Start writing documentation with our AI-powered editor</p>
          <span className="inline-block px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-medium">New Article</span>
        </Link>

        <Link href="/articles" className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 hover:shadow-md transition">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">📚 View Articles</h3>
          <p className="text-gray-600 mb-4 text-sm">Browse and manage all your documentation</p>
          <span className="inline-block px-4 py-2 bg-white text-purple-600 rounded-lg text-sm font-medium">Browse Articles</span>
        </Link>
      </div>
    </main>
  )
}
