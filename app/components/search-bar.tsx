"use client"

import { useState, useEffect } from "react"
import { useDebounce } from "@/lib/hooks/use-debounce"

interface SearchResult {
  id: string
  title: string
  excerpt: string | null
  isPublished: boolean
  organization: {
    name: string
  }
  category: {
    name: string
  } | null
  author: {
    name: string | null
    email: string
  }
}

interface SearchBarProps {
  onResultsChange?: (results: SearchResult[]) => void
}

export function SearchBar({ onResultsChange }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    const searchArticles = async () => {
      if (!debouncedQuery.trim()) {
        setResults([])
        onResultsChange?.([])
        return
      }

      setIsSearching(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
        if (response.ok) {
          const data = await response.json()
          setResults(data.articles || [])
          onResultsChange?.(data.articles || [])
        }
      } catch (error) {
        console.error("Search failed:", error)
      } finally {
        setIsSearching(false)
      }
    }

    searchArticles()
  }, [debouncedQuery, onResultsChange])

  return (
    <div className="relative">
      <div className="relative">
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search articles..." className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
        <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {isSearching && (
          <div className="absolute right-3 top-2.5">
            <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full" />
          </div>
        )}
      </div>

      {query && results.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
          {results.map((result) => (
            <a key={result.id} href={`/articles/${result.id}/edit`} className="block p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
              <div className="flex items-start justify-between mb-1">
                <h4 className="font-medium text-gray-900">{result.title}</h4>
                {result.isPublished ? <span className="inline-flex px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded">Published</span> : <span className="inline-flex px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 rounded">Draft</span>}
              </div>
              {result.excerpt && <p className="text-sm text-gray-600 mb-2 line-clamp-2">{result.excerpt}</p>}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{result.organization.name}</span>
                {result.category && (
                  <>
                    <span>•</span>
                    <span>{result.category.name}</span>
                  </>
                )}
                <span>•</span>
                <span>{result.author.name || result.author.email}</span>
              </div>
            </a>
          ))}
        </div>
      )}

      {query && !isSearching && results.length === 0 && <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 text-center text-gray-500">No articles found</div>}
    </div>
  )
}
