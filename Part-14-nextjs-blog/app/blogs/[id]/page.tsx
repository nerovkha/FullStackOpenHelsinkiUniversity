import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import { db } from "@/db"
import { blogs, readingList } from "@/db/schema"
import { auth } from "@/auth"
import { likeBlog, addToReadingList } from "@/app/actions"

const BlogPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params

  const [blog] = await db
    .select()
    .from(blogs)
    .where(eq(blogs.id, Number(id)))

  if (!blog) {
    notFound()
  }

  const session = await auth()
  const userId = session?.user?.id ? Number(session.user.id) : null
  const isOwnBlog = userId !== null && blog.userId === userId

  const alreadyInList =
    userId !== null &&
    (
      await db
        .select()
        .from(readingList)
        .where(eq(readingList.blogId, blog.id))
    ).some((entry) => entry.userId === userId)

  return (
    <div data-testid="blog-detail" className="space-y-4">
      <h1 data-testid="blog-title" className="text-2xl font-bold">
        {blog.title}
      </h1>
      <p data-testid="blog-author">by {blog.author}</p>
      <p>
        <a href={blog.url} className="text-blue-700 hover:underline">
          {blog.url}
        </a>
      </p>
      <p>{blog.likes} likes</p>

      <form action={likeBlog}>
        <input type="hidden" name="id" value={blog.id} />
        <button
          type="submit"
          className="rounded bg-slate-800 px-4 py-1.5 text-slate-100"
        >
          like
        </button>
      </form>

      {userId !== null && !isOwnBlog && !alreadyInList && (
        <form action={addToReadingList}>
          <input type="hidden" name="blogId" value={blog.id} />
          <button
            data-testid="add-to-reading-list-button"
            type="submit"
            className="rounded bg-blue-700 px-4 py-1.5 text-slate-100"
          >
            add to reading list
          </button>
        </form>
      )}
    </div>
  )
}

export default BlogPage
