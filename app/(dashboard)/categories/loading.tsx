import { CardSkeleton } from "@/app/components/loading-spinner"

export default function CategoriesLoading() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-1">Organize your documentation</p>
        </div>
        <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-200">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-6 animate-pulse">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-5 bg-gray-200 rounded w-1/4" />
              <div className="h-5 w-20 bg-gray-200 rounded" />
            </div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/3" />
          </div>
        ))}
      </div>
    </main>
  )
}
