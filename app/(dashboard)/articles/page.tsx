import { auth } from "@/lib/auth"
import Link from "next/link"
import prisma from "@/lib/prisma"
import { formatDate } from "@/lib/utils"

export default async function ArticlesPage() {
  const session = await auth()

  const articles = await prisma.article.findMany({
    where: {
      organization: {
        members: {
          some: {
            userId: session?.user?.id,
          },
        },
      },
    },
    include: {
      category: {
        select: {
          name: true,
        },
      },
      organization: {
        select: {
          name: true,
        },
      },
      author: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  })

  type Article = (typeof articles)[0]

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Articles</h1>
          <p className="text-gray-600 mt-1">Manage your documentation</p>
        </div>
        <Link href="/articles/new" className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
          + New Article
        </Link>
      </div>

      {/* Articles List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {articles.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No articles yet</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first article</p>
            <Link href="/articles/new" className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
              Create Article
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {articles.map((article: Article) => (
                <tr key={article.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{article.title}</div>
                      <div className="text-sm text-gray-500">{article.organization.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{article.category ? <span className="inline-flex px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">{article.category.name}</span> : <span className="text-sm text-gray-400">Uncategorized</span>}</td>
                  <td className="px-6 py-4">{article.isPublished ? <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">Published</span> : <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">Draft</span>}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{article.author.name || article.author.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDate(article.updatedAt)}</td>
                  <td className="px-6 py-4 text-sm">
                    <Link href={`/articles/${article.id}/edit`} className="text-blue-600 hover:text-blue-800 font-medium">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  )
}
