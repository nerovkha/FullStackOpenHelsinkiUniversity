import { redirect } from "next/navigation"
import Link from "next/link"
import { eq } from "drizzle-orm"
import { db } from "@/db"
import { users, readingList, blogs } from "@/db/schema"
import { auth } from "@/auth"
import { generateToken, markAsRead } from "@/app/actions"

const Me = async () => {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/login")
  }

  const userId = Number(session.user.id)

  const [user] = await db.select().from(users).where(eq(users.id, userId))

  const list = await db
    .select({
      entryId: readingList.id,
      read: readingList.read,
      blogId: blogs.id,
      title: blogs.title,
      author: blogs.author,
    })
    .from(readingList)
    .innerJoin(blogs, eq(readingList.blogId, blogs.id))
    .where(eq(readingList.userId, userId))

  const unread = list.filter((entry) => !entry.read)
  const read = list.filter((entry) => entry.read)

  return (
    <div className="space-y-8">
      <section data-testid="user-profile">
        <h1 className="mb-2 text-2xl font-bold">my page</h1>
        <p data-testid="user-name" className="text-lg">
          {user.name}
        </p>
        <p data-testid="user-username" className="text-slate-600">
          {user.username}
        </p>
      </section>

      <section data-testid="reading-list-section">
        <h2 className="mb-2 text-xl font-semibold">reading list</h2>
        {list.length === 0 ? (
          <p data-testid="empty-reading-list" className="text-slate-600">
            your reading list is empty
          </p>
        ) : (
          <>
            <div data-testid="unread-section">
              <h3 className="mb-1 font-semibold">unread</h3>
              {unread.length === 0 ? (
                <p data-testid="no-unread-blogs" className="text-slate-600">
                  no unread blogs
                </p>
              ) : (
                <ul className="space-y-1">
                  {unread.map((entry) => (
                    <li key={entry.entryId} className="flex items-center gap-2">
                      <Link
                        href={`/blogs/${entry.blogId}`}
                        className="text-blue-700 hover:underline"
                      >
                        {entry.title}
                      </Link>
                      <form action={markAsRead}>
                        <input type="hidden" name="id" value={entry.entryId} />
                        <button
                          data-testid={`mark-read-${entry.entryId}`}
                          type="submit"
                          className="rounded border border-slate-400 px-2 py-0.5 text-sm"
                        >
                          mark as read
                        </button>
                      </form>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div data-testid="read-section" className="mt-4">
              <h3 className="mb-1 font-semibold">read</h3>
              {read.length === 0 ? (
                <p data-testid="no-read-blogs" className="text-slate-600">
                  no read blogs yet
                </p>
              ) : (
                <ul className="space-y-1">
                  {read.map((entry) => (
                    <li key={entry.entryId}>
                      <Link
                        href={`/blogs/${entry.blogId}`}
                        className="text-blue-700 hover:underline"
                      >
                        {entry.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </section>

      <section data-testid="api-token-section">
        <h2 className="mb-2 text-xl font-semibold">API token</h2>
        {user.token ? (
          <div data-testid="token-display">
            <p className="text-slate-600">your current token:</p>
            <code data-testid="api-token" className="block break-all rounded bg-slate-200 p-2 text-sm">
              {user.token}
            </code>
          </div>
        ) : (
          <p data-testid="no-token-message" className="text-slate-600">
            no token generated yet
          </p>
        )}
        <form action={generateToken} className="mt-2">
          <button
            data-testid="generate-token-button"
            type="submit"
            className="rounded bg-slate-800 px-4 py-1.5 text-slate-100"
          >
            {user.token ? "regenerate token" : "generate token"}
          </button>
        </form>
      </section>
    </div>
  )
}

export default Me
