import { notFound } from "next/navigation"
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { users } from "@/db/schema"

const UserPage = async ({ params }: { params: Promise<{ username: string }> }) => {
  const { username } = await params

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, decodeURIComponent(username)))

  if (!user) {
    notFound()
  }

  const blogs = await db.query.blogs.findMany({
    where: (blog, { eq }) => eq(blog.userId, user.id),
  })

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">{user.name}</h1>
      <h2 className="mb-2 text-xl font-semibold">added blogs</h2>
      {blogs.length === 0 ? (
        <p className="text-slate-600">no blogs added yet</p>
      ) : (
        <ul className="space-y-1">
          {blogs.map((blog) => (
            <li key={blog.id}>{blog.title}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default UserPage
