import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    const organizationId = searchParams.get("organizationId")

    if (!query.trim()) {
      return NextResponse.json({ articles: [] })
    }

    const articles = await prisma.article.findMany({
      where: {
        ...(organizationId ? { organizationId } : {}),
        organization: {
          members: {
            some: {
              userId: session.user.id,
            },
          },
        },
        OR: [
          {
            title: {
              contains: query,
              mode: "insensitive" as const,
            },
          },
          {
            content: {
              contains: query,
              mode: "insensitive" as const,
            },
          },
          {
            excerpt: {
              contains: query,
              mode: "insensitive" as const,
            },
          },
        ],
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
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
      },
      orderBy: [{ isPublished: "desc" }, { updatedAt: "desc" }],
      take: 50,
    })

    return NextResponse.json({ articles })
  } catch (error) {
    console.error("Error searching articles:", error)
    return NextResponse.json({ error: "Failed to search articles" }, { status: 500 })
  }
}
