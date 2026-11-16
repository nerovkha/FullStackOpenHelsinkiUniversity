import Link from "next/link"
import { db } from "@/db"
import { users } from "@/db/schema"

const Users = async () => {
  const allUsers = await db.select().from(users)

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">users</h1>
      <ul className="space-y-2">
        {allUsers.map((user) => (
          <li key={user.id} className="rounded border border-slate-200 bg-white p-3">
            <Link
              href={`/users/${user.username}`}
              className="font-semibold text-blue-700 hover:underline"
            >
              {user.name}
            </Link>{" "}
            ({user.username})
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Users
