"use client"

import { signOut } from "next-auth/react"
import Link from "next/link"

export function Navbar({ user }: { user: { name?: string | null; email?: string | null } }) {
  const handleSignOut = async () => {
    await signOut({ redirect: false })
    window.location.href = "/login"
  }

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="text-xl font-bold text-blue-600">
              DocuFlow
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/articles" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition">
                Articles
              </Link>
              <Link href="/categories" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition">
                Categories
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">{user.name || user.email}</span>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
