import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import prisma from "@/lib/prisma"
import { registerSchema } from "@/lib/validations"
import { slugify } from "@/lib/utils"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password } = registerSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    // Create a default organization for the user
    const baseSlug = slugify(name) + "-workspace"
    const timestamp = Date.now()
    const orgSlug = `${baseSlug}-${timestamp}`

    const organization = await prisma.organization.create({
      data: {
        name: `${name}'s Workspace`,
        slug: orgSlug,
        members: {
          create: {
            userId: user.id,
            role: "OWNER",
          },
        },
      },
    })

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        organization: {
          id: organization.id,
          name: organization.name,
          slug: organization.slug,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
