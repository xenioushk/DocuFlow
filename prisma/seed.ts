import { hash } from "bcryptjs"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("🌱 Starting seed...")

  // Create demo user
  const hashedPassword = await hash("demo123", 10)

  const user = await prisma.user.upsert({
    where: { email: "demo@docuflow.com" },
    update: {},
    create: {
      email: "demo@docuflow.com",
      password: hashedPassword,
      name: "Demo User",
    },
  })

  console.log("✅ Created demo user:", user.email)

  // Create organization
  const org = await prisma.organization.upsert({
    where: { slug: "demo-workspace" },
    update: {},
    create: {
      name: "Demo Workspace",
      slug: "demo-workspace",
      members: {
        create: {
          userId: user.id,
          role: "ADMIN",
        },
      },
    },
  })

  console.log("✅ Created organization:", org.name)

  // Create categories
  const categories = [
    {
      name: "Getting Started",
      slug: "getting-started",
      description: "Essential guides to help you begin your journey",
    },
    {
      name: "API Reference",
      slug: "api-reference",
      description: "Complete API documentation and examples",
    },
    {
      name: "Tutorials",
      slug: "tutorials",
      description: "Step-by-step tutorials for common use cases",
    },
    {
      name: "Best Practices",
      slug: "best-practices",
      description: "Recommended approaches and patterns",
    },
  ]

  const createdCategories = []
  for (const cat of categories) {
    const category = await prisma.category.upsert({
      where: {
        organizationId_slug: {
          organizationId: org.id,
          slug: cat.slug,
        },
      },
      update: {},
      create: {
        ...cat,
        organizationId: org.id,
      },
    })
    createdCategories.push(category)
    console.log("✅ Created category:", category.name)
  }

  // Create articles
  const articles = [
    {
      title: "Welcome to DocuFlow",
      slug: "welcome-to-docuflow",
      excerpt: "Learn how to get started with DocuFlow and create amazing documentation",
      content: `<h2>Welcome to DocuFlow! 🎉</h2><p>DocuFlow is a modern knowledge base platform that helps you create, organize, and share documentation with your team.</p><h3>Key Features</h3><ul><li><p>Rich text editor with Tiptap</p></li><li><p>Multi-tenant architecture</p></li><li><p>Categories and organization</p></li><li><p>Full-text search</p></li><li><p>Role-based access control</p></li></ul><h3>Getting Started</h3><p>To create your first article:</p><ol><li><p>Click "New Article" from the dashboard</p></li><li><p>Choose a category</p></li><li><p>Write your content using our rich text editor</p></li><li><p>Publish when ready!</p></li></ol><p>Happy documenting! ✨</p>`,
      categoryId: createdCategories[0].id,
      isPublished: true,
    },
    {
      title: "Creating Your First Article",
      slug: "creating-your-first-article",
      excerpt: "A step-by-step guide to creating and publishing your first article",
      content: `<h2>Creating Your First Article</h2><p>Let's walk through the process of creating a new article in DocuFlow.</p><h3>Step 1: Navigate to Articles</h3><p>From your dashboard, click on the "Articles" link in the navigation bar or use the "New Article" quick action button.</p><h3>Step 2: Fill in the Details</h3><ul><li><p><strong>Title:</strong> Give your article a clear, descriptive title</p></li><li><p><strong>Excerpt:</strong> Write a brief summary (optional)</p></li><li><p><strong>Category:</strong> Choose an appropriate category</p></li></ul><h3>Step 3: Write Your Content</h3><p>Use our powerful rich text editor to format your content. You can:</p><ul><li><p>Add headings and subheadings</p></li><li><p>Format text (bold, italic, code)</p></li><li><p>Create lists and tables</p></li><li><p>Insert links and images</p></li></ul><h3>Step 4: Publish</h3><p>Toggle the "Published" switch to make your article visible to others. You can save as a draft first if you need to review it later.</p>`,
      categoryId: createdCategories[0].id,
      isPublished: true,
    },
    {
      title: "API Authentication Guide",
      slug: "api-authentication-guide",
      excerpt: "Learn how to authenticate with the DocuFlow API",
      content: `<h2>API Authentication</h2><p>DocuFlow uses JWT tokens for API authentication. Here's how to get started.</p><h3>Getting Your API Key</h3><p>Navigate to Settings → API Keys to generate a new API key.</p><pre><code>const response = await fetch('/api/auth/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'your@email.com',
    password: 'your-password'
  })
})</code></pre><h3>Using the Token</h3><p>Include the token in the Authorization header:</p><pre><code>fetch('/api/articles', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN_HERE'
  }
})</code></pre><h3>Token Expiration</h3><p>Tokens expire after 24 hours. Make sure to refresh them before expiration to avoid authentication errors.</p>`,
      categoryId: createdCategories[1].id,
      isPublished: true,
    },
    {
      title: "Working with Categories",
      slug: "working-with-categories",
      excerpt: "Organize your documentation using categories",
      content: `<h2>Working with Categories</h2><p>Categories help you organize your documentation into logical groups.</p><h3>Creating Categories</h3><ol><li><p>Go to Categories page</p></li><li><p>Click "New Category"</p></li><li><p>Enter name and description</p></li><li><p>Save</p></li></ol><h3>Best Practices</h3><ul><li><p>Keep category names short and descriptive</p></li><li><p>Use 4-8 main categories</p></li><li><p>Avoid too many nested levels</p></li><li><p>Group related content together</p></li></ul><h3>Category Slugs</h3><p>Slugs are automatically generated from category names and used in URLs. They should be:</p><ul><li><p>Lowercase</p></li><li><p>Hyphen-separated</p></li><li><p>Unique within your organization</p></li></ul>`,
      categoryId: createdCategories[2].id,
      isPublished: true,
    },
    {
      title: "Search Best Practices",
      slug: "search-best-practices",
      excerpt: "Tips for making your content more discoverable",
      content: `<h2>Search Best Practices</h2><p>Make your documentation easy to find with these search optimization tips.</p><h3>Write Clear Titles</h3><p>Use descriptive, specific titles that include key terms your users might search for.</p><h3>Use Excerpts Effectively</h3><p>Write concise excerpts that summarize the article's main point. These appear in search results.</p><h3>Structure Your Content</h3><ul><li><p>Use headings to break up content</p></li><li><p>Include keywords naturally</p></li><li><p>Keep paragraphs focused</p></li></ul><h3>Tag Appropriately</h3><p>Choose relevant categories that accurately represent your content.</p><h3>Keep Content Fresh</h3><p>Update articles regularly to maintain relevance and accuracy.</p>`,
      categoryId: createdCategories[3].id,
      isPublished: true,
    },
    {
      title: "Markdown Support",
      slug: "markdown-support",
      excerpt: "Learn about markdown formatting in DocuFlow",
      content: `<h2>Markdown Support</h2><p>DocuFlow's editor supports common markdown shortcuts for faster formatting.</p><h3>Headings</h3><p>Type # followed by space for headings:</p><ul><li><p># for H1</p></li><li><p>## for H2</p></li><li><p>### for H3</p></li></ul><h3>Text Formatting</h3><ul><li><p>**bold** for <strong>bold</strong></p></li><li><p>*italic* for <em>italic</em></p></li><li><p>\`code\` for <code>inline code</code></p></li></ul><h3>Lists</h3><ul><li><p>Start with - or * for bullet lists</p></li><li><p>Start with 1. for numbered lists</p></li></ul><h3>Links</h3><p>Type [text](url) to create links quickly.</p>`,
      categoryId: createdCategories[2].id,
      isPublished: true,
    },
    {
      title: "Draft Article: Advanced Features",
      slug: "draft-advanced-features",
      excerpt: "Coming soon: Advanced features and integrations",
      content: `<h2>Advanced Features (Draft)</h2><p>This article is still being written. Check back soon!</p><p>Topics to cover:</p><ul><li><p>AI-powered search</p></li><li><p>Custom integrations</p></li><li><p>Webhooks</p></li><li><p>Analytics</p></li></ul>`,
      categoryId: createdCategories[3].id,
      isPublished: false,
    },
  ]

  for (const article of articles) {
    const created = await prisma.article.upsert({
      where: {
        organizationId_slug: {
          organizationId: org.id,
          slug: article.slug,
        },
      },
      update: {},
      create: {
        ...article,
        organizationId: org.id,
        authorId: user.id,
      },
    })
    console.log(`✅ Created article: ${created.title}`)
  }

  console.log("🎉 Seed completed successfully!")
  console.log("\n📝 Demo credentials:")
  console.log("   Email: demo@docuflow.com")
  console.log("   Password: demo123")
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
