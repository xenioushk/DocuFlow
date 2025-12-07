import { z } from "zod"

// Auth validation schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

// Article validation schemas
export const articleSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().max(500, "Excerpt is too long").optional(),
  coverImage: z.string().url("Invalid URL").optional(),
  categoryId: z.string().nullable().optional(),
  isPublished: z.boolean().default(false),
})

// Category validation schemas
export const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  description: z.string().max(500, "Description is too long").optional(),
  icon: z.string().optional(),
  parentId: z.string().optional(),
})

// Organization validation schemas
export const organizationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  description: z.string().max(500, "Description is too long").optional(),
  logo: z.string().url("Invalid URL").optional(),
})

// Search validation
export const searchSchema = z.object({
  query: z.string().min(1, "Search query is required"),
  categoryId: z.string().optional(),
  limit: z.number().min(1).max(100).default(10),
  offset: z.number().min(0).default(0),
})

// AI Chat validation
export const chatSchema = z.object({
  message: z.string().min(1, "Message is required").max(1000, "Message is too long"),
  organizationId: z.string(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ArticleInput = z.infer<typeof articleSchema>
export type CategoryInput = z.infer<typeof categorySchema>
export type OrganizationInput = z.infer<typeof organizationSchema>
export type SearchInput = z.infer<typeof searchSchema>
export type ChatInput = z.infer<typeof chatSchema>
