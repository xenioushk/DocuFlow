import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12">
            <h1 className="text-6xl font-bold text-gray-900 mb-6">
              Welcome to <span className="text-blue-600">DocuFlow</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              AI-Powered Knowledge Base Platform. Create, organize, and search your documentation with the power of artificial intelligence.
            </p>
            
            <div className="flex gap-4 justify-center">
              <Link
                href="/register"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="px-8 py-3 bg-white text-gray-900 rounded-lg font-semibold border-2 border-gray-200 hover:border-gray-300 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Rich Documentation</h3>
              <p className="text-gray-600 text-sm">
                Create beautiful articles with our powerful rich text editor.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">AI-Powered Search</h3>
              <p className="text-gray-600 text-sm">
                Find answers instantly with semantic search powered by AI.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Team Collaboration</h3>
              <p className="text-gray-600 text-sm">
                Work together with permissions and organized content.
              </p>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">Built with modern technologies</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <span className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium">Next.js 15</span>
              <span className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium">TypeScript</span>
              <span className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium">Prisma</span>
              <span className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium">PostgreSQL</span>
              <span className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium">OpenAI</span>
              <span className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium">Tailwind CSS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
