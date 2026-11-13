"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { and, eq } from "drizzle-orm"
import crypto from "crypto"
import bcrypt from "bcryptjs"
import { db } from "@/db"
import { blogs, users, readingList } from "@/db/schema"
import { auth } from "@/auth"

export interface BlogFormState {
  errors: Partial<Record<"title" | "author" | "url", string>>
  values?: { title: string; author: string; url: string }
}

export async function createBlog(
  _prev: BlogFormState,
  formData: FormData
): Promise<BlogFormState> {
  const session = await auth()

  const title = formData.get("title") as string
  const author = formData.get("author") as string
  const url = formData.get("url") as string

  const errors: BlogFormState["errors"] = {}
  if (!title || title.length < 3) {
    errors.title = "Title must be at least 3 characters long"
  }
  if (!author || author.length < 3) {
    errors.author = "Author must be at least 3 characters long"
  }
  if (!url || !/^https?:\/\//.test(url)) {
    errors.url = "URL must be a valid http(s) address"
  }

  if (Object.keys(errors).length > 0) {
    return { errors, values: { title: title ?? "", author: author ?? "", url: url ?? "" } }
  }

  await db.insert(blogs).values({
    title,
    author,
    url,
    likes: 0,
    userId: session?.user?.id ? Number(session.user.id) : null,
  })

  revalidatePath("/blogs")
  const cookieStore = await cookies()
  cookieStore.set("flash", "a%20new%20blog%20added")
  redirect("/blogs")
}

export async function likeBlog(formData: FormData) {
  const id = Number(formData.get("id"))
  const [blog] = await db.select().from(blogs).where(eq(blogs.id, id))
  if (blog) {
    await db
      .update(blogs)
      .set({ likes: blog.likes + 1 })
      .where(eq(blogs.id, id))
  }
  revalidatePath(`/blogs/${id}`)
  revalidatePath("/blogs")
}

export interface RegisterFormState {
  errors: Partial<
    Record<"username" | "name" | "password" | "passwordConfirm", string>
  >
  values?: { username: string; name: string }
}

export async function registerUser(
  _prev: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  const username = formData.get("username") as string
  const name = formData.get("name") as string
  const password = formData.get("password") as string
  const passwordConfirm = formData.get("passwordConfirm") as string

  const errors: RegisterFormState["errors"] = {}
  if (!username || username.length < 4) {
    errors.username = "Username must be at least 4 characters long"
  }
  if (!name || name.length < 3) {
    errors.name = "Name must be at least 3 characters long"
  }
  if (!password || password.length < 8) {
    errors.password = "Password must be at least 8 characters long"
  }
  if (password !== passwordConfirm) {
    errors.passwordConfirm = "Passwords do not match"
  }

  if (!errors.username) {
    const [existing] = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
    if (existing) {
      errors.username = "Username is already taken"
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors, values: { username: username ?? "", name: name ?? "" } }
  }

  const passwordHash = await bcrypt.hash(password, 10)
  await db.insert(users).values({ username, name, passwordHash })

  redirect("/login")
}

export async function generateToken() {
  const session = await auth()
  if (!session?.user?.id) {
    return
  }

  const token = crypto.randomUUID() + crypto.randomUUID()

  await db
    .update(users)
    .set({ token })
    .where(eq(users.id, Number(session.user.id)))

  revalidatePath("/me")
}

export async function addToReadingList(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    return
  }

  const blogId = Number(formData.get("blogId"))
  const userId = Number(session.user.id)

  const [existing] = await db
    .select()
    .from(readingList)
    .where(and(eq(readingList.userId, userId), eq(readingList.blogId, blogId)))

  if (!existing) {
    await db.insert(readingList).values({ userId, blogId, read: false })
  }

  revalidatePath(`/blogs/${blogId}`)
  revalidatePath("/me")
}

export async function markAsRead(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    return
  }

  const id = Number(formData.get("id"))

  await db
    .update(readingList)
    .set({ read: true })
    .where(
      and(
        eq(readingList.id, id),
        eq(readingList.userId, Number(session.user.id))
      )
    )

  revalidatePath("/me")
}
