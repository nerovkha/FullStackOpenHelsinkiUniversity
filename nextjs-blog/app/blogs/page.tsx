import Link from "next/link"
import { desc, ilike } from "drizzle-orm"
import { db } from "@/db"
import { blogs } from "@/db/schema"

const Blogs = async ({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) => {
  const { filter } = await searchParams

  const allBlogs = filter
    ? await db
        .select()
        .from(blogs)
        .where(ilike(blogs.title, `%${filter}%`))
        .orderBy(desc(blogs.likes))
    : await db.select().from(blogs).orderBy(desc(blogs.likes))

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">blogs</h1>

      <form action="/blogs" className="mb-4 flex gap-2">
        <input
          data-testid="filter-input"
          type="text"
          name="filter"
          defaultValue={filter ?? ""}
          placeholder="filter by title"
          className="flex-1 rounded border border-slate-300 px-3 py-1.5"
        />
        <button
          data-testid="search-button"
          type="submit"
          className="rounded bg-slate-800 px-4 py-1.5 text-slate-100"
        >
          search
        </button>
      </form>

      <ul data-testid="blogs-list" className="space-y-2">
        {allBlogs.map((blog) => (
          <li key={blog.id} className="rounded border border-slate-200 bg-white p-3">
            <Link href={`/blogs/${blog.id}`} className="font-semibold text-blue-700 hover:underline">
              {blog.title}
            </Link>{" "}
            by {blog.author}, {blog.likes} likes
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Blogs
